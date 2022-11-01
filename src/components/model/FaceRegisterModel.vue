<template>
    <v-dialog v-model="faceRegisterFlag" :fullscreen="isMobile" max-width="460">
        <v-card class="login-container" style="border-radius:4px">
            <el-form ref="form" label-width="120px" v-loading="loading">
                <el-form-item label="用户名">
                    <el-input v-model="form.name" />
                </el-form-item>
            </el-form>

            <el-form-item label="性别">
                <el-select v-model="form.sex" placeholder="选择你的性别">
                    <el-option label="男" value="男" />
                    <el-option label="女" value="女" />
                </el-select>
            </el-form-item>

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
            form: {
                name: "",
                sex: "",
            },
            imageUrl: "",
            imageBase64: "",
            loading: false,
        };
    },
    methods: {
        openLogin() {
            this.$store.state.faceRegisterFlag = false;
            this.$store.state.loginFlag = true;
        },
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
