const ReactDOMServer = require('react-dom/server');
const React = require('react');
import { match, RouterContext } from 'react-router'
import routes from './src/app/routeConfig'
import { Provider } from 'mobx-react';
function generateHtml(data, reactStr) {
  return `
<!DOCTYPE html>
<html>
<head>
    <title>流利说-运营平台</title>
    <style>#root a{text-decoration:none; color:black}</style>
    ${data ? '<script>window.__mobx_init_store=' + JSON.stringify(data) + '</script>' : ''}
</head>
<body>
    <div id="root">${reactStr}</div>
    <script src="//cdn.llsapp.com/fe/vendor/react-dom-router-addons.js"></script>
    <script src="/main.js"></script>
</body>
</html>

`
}


module.exports = function (app) {

  // app.use('/home', (req, res)=> {
  //   const initStoreProps = Home.getInitStoreProps();
  //   Home.initData(initStoreProps).then((storeProps)=> {
  //     const reactContent = ReactDOMServer.renderToStaticMarkup(<Home {...storeProps}/>);
  //     const storeName = Home.storeName;
  //     let data;
  //     if (storeName) {
  //       data = { [storeName]: storeProps }
  //     }
  //     res.send(generateHtml(data, reactContent));
  //   });
  // });

  app.use('*', (req, res)=> {
    // Note that req.url here should be the full URL path from
    // the original request, including the query string.
    match({
      routes,
      location: req.originalUrl
    }, (error, redirectLocation, renderProps) => {
      if (error) {
        res.status(500).send(error.message)
      } else if (redirectLocation) {
        res.redirect(302, redirectLocation.pathname + redirectLocation.search)
      } else if (renderProps) {
        // You can also check renderProps.components or renderProps.routes for
        // your "not found" component or route respectively, and send a 404 as
        // below, if you're using a catch-all route.

        // https://github.com/facebook/react/pull/6618
        // if this pr accepted, renderToStaticMarkup is ok. maybe <RouterContext/> and <Provider/> is not needed.
        const components = renderProps.components;
        const allPromise = [];
        const allStoreName = [];
        const params = renderProps.params;
        const query = renderProps.location.query;
        components.forEach((comp)=> {
          if (comp.initData && comp.getInitStoreProps) {
            allPromise.push(comp.initData(comp.getInitStoreProps(), params, query));
            allStoreName.push(comp.storeName);
          }
        });

        Promise.all(allPromise).then(storePropsList=> {
          console.log(storePropsList);
          const props = {};
          storePropsList.forEach((storeProps, index)=> {
            props[allStoreName[index]] = storeProps;
          });
          const str = ReactDOMServer.renderToString(<Provider {...props}>
            <RouterContext {...renderProps}/>
          </Provider>);

          res.status(200).send(generateHtml(props, str))
        });
        // Page.initData(initStoreProps, renderProps.params, renderProps.location.query).then(storeProp=> {
        //   // const str = ReactDOMServer.renderToStaticMarkup(<Layout>
        //   //   <Page {...storeProp}/>
        //   // </Layout>);
        //
        //   const storeMap = { [storeName]: storeProp };
        //   const str = ReactDOMServer.renderToStaticMarkup(<Provider {...storeMap}>
        //     <RouterContext {...renderProps}/>
        //   </Provider>);
        //
        //   res.status(200).send(generateHtml({
        //     [storeName]: storeProp
        //   }, str))
        // });

      } else {
        res.status(404).send('Not found')
      }
    })
  });
};


