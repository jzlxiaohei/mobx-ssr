import Layout from './pages/Layout';
import Home from './pages/home/Home';
import About from './pages/about/About';

const routes = {
  path: '/',
  component: Layout,
  indexRoute: { component: Home },
  childRoutes: [
    {
      path: 'about/:id',
      component: About
    }
  ]
};

export default routes;