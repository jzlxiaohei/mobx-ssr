import isString from 'lodash/isString';
import { extendObservable } from 'mobx';
import forOwn from 'lodash/forOwn';
import { Validators } from './validatorRules'

/**
 *
 * @param model
 * @param rules: { filedName(string): fn(function) | string in Validator }
 * @param lazy: boolean. if lazy true, there is no @computed function
 * @returns {*}
 */

function addRules(model, rules, lazy = false) {

  if (process.env.NODE_ENV !== 'production') {
    if ($validState in model) {
      throw new Error(`you should add rules only once`);
    }
    forOwn(rules, (value, key)=> {
      if (!(key in model)) {
        throw new Error(`${key} in rules but not in model`)
      }
    });
  }


  model.$validState = model.$validState || {};
  model.$untrackValidState = {};

  model.$validCheck = ()=> {
    let isStateValid = true;
    const info = {};
    forOwn(rules, (value, key)=> {
      let checkFn = rules[key];
      if (isString(checkFn)) {
        checkFn = Validators[value]
      }
      const checkResult = checkFn[model[key]];
      if (isString(checkResult)) {
        isStateValid = false;
        info[i] = checkResult;
      }
    });
    return {
      isStateValid,
      info
    };
  };

  if (!lazy) {
    const computedFns = {};

    // TODO next major version of mobx (3.x) will not auto convert no-argument function to `computed`, make it explicit. see url below
    // https://github.com/mobxjs/mobx/issues/532
    forOwn(rules, (value, key)=> {
      computedFns[key] = ()=> {
        const checkFn = rules[key];
        return checkFn(model[key]);
      };
    });

    extendObservable(model.$validState, computedFns);
  }

  return model;
}

export default addRules;