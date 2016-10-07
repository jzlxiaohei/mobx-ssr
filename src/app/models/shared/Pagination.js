import { observable, action, computed } from 'mobx'
import _ from 'lodash';
import neoAjax from '../../utils/neoAjax';
import makeObs from '../../infrastructure/makeObservable';

const fields = {
  data: [],
  total: 0,
  pageSize: 20,
  curPage: 1,
  loading: false,
  error: ''
};

class Pagination {

  ajax = neoAjax;

  payload = {}; //公用的payload

  constructor(path) {
    this.path = path;
    makeObs(this, fields);
  }

  /**
   * Process Data by default data structure as below. If server response data don't fit it, pk backend...
   *
   * {
   *    `ListFieldName`:[],
   *    total: 999,
   *    currentPage //optional
   * }
   *
   *
   * can be override in subClass
   *
   * set total ; set list ; set curPage
   *
   */


  setPath(path) {
    this.path = path;
  }

  @action setList(list) {
    this.list = list;
  }

  @action
  showLoading() {
    this.loading = true;
  }

  @action
  hideLoading() {
    this.loading = false;
  }

  @action setError(error) {
    this.error = error;
  }

  @action setCurPage(page) {
    this.curPage = page;
  }

  @action
  setPageSize(pageSize) {
    this.pageSize = pageSize;
  }

  @action
  ProcessPageData(pageObj) {
    this.assign({
      curPage: pageObj.currentPage || this.curPage,
      total: pageObj.total
    });
    for (var i in pageObj) {
      if (i !== 'total' && i !== 'currentPage') {
        this.setList(pageObj[i]);
        break;
      }
    }
  }

  @action reqSuccess(pageObj, page) {
    this.hideLoading();
    this.ProcessPageData(pageObj);
    this.setCurPage(page);
  }

  @action reqError(err) {
    this.hideLoading();
    this.setError(err);
  }

  @action
  request(page, localOptions, usePublicPayload = true) {
    page = page || this.curPage;
    const publicPayload = usePublicPayload ? this.payload : {};
    const newPayload = _.assign({
      page,
      pageSize: this.pageSize
    }, publicPayload, localOptions);
    this.showLoading();
    return this.ajax.get({
      data: newPayload,
      path: this.path
    })
      .then(pageObj => {
        this.reqSuccess(pageObj, page);
        return pageObj;
      })
      .catch(err => {
        this.reqError(err);
      })
  }

  @computed get antd() {
    return {
      current: this.curPage,
      pageSize: this.pageSize,
      showQuickJumper: true,
      showSizeChanger: true,
      pageSizeOptions: this.pageSizeOptions || [
        '10',
        '20',
        '50',
        '100',
        '200'
      ],
      total: this.total,
      onChange: (page)=> {
        this.request(page);
        if (this.onPageChange) {
          this.onPageChange(page);
        }
      },
      onShowSizeChange: (currentPage, pageSize)=> {
        this.setPageSize(pageSize);
        // this.request(currentPage);
        if (this.onPageSizeChange) {
          this.onPageSizeChange(currentPage, pageSize);
        }
      },
      showTotal: (total)=> {
        return `共 ${total} 条`
      }
    }
  }

}

export default Pagination