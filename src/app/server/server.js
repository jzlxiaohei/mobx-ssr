import Home from '../pages/home/Home';
const ReactDOMServer = require('react-dom/server');
const React = require('react');


function generateHtml(data, reactStr) {
  return `
<!DOCTYPE html>
<html>
<head>
    <base href="/v2"/>
    <title>流利说-运营平台</title>
    <script>window.__mobx_init_store = ${JSON.stringify(data)}</script>
</head>
<body>
    <div id="root">${reactStr}</div>
    <script src="//cdn.llsapp.com/fe/vendor/react-dom-router-addons.js"></script>
    <script src="main.js"></script>
</body>
</html>

`
}

const initStoreProps = Home.getInitStoreProps();
Home.initData(initStoreProps).then((storeProps)=> {
  const reactContent = ReactDOMServer.renderToStaticMarkup(<Home {...storeProps}/>);
  console.log(generateHtml(storeProps, reactContent));
});