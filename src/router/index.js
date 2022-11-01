import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    component: resolve => require(["../views/home/Home.vue"], resolve)
  },
  {
    path: "/articles/:articleId",
    component: resolve => require(["../views/article/Article.vue"], resolve)
  },
  {
    path: "/archives",
    component: resolve => require(["../views/archive/Archive.vue"], resolve),
    meta: {
      title: "陶瓷博物展馆-归档"
    }
  },
  {
    path: "/albums",
    component: resolve => require(["../views/album/Album.vue"], resolve),
    meta: {
      title: "陶瓷博物展馆-相册"
    }
  },
  {
    path: "/albums/:albumId",
    component: resolve => require(["../views/album/Photo.vue"], resolve)
  },
  {
    path: "/tags",
    component: resolve => require(["../views/tag/Tag.vue"], resolve),
    meta: {
      title: "陶瓷博物展馆-标签"
    }
  },
  {
    path: "/categories",
    component: resolve => require(["../views/category/Category.vue"], resolve),
    meta: {
      title: "陶瓷博物展馆-分类"
    }
  },
  {
    path: "/categories/:categoryId",
    component: resolve => require(["../views/article/ArticleList.vue"], resolve)
  },
  {
    path: "/tags/:tagId",
    component: resolve => require(["../views/article/ArticleList.vue"], resolve)
  },
  {
    path: "/links",
    component: resolve => require(["../views/link/Link.vue"], resolve),
    meta: {
      title: "陶瓷博物展馆-友链"
    }
  },
  {
    path: "/siteNavigation",
    component: resolve => require(["../views/siteNavigation/siteNavigation.vue"], resolve),
    meta: {
      title: "陶瓷博物展馆-购物车"
    }
  },
  {
    path: "/reception",
    component: resolve => require(["../views/siteNavigation/reception.vue"], resolve),
    meta: {
      title: "陶瓷博物展馆-待收货"
    }
  },
  {
    path: "/payment",
    component: resolve => require(["../views/siteNavigation/Pay.vue"], resolve),
    meta: {
      title: "陶瓷博物展馆-支付页面"
    }
  },
  {
    path: "/message",
    component: resolve => require(["../views/message/Message.vue"], resolve),
    meta: {
      title: "陶瓷博物展馆-留言板"
    }
  },
  {
    path: "/user",
    component: resolve => require(["../views/user/User.vue"], resolve),
    meta: {
      title: "陶瓷博物展馆-个人中心"
    }
  },
  {
    path: "/oauth/login/qq",
    component: resolve => require(["../components/OauthLogin.vue"], resolve)
  },
  {
    path: "/oauth/login/weibo",
    component: resolve => require(["../components/OauthLogin.vue"], resolve)
  }
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes
});

export default router;
