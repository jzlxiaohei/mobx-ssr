import React from 'react';
import { render } from 'react-dom';
import routeConfig from './app/routeConfig';
import { Router, browserHistory } from 'react-router';
import perf from 'react-addons-perf';
import { Provider } from 'mobx-react'

window.perf = perf;
perf.start();
setTimeout(()=> {
  perf.stop();
  perf.printOperations();
});

const rootEl = document.getElementById('root');
// const initStore = window.__mobx_init_store ? window.data : {};

render((
  <Provider>
    <Router routes={routeConfig} history={browserHistory}/>
  </Provider>
), rootEl);
