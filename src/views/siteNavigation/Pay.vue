<template>
    <v-card class="blog-container">
        <el-container>
            <el-header>
                <p><span><svg-icon icon-class="submit"/> 订单提交成功，请您及时付款！订单号：{{this.orderInfo.out_trade_no}}</span></p>
                <p>
                    <em><svg-icon icon-class="gold" class="size"/> 应付金额：</em>
                    <em class="payColor">{{ this.orderInfo.total_fee }}￥</em>
                </p>
            </el-header>

            <el-main>
                <p><svg-icon icon-class="scan" class="scan"/> 请使用微信扫一扫</p>
                <div>
<!--                    <img id="qrious" src="../../assets/img/erweima.png" alt="" >-->
<!--                            <qriously value="weixin://wxpay/bizpayurl?pr=R7tnDpZ" :size="338"/>-->
                    <qriously :value="this.orderInfo.code_url" :size="270" class="test"/>
                </div>
            </el-main>

            <el-footer><el-button><svg-icon icon-class="other" @click="orderStatus"/> 其他支付方式</el-button></el-footer>
        </el-container>
    </v-card>
</template>

<script>

export default {
    created() {
        this.params = JSON.parse(decodeURIComponent(this.$route.query.params));
        this.scanQR()
    },
    // 每隔三秒调用一次订单状态的方法
    mounted() {
        this.timer = setInterval(() => {
            this.orderStatus();
        },3000)
    },
    data: function() {
        return {
            orderInfo: {},
            count: 0,
            timer: "",
            params: {}
        };
    },
    methods: {
        scanQR(){
            this.axios.post("http://localhost:8003/wechat/core/scanQR", this.params).then(res => {
                this.orderInfo = res.data.data.map
            })
        },

        orderStatus(){
            console.log("start")
            let articleIds = "";
            for (let i = 0; i < this.params.articleIdList.length; i++) {
                if (i === this.params.articleIdList.length - 1){
                    articleIds += this.params.articleIdList[i]
                }else {
                    articleIds += this.params.articleIdList[i] + ","
                }
            }
            let params = new URLSearchParams();
            params.append("orderNo", this.params.orderNo);
            params.append("articleIds", articleIds);
            this.axios.post("http://localhost:8003/wechat/core/orderStatus", params).then(res => {
                console.log("resCode", res)
                if (res.data.code === 200){
                    clearInterval(this.timer)
                    this.$message({
                        type: "success",
                        message: "支付成功！"
                    })
                    // 跳转到待收货地址
                    this.$router.push({path: "/reception"})
                }
            })
        }
    },
}
</script>

<style scoped lang="scss">
    .el-main{
        margin-top: 20px;
        background-color: #FAFAD2;
        min-height: 350px;
        border-radius: 20px;
        p{
            font-size: 25px;
            text-align: center;
            color: #409EFF
        }
    }
    .el-footer{
        margin-top: 10px;
        color: #409EFF;
        text-align: right;
        a{
            font-size: 14px;
            color: #409EFF;
        }
    }
    .el-row {
        margin-bottom: 20px;
        &:last-child {
            margin-bottom: 0;
        }
    }
    .el-col {
        border-radius: 4px;
    }
    .bg-purple-dark {
        background: #99a9bf;
    }
    .bg-purple {
        background: #d3dce6;
    }
    .bg-purple-light {
        background: #e5e9f2;
    }
    .grid-content {
        border-radius: 4px;
        min-height: 36px;
    }
    .row-bg {
        padding: 10px 0;
        background-color: #f9fafc;
    }
    .payColor{
        color: #F56C6C;
    }
    .test{
        width: 200px;
        height: 200px;
        margin-left: 294px;
    }
    .size{
        width: 20px;
        height: 20px;
    }
    .scan{
        width: 25px;
        height: 25px;
    }
</style>
