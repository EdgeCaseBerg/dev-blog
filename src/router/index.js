import Vue from "vue";
import VueRouter from "vue-router";
import DevBlog from "../views/DevBlog.vue";
import Home from "../views/Home.vue";
import DevBlogPost from "../components/DevBlogPost.vue";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/dev-blog",
    component: DevBlog,
  },
  {
    path: "/dev-blog/:id",
    component: DevBlogPost,
  },
];

const router = new VueRouter({
  routes,
});

export default router;
