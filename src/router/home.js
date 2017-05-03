/*
* @Author: William
* @Date:   2017-04-27 15:49:07
* @Last Modified by:   William Chan
* @Last Modified time: 2017-05-03 15:00:35
*/
export default [
  {
    path: '/home',
    name: 'home',
    redirect: { name: 'home_test' },
    meta: { parent: 'home' },
    components: {
      tabbar: () => import('@/components/tabbar.vue'),
      main: () => import('@/components/main.vue'),
    },
    children: [
      {
        name: 'home_test',
        path: 'test',
        component: () => import('@/views/home/test.vue'),
      },
    ],
  },
];
