import * as cssModule from 'css';
import { Request, Response } from 'express';
import * as fs from 'fs';
import * as path from 'path';

import { getFirst } from '../../item-manager';
import logger from '../../logger';
import stylus from '../../stylus';

function getSafeItemName(itemName: any) {
  return path.basename(itemName).split('.')[0];
}

// TODO: move name spacing processing to a separate module
function addNamespacesCSSToResponse(css: any, namespace: any, response: Response) {
  response.write('<style>');
  addNamespace(css, response, namespace);
  response.write('</style>');
}

function namespaceRulesAST(rules: any, widgetNamespace: any) {
  rules.forEach((rule: any) => {
    if (rule.selectors) {
      rule.selectors = rule.selectors.map((selector: any) => {
        if (selector === '@font-face') {
          return selector;
        }
        // it is important to set the right specificity to widget rules can precede the default ones
        return `#widgets-container > ul > li[data-widget-id="${widgetNamespace}"] ${selector}`;
      });
    }
    // Handle rules within media queries
    if (rule.rules) {
      namespaceRulesAST(rule.rules, widgetNamespace);
    }
  });
}

function addNamespace(css: any, response: Response, widgetNamespace: any) {
  if (css) {
    try {
      const cssAST: cssModule.Stylesheet = cssModule.parse(css.toString());
      namespaceRulesAST(cssAST.stylesheet.rules, widgetNamespace);
      response.write(cssModule.stringify(cssAST));
    } catch (e) {
      logger().error(e);
    }
  }
}

// ---------------------------------------------------------------
// Render specific resource for a widget
// - resource format: <package>/<widget>/<resource>
//   ex: atlassian/blockers/icon.png
// ---------------------------------------------------------------
export function renderWidgetResource(localPackagesPath: any,
                                     resource: any,
                                     request: Request,
                                     response: Response) {
  // Sanitization
  const input = resource.split('/');
  const packageName = input[0];
  const widgetName = input[1];
  const resourceName = input[2];

  // TODO: add extra sensitization
  const resourcePath = path.join(
    localPackagesPath,
    packageName,
    'widgets',
    widgetName,
    resourceName,
  );

  if (!resource) {
    response.status(400).send('resource id not specified');
  } else if (input.length !== 3) {
    response.status(400).send('bad input');
  } else if (fs.existsSync(resourcePath)) {
    response.sendFile(resourcePath);
  } else {
    response.status(404).send('resource not found');
  }
}

// ---------------------------------------------------------------
// Render JS for a specific widget
// ---------------------------------------------------------------
export function renderJsWidget(packagesPath: any,
                               widgetName: any,
                               request: Request,
                               response: Response) {
  response.type('application/javascript');

  const safeWidgetName = getSafeItemName(widgetName);

  getFirst(packagesPath, safeWidgetName, 'widgets', '.js', (error: any, jsFile: any) => {
    if (error || !jsFile) {
      const msg = error ? error : `JS file not found for widget ${widgetName}`;
      logger().error(msg);
      response.status(400).send(`Error rendering widget: ${msg}`);
    } else {
      response.sendFile(jsFile);
    }
  });
}

function getFileContents(extension: any, widgetName: any, packagesPath: any, callback: any) {
  // tslint:disable-next-line no-shadowed-variable
  getFirst(packagesPath, widgetName, 'widgets', extension, (error: any, path: any) => {
    if (error || !path) {
      return callback(error ? error : 'File does not exist');
    }

    fs.readFile(path, 'utf-8', callback);
  });
}

function loadHTML(response: Response, widgetName: any, packagesPath: any, cb: any) {
  getFileContents('.html', widgetName, packagesPath, (error: any, html: any) => {
    if (!error && html) {
      response.write(html);
    }
    cb(error);
  });
}

function loadCSSIfPresent(response: Response, widgetName: any, packagesPath: any, cb: any) {
  getFileContents('.css', widgetName, packagesPath, (error: any, css: any) => {
    if (!error && css) {
      addNamespacesCSSToResponse(css, widgetName, response);
    }
    cb(error);
  });
}

function loadStylusIfPresent(response: Response, widgetName: any, packagesPath: any, cb: any) {
  getFileContents('.styl', widgetName, packagesPath, (error: any, stylusContent: any) => {
    if (!error && stylusContent) {
      stylus().getWidgetCSS(stylusContent, (stylusError: any, css: any) => {
        if (!stylusError) {
          addNamespacesCSSToResponse(css, widgetName, response);
        } else {
          logger().error(stylusError);
        }
        cb(stylusError);
      });
    } else {
      cb(error);
    }
  });
}

// ---------------------------------------------------------------
// Render HTML and styles (CSS/Stylus)
// ---------------------------------------------------------------
export function renderHtmlWidget(packagesPath: any,
                                 widgetName: any,
                                 request: Request,
                                 response: Response) {
  const safeWidgetName = getSafeItemName(widgetName);

  response.type('text/html');

  loadStylusIfPresent(response, safeWidgetName, packagesPath, () => {
    loadCSSIfPresent(response, safeWidgetName, packagesPath, () => {
      loadHTML(response, safeWidgetName, packagesPath, (error: any) => {
        if (error) {
          response.status(500).send(`Error rendering widget: ${error}`);
        } else {
          response.end();
        }
      });
    });
  });
}

export function log(request: Request, response: Response) {
  response.render(path.join(__dirname, '../..', 'templates', 'dashboard-log.ejs'));
}
