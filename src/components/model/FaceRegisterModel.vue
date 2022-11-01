<template>
    <v-dialog v-model="faceRegisterFlag" :fullscreen="isMobile" max-width="460">
        <v-card class="login-container" style="border-radius:4px">
            <el-form ref="form" label-width="80px">
                <el-form-item label="邮箱账号">
                    <el-input v-model="username" placeholder="请输入邮箱号"></el-input>
                </el-form-item>
            </el-form>

            <el-form ref="form" label-width="80px">
                <el-form-item label="人脸照片">
                    <el-upload
                            class="avatar-uploader"
                            action="http://localhost:8002/api/oss/file/upload"
                            :show-file-list="false"
                            :on-success="handleAvatarSuccess"
                            :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>

            <el-row>
                <el-button type="primary" @click="register">添加用户</el-button>
                <el-button @click="openLogin">取消</el-button>
            </el-row>

            <!-- 登录 -->
            <div class="mt-10 login-tip">
                已有账号？<span @click="openLogin">登录</span>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
export default {
    data() {
        return {
            username: "",
            file: "",
            imageUrl: "",
            loading: false,
        };
    },
    methods: {
        openLogin() {
            this.$store.state.faceRegisterFlag = false;
            this.$store.state.loginFlag = true;
            this.username = "";
            this.imageUrl = "";
            this.file = "";
        },

        register() {
            let reg = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/;
            if (!reg.test(this.username)) {
                this.$toast({type: "error", message: "邮箱格式不正确"});
                return false;
            }
            if (this.file === "") {
                this.$toast({type: "error", message: "请选择图片"});
                return false;
            }
            let params = new FormData();
            params.append("file", this.file)
            params.append("username", this.username)
            console.log("params", params)
            this.axios.post("http://localhost:8005/faceRecognize/core/upload", params).then(res => {
                console.log("upload", res)
                if (res.data.code === 200){
                    this.$message({
                        type: "success",
                        message: "提交成功!",
                    });
                    this.openLogin()
                }
            });
        },

        handleAvatarSuccess(res, file) {
            this.file = file.raw;
            this.imageUrl = URL.createObjectURL(file.raw);
            this.axios.get("http://localhost:8005/faceRecognize/core/registeredEngine")
        },

        beforeAvatarUpload(file) {
            const isLt2M = file.size / 1024 / 1024 < 2;

            if (!isLt2M) {
                this.$message.error('上传头像图片大小不能超过 2MB!');
            }
            return isLt2M;
        }
    },

    computed: {
        faceRegisterFlag: {
            set(value) {
                this.$store.state.faceRegisterFlag = value;
            },
            get() {
                return this.$store.state.faceRegisterFlag;
            }
        },
        isMobile() {
            const clientWidth = document.documentElement.clientWidth;
            return clientWidth <= 960;
        }
    },
}
</script>
<style>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 170px;
        height: 250px;
        line-height: 250px;
        text-align: center;
    }
    .avatar {
        width: 170px;
        height: 250px;
        display: block;
    }
</style>
