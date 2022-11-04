import service from "../utils/request";

// 获取归档列表
export function getArchives() {
    return service({
        url: "/article/core/articles/archives",
        method: "get",
    });
}

// 查询文章列表
export function getArticles() {
    return service({
        url: "/article/core/articleList",
        method: "get",
    });
}

// 查询文章内容
export function getArticle(articleId) {
    return service({
        url: "article/core/articleFrontList/" + articleId,
        method: "get"
    });
}

// 根据文章id查询评论列表
export function getComments(query) {
    return service({
        url: "/comment/core/listComments",
        method: "get",
        params: query
    });
}

// 给文章点赞
export function addLike(articleId, userId) {
    return service({
        url: "/article/core/"+userId+"/"+articleId+"/like",
        method: 'post',
    })
}

// 根据分类列表
export function getCategories() {
    return service({
        url: "/category/core/categoryList",
        method: "get"
    });
}

// 根据分类查询文章列表
export function getCategoryArticles(query) {
    return service({
        url: "/article/core/articles/condition",
        method: "get",
        params: query
    });
}

// 获取标签列表
export function getTags() {
    return service({
        url: "/tag/core/tagList",
        method: "get"
    });
}
