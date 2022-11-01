<template>
    <v-dialog v-model="faceLoginFlag" :fullscreen="isMobile" max-width="460">
        <v-card class="login-container" style="border-radius:4px">
            <div class="login-wrapper">
                <div class="see">
                    <video
                            id="myVideo"
                            poster=""
                            muted
                            loop
                            playsinline
                            @loadedmetadata="fnRun"
                    ></video>
                    <canvas id="myCanvas"/>
                    <canvas id="saveFace"/>
                </div>
                <div class="option">
                    <el-row :gutter="20">
                        <el-col :span="12"><div class="grid-content bg-purple">
                            <el-button type="success" @click="fnOpen">启动前置摄像头</el-button>
                        </div></el-col>
                        <el-col :span="12"><div class="grid-content bg-purple">
                            <el-button type="success" @click="fnClose">关闭前置摄像头</el-button>
                        </div></el-col>
                    </el-row>
                </div>
                <!-- 登录 -->
                <div class="mt-10 login-tip">
                    <span @click="openLogin">账号登录</span>
                </div>
            </div>
        </v-card>
    </v-dialog>
</template>

<script>
    import * as faceapi from "face-api.js";
    import {faceLogin} from "../../api/user";
    export default {
        data() {
            return {
                username: "123",
                nets: "tinyFaceDetector", // 模型
                options: null, // 模型参数
                withBoxes: true, // 框or轮廓
                detectFace: "detectSingleFace", // 单or多人脸
                detection: "landmark",
                videoEl: null,
                canvasEl: null,
                userPassword: {
                    username: "",
                    password: "123456"
                },
                timeout: 0,
                // 视频媒体参数配置
                constraints: {
                    audio: false,
                    video: {
                        // ideal（应用最理想的）
                        width: {
                            min: 320,
                            ideal: 40,
                            max: 1920,
                        },
                        height: {
                            min: 240,
                            ideal: 40,
                            max: 1080,
                        },
                        // frameRate受限带宽传输时，低帧率可能更适宜
                        frameRate: {
                            min: 15,
                            ideal: 30,
                            max: 60,
                        },
                        // 显示模式前置后置
                        facingMode: "environment",
                    },
                },
            };
        },

        methods: {
            // 初始化模型加载
            async fnInit() {
                await faceapi.nets[this.nets].loadFromUri("/models"); // 算法模型
                await faceapi.loadFaceLandmarkModel("/models"); // 轮廓模型
                await faceapi.loadFaceExpressionModel("/models"); // 表情模型
                await faceapi.loadAgeGenderModel("/models"); // 年龄模型
                // 根据算法模型参数识别调整结果
                switch (this.nets) {
                    case "ssdMobilenetv1":
                        this.options = new faceapi.SsdMobilenetv1Options({
                            minConfidence: 0.5, // 0.1 ~ 0.9
                        });
                        break;
                    case "tinyFaceDetector":
                        this.options = new faceapi.TinyFaceDetectorOptions({
                            inputSize: 512, // 160 224 320 416 512 608
                            scoreThreshold: 0.5, // 0.1 ~ 0.9
                        });
                        break;
                    case "mtcnn":
                        this.options = new faceapi.MtcnnOptions({
                            minFaceSize: 20, // 0.1 ~ 0.9
                            scaleFactor: 0.709, // 0.1 ~ 0.9
                        });
                        break;
                }
                // 节点属性化
                this.videoEl = document.getElementById("myVideo");
                this.canvasEl = document.getElementById("myCanvas");
            },

            // 人脸面部勘探轮廓识别绘制
            async fnRunFaceLandmark() {
                console.log("开始识别")

                console.log("this.videoEl.paused", this.videoEl.paused)
                if (this.videoEl.paused) return clearTimeout(this.timeout);
                //识别绘制人脸信息
                const result = await faceapi[this.detectFace](
                    this.videoEl,
                    this.options
                ).withFaceLandmarks();
                console.log("result", result)
                if (result && !this.videoEl.paused) {
                    const dims = faceapi.matchDimensions(this.canvasEl, this.videoEl, true);
                    const resizeResult = faceapi.resizeResults(result, dims);
                    //  在这里准备开始到了人脸的信息
                    let ctx = this.canvasEl.getContext("2d");
                    // 把当前视频帧内容渲染到canvas上
                    ctx.drawImage(this.videoEl, 0, 0);
                    // 转base64格式、图片格式转换、图片质量压缩
                    var imgBase64 = this.canvasEl.toDataURL("image/jpeg", 1);
                    console.log("imgBase64=======copy->", imgBase64);
                    let param = new URLSearchParams();
                    param.append("imgBase64", imgBase64);

                    console.log("post")
                    this.axios.post("http://localhost:8005/faceRecognize/core/faceSearch", param)
                        .then(res => {
                            console.log("res", res)
                            if (res.data.data.usernamePassword != null) {
                                this.usernamePassword = res.data.data.usernamePassword;
                                this.usernamePassword.password = "123456";
                                console.log("this.usernamePassword", this.usernamePassword)
                                faceLogin(this.usernamePassword).then(res => {
                                    console.log("userInfo", res)
                                    this.$store.commit("login", res.data.userInfo);
                                    this.$store.commit("closeModel");
                                    this.$toast({ type: "success", message: "登录成功", duration:100});
                                })
                                this.fnClose();
                                console.log("人脸识别成功");
                            }
                        });

                    this.withBoxes
                        ? faceapi.draw.drawDetections(this.canvasEl, resizeResult)
                        : faceapi.draw.drawFaceLandmarks(this.canvasEl, resizeResult);
                } else {
                    this.canvasEl
                        .getContext("2d")
                        .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
                }

                this.timeout = setTimeout(() => this.fnRunFaceLandmark());
            },

            openLogin() {
                this.$store.state.faceLoginFlag = false;
                this.$store.state.loginFlag = true;
            },
            // 执行检测识别类型
            fnRun() {
                if (this.detection === "landmark") {
                    this.fnRunFaceLandmark();
                    return;
                }
                if (this.detection === "expression") {
                    this.fnRunFaceExpression();
                    return;
                }
                if (this.detection === "age_gender") {
                    this.fnRunFaceAgeAndGender();
                    return;
                }
            },

            // 启动摄像头视频媒体
            fnOpen() {
                this.$nextTick(() => {
                    this.fnInit();
                });
                this.axios.get("http://localhost:8005/faceRecognize/core/registeredEngine")
                console.log("start", typeof window.stream === "object")
                if (typeof window.stream === "object") return;
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    clearTimeout(this.timeout);
                    navigator.mediaDevices
                        .getUserMedia(this.constraints)
                        .then(this.fnSuccess)
                        .catch(this.fnError);
                }, 300);
            },

            // 成功启动视频媒体流
            fnSuccess(stream) {
                console.log("success")
                console.log("stream", stream)
                window.stream = stream; // 使流对浏览器控制台可用
                this.videoEl.srcObject = stream;
                this.videoEl.play();
            },

            // 失败启动视频媒体流
            fnError(error) {
                console.log(error);
                alert("视频媒体流获取错误" + error);
            },

            // 结束摄像头视频媒体
            fnClose() {
                this.canvasEl
                    .getContext("2d")
                    .clearRect(0, 0, this.canvasEl.width, this.canvasEl.height);
                this.videoEl.pause();
                clearTimeout(this.timeout);
                if (typeof window.stream === "object") {
                    window.stream.getTracks().forEach((track) => track.stop());
                    window.stream = "";
                    this.videoEl.srcObject = null;
                }
            },
        },
        computed: {
            faceLoginFlag: {
                set(value) {
                    this.$store.state.faceLoginFlag = value;
                },
                get() {
                    return this.$store.state.faceLoginFlag;
                }
            },
            isMobile() {
                const clientWidth = document.documentElement.clientWidth;
                return clientWidth <= 960;
            }
        },
        beforeDestroy() {
            this.fnClose();
        },
    }
</script>

<style>
    .see {
        position: relative;
        text-align: center;
    }
    .see canvas {
        position: absolute;
        top: 0;
        left: 0;
    }
    .option {
        padding-bottom: 20px;
    }
    .option div {
        padding: 10px;
    }
</style>

