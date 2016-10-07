import noop from 'lodash/noop'

function defaultGetId(data) {
  return data.id
}

function getCurdRepository(basePath, pathObj = {}, options = {}) {
  const beforeAjax = options.beforeAjax || noop;
  const afterAjax = options.afterAjax || noop;

  return {

    $get(payload) {
      beforeAjax();
      return ajax.get({
        url: pathObj.get || basePath,
        data: payload
      }).then((data)=> {
        afterAjax();
        return data;
      });
    },

    $post(payload, getId = defaultGetId) {
      beforeAjax();

      return ajax.post({
        url: pathObj.post || `${basePath}/${getId(payload)}`,
        data: payload
      }).then((data)=> {
        afterAjax();
        return data;
      });
    },

    $delele(getId = defaultGetId) {
      beforeAjax();

      return ajax.delete({
        url: pathObj.delete || `${basePath}/${getId(payload)}`,
      }).then((data)=> {
        afterAjax();
        return data;
      });
    },

    $put(getId = defaultGetId) {
      beforeAjax();

      return ajax.put({
        url: pathObj.put || `${basePath}/${getId(payload)}`,
      }).then((data)=> {
        afterAjax();
        return data;
      });
    },

    $search() {

    },

    $sort() {

    }
  }

}