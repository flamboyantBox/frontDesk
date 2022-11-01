import service from "../utils/request";

// 获取相册分类
export function getAlbums(query) {
    return service({
        url: "/photoAlbum/core/albumList",
        method: "post",
        data: query
    });
}

// 获取相册里的照片
export function getAlbumsPhotos(query) {
    return service({
        url: "/photo/core/photoList",
        method: "get",
        params: query
    });
};

