import Vue from 'vue';
import VueRouter from 'vue-router';
import Home from '@/views/Home.vue';
import Station from '@/views/Station.vue';
import Request from '@/views/Request.vue';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
  },
  {
    path: '/request',
    name: 'Request',
    component: Request,
  },
  {
    path: '/station',
    name: 'Station',
    component: Station,
  },
  {
    path: '/station/:id',
    name: 'Station',
    component: Station,
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/About.vue'),
  },
];

const router = new VueRouter({
  routes,
});

export default router;
