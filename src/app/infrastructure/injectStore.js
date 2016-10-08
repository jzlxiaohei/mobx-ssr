import React, { PropTypes } from 'react';
import hoistNonStatics from 'hoist-non-react-statics';
import isFunction from 'lodash/isFunction';
import { observer } from 'mobx-react';
import assign from 'lodash/assign';
import { extendObservable } from 'mobx';
import isNode  from './isNode';

const isBrowser = !isNode;

function PromiseIdFn(a) {
  return Promise.resolve(a);
}

function createStoreProps(storeMap, props) {
  const storeProps = {};
  for (let i in storeMap) {
    const Ctor = storeMap[i];
    if (isFunction(Ctor)) {
      storeProps[i] = new Ctor();
      if (props && props[i]) {
        assign(storeProps[i], props[i])
      }
    } else {
      storeProps[i] = Ctor.userInstance;
    }
  }
  return storeProps;
}


function assignByPlainData(data) {
  const storeProps = {};
  extendObservable(storeProps, data);
  return storeProps;
}

function getInitStore(storeName, context) {
  let data;
  if (context.mobxStores && context.mobxStores[storeName]) {
    data = context.mobxStores[storeName];
  } else if (isBrowser && window.__mobx_init_store && window.__mobx_init_store[storeName]) {
    data = window.__mobx_init_store[storeName];
  }
  return data;
}


function trusy() {
  return true;
}

function falsy() {
  return false;
}

/**
 *
 * @param options
 *  initData:function. input: options.storeProps, return a promise to
 *    resolve props (always be options.storeProps with some field change) should pass to child components as store.
 *
 *  storeName:string. unique key to detect storeProps. duplicated storeName or lack of storeName will lead error.
 *
 *  storeMap:object. {key:Constructor} or {key:{useInstance: instance}}. your component can use this.props[key] to access the instance.
 *
 */

function injectStore(options) {

  const { storeMap, initData = PromiseIdFn, storeName } = options;

  const shouldReInitData = isNode ? falsy : (options.shouldReInitData || trusy);

  if (process.env.NODE_ENV !== 'production') {
    if (!storeName) {
      throw new error('you should provide storeName in injectStore');
    }
    if (isBrowser) {
      window.__storeNameMap = window.__storeNameMap || {};
      if (storeName in window.__storeNameMap) {
        throw new error(`duplicated storeName:${storeName}.`);
      }
      window.__storeNameMap[storeName] = '';
    }
  }
  return (component) => {
    @observer
    class ComponentWithStoreInjector extends React.Component {

      static contextTypes = {
        mobxStores: PropTypes.object
      };

      constructor(props, context) {
        super(props, context);
        const initStore = getInitStore(storeName, context);
        if (initStore && !shouldReInitData(initStore)) {
          this.wasInit = true;
          this.storeProps = assignByPlainData(initStore);
        } else {
          this.storeProps = createStoreProps(storeMap, props);
        }
      }

      componentDidMount() {
        const props = this.props;
        if (!this.wasInit) {
          initData(this.storeProps, props.params, props.location && props.location.query);
        }
      }

      render() {
        return React.createElement(component, this.storeProps);
      }
    }

    ComponentWithStoreInjector.wrappedComponent = component;
    ComponentWithStoreInjector.initData = initData;
    ComponentWithStoreInjector.storeMap = storeMap;
    ComponentWithStoreInjector.getInitStoreProps = ()=> createStoreProps(storeMap);
    ComponentWithStoreInjector.storeName = storeName;
    hoistNonStatics(ComponentWithStoreInjector, component);
    return ComponentWithStoreInjector
  }
}

export default injectStore;