import Vue from 'vue';
import VueRouter from 'vue-router';
import { isDevelop, setWechatTitle } from '@/utils/util';
// Module Route
import topRoute from '@/router/top';
import homeRoute from '@/router/home';
import msgRoute from '@/router/msg';
import secretRoute from '@/router/secret';
import meRoute from '@/router/me';
import debugeRoute from '@/router/debug';
import { getAuthorization, store } from '@/store';
import ProgressBar from '@/components/progressbar';

// install ProgressBar
const bar = new Vue(ProgressBar).$mount();
document.body.appendChild(bar.$el);
// added alias for vue vm $bar!
Vue.prototype.$bar = bar;

Vue.use(VueRouter);
let routes = [].concat(
  homeRoute, msgRoute, secretRoute, meRoute,
  topRoute,
);

if (isDevelop()) {
  routes = routes.concat(debugeRoute);
}
const router = new VueRouter({
  base: __dirname,
  // base: 'test',
  routes,
  mode: 'history',
  scrollBehavior() {
    return { x: 0, y: 0 };
  },
});

router.beforeResolve((to, from, next) => {
  const matched = router.getMatchedComponents(to);
  const prevMatched = router.getMatchedComponents(from);
  const activated = matched.filter((func, i) => prevMatched[i] !== func);
  const asyncDataHooks = activated.map(c => c.asyncData).filter(_ => _);
  if (!asyncDataHooks.length) {
    bar.finish();
    next();
  } else {
    Promise.all(asyncDataHooks.map(hook => hook({ store, route: to }))).then(() => {
      bar.finish();
      next();
    }).catch(next);
  }
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  let params;
  const user = await getAuthorization();
  if (!user) {
    if (requiresAuth) {
      params = { name: 'debug', query: { redirect: to.fullPath } };
    }
  } else if (!requiresAuth) {
    if (to.query.redirect) {
      params = { path: to.query.redirect };
    }
  }
  next(params);
});

router.afterEach((route) => {
  if (route.meta.title) {
    setWechatTitle(route.meta.title);
  }
});
// router.onError((callback) => {
//   console.log(callback);
// });
//
export default router;
