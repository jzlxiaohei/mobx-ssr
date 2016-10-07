import get from 'lodash/get';
import template from 'lodash/template';

function getText(i18nConfig, fieldPath, values) {
  const i18Tpl = get(i18nConfig, fieldPath);
  return template(i18Tpl, values || []);
}

export default getText