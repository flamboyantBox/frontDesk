<template>
  <div>
    <!-- 相册列表 -->
    <v-card class="blog-container">
      <div class="photo-wrap">
        <div class="photo-container" v-for="(item, index) of photoList" :key="index">
          <img class="photo" :key="index" :src="item.photoSrc" @click="preview(index)"/>
          <v-btn
                  class="v-btn"
                  color="info"
                  id="copy_text"
                  :data-clipboard-text="item.photoSrc"
                  @click="handleCopyFun(item.photoSrc)"
          >复制</v-btn>
        </div>
      </div>
      <!-- 无限加载 -->
<!--      <infinite-loading @infinite="infiniteHandler">-->
<!--        <div slot="no-more" />-->
<!--        <div slot="no-results" />-->
<!--      </infinite-loading>-->
    </v-card>
  </div>
</template>

<script>
import {getAlbumsPhotos} from "../../api/file";
import Clipboard from "clipboard";

export default {
  created() {
    this.infiniteHandler();
  },

  data: function() {
    return {
      photoAlbumName: "",
      photoAlbumCover: "",
      photoList: [],
      photoCoverList: [],
      current: 1,
      size: 10
    };
  },
  methods: {
    preview(index) {
      // console.log("photoCoverList", this.photoCoverList)
      this.$imagePreview({
        images: this.photoCoverList,
        index: index
      });
    },
    infiniteHandler($state) {
      const params = {};
      params.albumId = this.$route.params.albumId
      params.isDelete = 0
      getAlbumsPhotos(params).then(res => {
        // this.photoAlbumCover = res.data.albumInfo.albumCover;
        // this.photoAlbumName = res.data.albumInfo.albumName;
        if (res.data.list.length) {
          this.current++;
          this.photoList.push(...res.data.list);
          console.log("length", res.data.list.length)
          for (let i = 0; i < res.data.list.length; i++) {
            this.photoCoverList.push(this.photoList[i].photoSrc)
          }
          $state.loaded();
        } else {
          $state.complete();
        }
      });
    },
    // 操作：点击了复制按钮
    handleCopyFun(item) {
      console.log(item)
      let clipboard = new Clipboard('#copy_text')
      clipboard.on('success', e => {
        console.log(e)
        this.$toast({ type: "success", message: "复制成功" });
        clipboard.destroy() // 释放内存
      })
      clipboard.on('error', e => {
        console.log(e)
        // 不支持复制
        this.$toast({ type: "error", message: "该浏览器不支持自动复制" });
        clipboard.destroy() // 释放内存
      })
    },
  },
  computed: {}
};
</script>

<style scoped>
.photo-wrap {
  display: flex;
  flex-wrap: wrap;
}
.photo-container{
  width: 290px;
  height: 290px;
}
.photo {
  margin: 9px;
  cursor: pointer;
  object-fit: cover;
  height: 230px;
  width: 230px;
}
.photo-wrap::after {
  content: "";
  display: block;
  flex-grow: 9999;
}
.v-btn{
  margin-left: 30%;
}
@media (max-width: 759px) {
  .photo {
    width: 100%;
  }
  .v-btn{
    margin-left: 40%;
  }
}
</style>
