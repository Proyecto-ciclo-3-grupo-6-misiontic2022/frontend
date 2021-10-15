import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import decode from "jwt-decode";
Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "Home",
    component: Home,
  },
  {
    path: "/about",
    name: "About",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "about" */ "../views/About.vue"),
  },
  {
    path: "/login",
    name: "Login",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "login" */ "../views/Login.vue"),
  },
  {
    path: "/admin",
    name: "Admin",
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () =>
      import(/* webpackChunkName: "admin" */ "../views/Admin.vue"),
    meta: { requiresAuth: true },
    children: [
      {
        path: "usuarios",
        name: "Usuarios",
        component: () =>
          import(
            /* webpackChunkName: "usuarioDT" */ "../components/UsuarioDT.vue"
          ),
        meta: { requiresAdmin: true },
      },
      {
        path: "categorias",
        name: "Categorias",
        component: () =>
          import(
            /* webpackChunkName: "categoriaDT" */ "../components/CategoriaDT.vue"
          ),
        //meta: { requiresAdmin: true },
      },
      {
        path: "articulos",
        name: "Articulos",
        component: () =>
          import(
            /* webpackChunkName: "articuloDT" */ "../components/ArticuloDT.vue"
          ),
        //meta: { requiresAdmin: true },
      },
    ],
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});
router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    let token = decode(localStorage.getItem("token"));
    if (!token) {
      next({
        path: "Login",
        // query: { redirect: to.fullPath }
      });
    } else {
      if (to.matched.some(record => record.meta.requiresAdmin)) {
        if (token["rol"] === 'Administrador') {
          next();
        } else {
          next({
            name: "Admin",
            // query: { redirect: to.fullPath }
          });
        }
      } else {

        next();
      }
    }
  } else {
    next(); // make sure to always call next()!
  }
});
export default router;
