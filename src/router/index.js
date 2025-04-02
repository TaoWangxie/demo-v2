import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

export const routes = [
  {
    path: "/",
    name: "Layout",
    component: () => import("@/Layout"),
    redirect: { path: "/home" },
    children: [
      {
        path: "/home",
        name: "Home",
        component: () => import("@/views/home"),
        mate: {
          title: " 主页",
        },
      },
      {
        path: "/dataConfig",
        name: "dataConfig",
        component: () => import("@/views/dataConfig"),
        mate: {
          title: " 数据配置中心",
        },
      },
    ],
  },
  {
    path: "/workSpace",
    name: "WorkSpace",
    component: () => import("@/views/workSpace"),
    mate: {
      title: "工作台",
    },
  },
  {
    path: "/demo",
    name: "demo",
    component: () => import("@/views/demo"),
    mate: {
      title: "demo",
    },
  },
  {
    path: "/h5Canvas",
    name: "h5Canvas",
    component: () => import("@/views/h5Canvas"),
    mate: {
      title: "画布",
    },
  },
  {
    path: "/test",
    name: "test",
    component: () => import("@/views/test"),
    mate: {
      title: "test",
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
