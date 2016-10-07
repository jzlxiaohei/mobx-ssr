import keyMirror from 'keymirror';

const Validators = {
  min: function (value, len) {
    if (value.length < len) {
      return `最小长度不能小于${len}`
    }
  },
  max: function (value, len) {
    if (value.length > len) {
      return `最大长度不能小于${len}`
    }
  },
  required: function (value) {
    if (value === undefined || value === null || value === '') {
      return `值不能为空`
    }
  }
};

let ValidatorTypes = keyMirror(Validators);

function addValidator(key, fn, needRefreshTypes) {
  if (key in Validators) {
    console.warn(`${key} has already been in Validator, old validator will be override`);
  }
  Validators[key] = fn;
  if (needRefreshTypes) {
    ValidatorTypes = keyMirror(Validators);
  }
}

function refreshValidatorTypes() {
  ValidatorTypes = keyMirror(Validators);
}


export { Validators, ValidatorTypes, addValidator, refreshValidatorTypes }