import service from "../utils/request";

// 获取关于我的信息
export function getAbout(query) {
    return service({
        url: "/siteNavigation",
        method: "get",
        params: query
    });
}

// 获取友链列表
export function getLinks() {
    return service({
        url: "/friendLink/core/linkList",
        method: "get"
    });
}

// 保存留言
export function saveMessage(data) {
    return service({
        url: "/message/core/addMessage",
        method: "post",
        data: data
    })
}

// 获取留言列表
export function getMessages() {
    return service({
        url: "/message/core/messageList",
        method: "get"
    })
}

// 修改用户信息
export function updateUserInfo(data) {
    return service({
        url: "/users/info",
        method: "put",
        data: data
    })
}

// 邮箱登录
export function emailLogin(data) {
    return service({
        url: "/userAuth/core/login",
        method: "post",
        data: data
    })
}

// 人脸登录
export function faceLogin(data) {
    return service({
        url: "/userAuth/core/login",
        method: "post",
        data: data
    })
}

// 获取导航网站列表
export function getSiteNavList() {
    return service({
        url: "/siteNavs",
        method: "get"
    })
}

// 获取用户订单信息
export function getOrderList(userId) {
    return service({
        url: "/order/core/orderList",
        method: "get",
        params: {userId: userId}
    })
}

// 获取用户收货信息
export function getReceptionList(userId) {
    return service({
        url: "/order/core/receptionList",
        method: "get",
        params: {userId: userId}
    })
}

// 删除订单信息
export function deleteOrder(orderId, articleId) {
    return service({
        url: "/order/core/deleteOrder",
        method: "delete",
        params: {
            orderId: orderId,
            articleId: articleId
        }
    })
}


