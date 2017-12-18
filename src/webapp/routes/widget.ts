import * as cssModule from 'css';
import * as fs from 'fs';
import * as path from 'path';

import { getFirst } from '../../item-manager';
import logger from '../../logger';
import stylus from '../../stylus';

function getSafeItemName(itemName: any) {
  return path.basename(itemName).split('.')[0];
}

// TODO: move name spacing processing to a separate module
function addNamespacesCSSToResponse(css: any, namespace: any, res: any) {
  res.write('<style>');
  addNamespace(css, res, namespace);
  res.write('</style>');
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

function addNamespace(css: any, res: any, widgetNamespace: any) {
  if (css) {
    try {
      const cssAST = cssModule.parse(css.toString());
      namespaceRulesAST(cssAST.stylesheet.rules, widgetNamespace);
      res.write(cssModule.stringify(cssAST));
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
export function renderWidgetResource(localPackagesPath: any, resource: any, req: any, res: any) {
  if (!resource) {
    return res.status(400).send('resource id not specified');
  }
  // Sanitization
  const input = resource.split('/');
  if (input.length !== 3) {
    return res.status(400).send('bad input');
  }
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
  if (fs.existsSync(resourcePath)) {
    res.sendFile(resourcePath);
  } else {
    return res.status(404).send('resource not found');
  }
}

// ---------------------------------------------------------------
// Render JS for a specific widget
// ---------------------------------------------------------------
export function renderJsWidget(packagesPath: any, widgetName: any, req: any, res: any) {
  res.type('application/javascript');

  const safeWidgetName = getSafeItemName(widgetName);

  getFirst(packagesPath, safeWidgetName, 'widgets', '.js', (error: any, jsFile: any) => {
    if (error || !jsFile) {
      const msg = error ? error : `JS file not found for widget ${widgetName}`;
      logger().error(msg);
      res.status(400).send(`Error rendering widget: ${msg}`);
    } else {
      res.sendFile(jsFile);
    }
  });
}

function getFileContents(extension: any, widgetName: any, packagesPath: any, cb: any) {
  getFirst(packagesPath, widgetName, 'widgets', extension, (error: any, path: any) => {
    if (error || !path) {
      return cb(error ? error : 'File does not exist');
    }
    fs.readFile(path, 'utf-8', cb);
  });
}

function loadHTML(res: any, widgetName: any, packagesPath: any, cb: any) {
  getFileContents('.html', widgetName, packagesPath, (error: any, html: any) => {
    if (!error && html) {
      res.write(html);
    }
    cb(error);
  });
}

function loadCSSIfPresent(res: any, widgetName: any, packagesPath: any, cb: any) {
  getFileContents('.css', widgetName, packagesPath, (error: any, css: any) => {
    if (!error && css) {
      addNamespacesCSSToResponse(css, widgetName, res);
    }
    cb(error);
  });
}

function loadStylusIfPresent(res: any, widgetName: any, packagesPath: any, cb: any) {
  getFileContents('.styl', widgetName, packagesPath, (error: any, stylusContent: any) => {
    if (!error && stylusContent) {
      stylus().getWidgetCSS(stylusContent, (error: any, css: any) => {
        if (!error) {
          addNamespacesCSSToResponse(css, widgetName, res);
        } else {
          logger().error(error);
        }
        cb(error);
      });
    } else {
      cb(error);
    }
  });
}

// ---------------------------------------------------------------
// Render HTML and styles (CSS/Stylus)
// ---------------------------------------------------------------
export function renderHtmlWidget(packagesPath: any, widgetName: any, req: any, res: any) {
  const safeWidgetName = getSafeItemName(widgetName);

  res.type('text/html');

  loadStylusIfPresent(res, safeWidgetName, packagesPath, () => {
    loadCSSIfPresent(res, safeWidgetName, packagesPath, () => {
      loadHTML(res, safeWidgetName, packagesPath, (error: any) => {
        if (error) {
          res.status(500).send(`Error rendering widget: ${error}`);
        } else {
          res.end();
        }
      });
    });
  });
}

export function log(req: any, res: any) {
  res.render(path.join(__dirname, '../..', 'templates', 'dashboard-log.ejs'));
}
