export function namespaceRulesAST(rules: any, widgetNamespace: any) {
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
