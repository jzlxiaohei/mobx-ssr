import get from 'lodash/get';

function getText(i18nConfig, fieldPath, values) {
  const i18Tpl = get(i18nConfig, fieldPath);
  return _.template(i18Tpl, values);
}

export default getText