import { StyleRules } from 'css';

export function namespaceRulesAST(
  stylesheet: StyleRules | undefined,
  widgetNamespace: string,
): void {
  if (stylesheet && stylesheet.rules) {
    stylesheet.rules.forEach((rule: any) => {
      if (rule.selectors) {
        rule.selectors = rule.selectors.map((selector: any) => {
          // it is important to set the right specificity
          // to widget rules can precede the default ones
          return `#widgets-container > ul > li[data-widget-id="${widgetNamespace}"] ${selector}`;
        });
      }
      // Handle rules within media queries
      if (rule.rules) {
        namespaceRulesAST(rule, widgetNamespace);
      }
    });
  }
}
