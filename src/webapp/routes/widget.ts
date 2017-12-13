import * as cssModule from 'css';
import * as fs from 'fs';
import * as path from 'path';

import {getFirst} from '../../item-manager';
import logger from '../../logger';
import stylus from '../../stylus';

function getSafeItemName(itemName: any) {
  return path.basename(itemName).split('.')[0];
}

// TODO: move namespacing processing to a separate module
function addNamespacesCSSToResponse(css: any, namespace: any, res: any) {
  res.write('<style>');
  addNamespace(css, res, namespace);
  res.write('</style>');
}

function addNamespace(css: any, res: any, widgetNamespace: any) {
  function namespaceRulesAST(rules: any) {
    rules.forEach((rule: any) => {
      if (rule.selectors) {
        rule.selectors = rule.selectors.map((selector: any) => {
          if (selector === '@font-face') {
            return selector;
          }
          // it is important to set the right specificity to widget rules can precede the default ones
          return '#widgets-container > ul > li[data-widget-id="' + widgetNamespace + '"] ' + selector;
        });
      }
      // Handle rules within media queries
      if (rule.rules) {
        namespaceRulesAST(rule.rules);
      }
    });
  }

  if (css) {
    try {
      const cssAST = cssModule.parse(css.toString());
      namespaceRulesAST(cssAST.stylesheet.rules);
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

  // TODO: add extra sanitization
  const resourcePath = path.join(localPackagesPath, packageName, 'widgets', widgetName, resourceName);
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
  widgetName = getSafeItemName(widgetName);
  getFirst(packagesPath, widgetName, 'widgets', '.js', (err: any, jsFile: any) => {
    if (err || !jsFile) {
      const msg = err ? err : 'JS file not found for widget ' + widgetName;
      logger().error(msg);
      res.status(400).send('Error rendering widget: ' + msg);
    } else {
      res.sendFile(jsFile);
    }
  });
}

// ---------------------------------------------------------------
// Render HTML and styles (CSS/Stylus)
// ---------------------------------------------------------------
export function renderHtmlWidget(packagesPath: any, widgetName: any, req: any, res: any) {

  widgetName = getSafeItemName(widgetName);

  function getFileContents(extension: any, cb: any) {
    getFirst(packagesPath, widgetName, 'widgets', extension, (err: any, path: any) => {
      if (err || !path) {
        return cb(err ? err : 'File does not exist');
      }
      fs.readFile(path, 'utf-8', cb);
    });
  }

  function loadHTML(res: any, cb: any) {
    getFileContents('.html', (err: any, html: any) => {
      if (!err && html) {
        res.write(html);
      }
      cb(err);
    });
  }

  function loadCSSIfPresent(res: any, cb: any) {
    getFileContents('.css', (err: any, css: any) => {
      if (!err && css) {
        addNamespacesCSSToResponse(css, widgetName, res);
      }
      cb(err);
    });
  }

  function loadStylusIfPresent(res: any, cb: any) {
    getFileContents('.styl', (err: any, stylusContent: any) => {
      if (!err && stylusContent) {
        stylus.getWidgetCSS(stylusContent, (err: any, css: any) => {
          if (!err) {
            addNamespacesCSSToResponse(css, widgetName, res);
          } else {
            logger().error(err);
          }
          cb(err);
        });
      } else {
        cb(err);
      }
    });
  }

  res.type('text/html');

  loadStylusIfPresent(res, () => {
    loadCSSIfPresent(res, () => {
      loadHTML(res, (err: any) => {
        if (err) {
          res.status(500).send('Error rendering widget: ' + err);
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
