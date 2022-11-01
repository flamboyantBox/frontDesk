<template>
    <v-card class="blog-container">
        <div class="test">
            <el-table
                    ref="multipleTable"
                    :data="tableData"
                    tooltip-effect="dark"
                    style="width: 100%"
                    @selection-change="handleSelectionChange">

                <el-table-column
                        type="selection"
                        width="55">
                </el-table-column>

                <el-table-column
                        prop="articleCover"
                        label="图片"
                        width="180"
                        align="center"
                >
                    <template slot-scope="scope">
                        <el-image
                                class="article-cover"
                                :src="
                    scope.row.articleCover
                ? scope.row.articleCover
                : 'https://graduation-project-flam.oss-cn-hangzhou.aliyuncs.com/2022-07-21/aniya.webp'
            "
                        />
                    </template>
                </el-table-column>
                <el-table-column
                        prop="item"
                        label="商品名称"
                        width="120">
                    <template slot-scope="scope">{{ scope.row.articleTitle }}</template>
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="价格(¥)"
                        width="120">
                    <template slot-scope="scope">{{ scope.row.totalFee }}</template>
                </el-table-column>
                <el-table-column
                        prop="num"
                        label="数量"
                        width="120">
                    <template slot-scope="scope">{{ scope.row.articleNum }}</template>
                </el-table-column>
                <el-table-column
                        prop=""
                        label="操作">
                    <template slot-scope="scope">
                        <el-button size="medium" @click="addNum(scope.$index)">+</el-button>
                        <el-button size="medium" @click="reduceNum(scope.row.id, scope.row.articleId, scope.$index)">-</el-button>
                    </template>
                </el-table-column>
                <el-table-column
                        prop="price"
                        label="合计(¥)"
                        width="120">
                    <template slot-scope="scope">{{ scope.row.totalFee * scope.row.articleNum }}</template>
                </el-table-column>
            </el-table>
        </div>

<!--        v-if="$store.state.num"-->
        <div class="total" >
            <span class="mr30">已选数量：<i class="result">{{selectedNum}}</i></span>
            <span class="mr30">金额：<i class="result">{{selectedPay}}</i></span>
            <el-button size="medium" style="background-color: #67C23A; color: white" @click="wechatPay">微信</el-button>
            <el-button size="medium" style="background-color: #409EFF; color: white" @click="aliPay">支付宝</el-button>
        </div>
    </v-card>
</template>

<script>
    import { getOrderList, deleteOrder } from "../../api/user";

    export default {
        created() {
            this.orderList();
        },
        // 每隔三秒调用一次订单状态的方法
        mounted() {
            this.timer = setInterval(() => {
                this.axios.get("http://localhost:8003/alipay/core/status").then(res => {
                    this.status = res.data;
                    console.log("status1", this.status)
                    if (this.status){
                        this.axios.get("http://localhost:8003/alipay/core/changeFalse")
                        clearInterval(this.timer)
                        this.$router.push({path: "/reception"})
                        this.selectedNum = 0,
                        this.selectedPay = 0,
                        this.articleIdList = [],
                        this.orderNoList = []
                        this.status = false;
                        console.log("status2", this.status)
                        console.log("end")
                    }
                });
            },3000)
        },
        data() {
            return {
                tableData: [],
                articleIdList: [],
                selectedNum: 0,
                selectedPay: 0,
                selectedArray: [],
                orderNoList: [],
                timer: "",
                status: false,
            }
        },

        methods: {
            handleSelectionChange(val) {
                this.selectedNum = 0;
                this.selectedPay = 0;
                for (var i = 0, len = val.length; i < len; i++) {
                    this.selectedNum += val[i].articleNum;
                    this.selectedPay += val[i].articleNum * val[i].totalFee
                }
                this.selectedArray = val
            },
            // 加数量
            addNum (index) {
                let params = {
                    articleId: this.tableData[index].articleId,
                    articleTitle: this.tableData[index].articleTitle,
                    articleCover: this.tableData[index].articleCover,
                    userId: this.$store.state.userId,
                    nickname: this.$store.state.nickname,
                    email: this.$store.state.email,
                    totalFee: this.tableData[index].totalFee,
                };
                this.axios.post("http://localhost:8003/wechat/core/createOrder", params).then(res => {
                    this.tableData[index].articleNum = res.data.data.articleNum;
                })
            },
            // 减数量
            reduceNum (orderId, articleId, index) {
                if (this.tableData[index].articleNum > 0){
                    deleteOrder(orderId, articleId).then(res => {
                        this.tableData[index].articleNum = res.data.articleNum;
                        this.tableData[index].id = res.data.id;
                    })
                }else {
                    this.tableData[index].articleNum = 0
                }

            },
            // 结算
            wechatPay () {
                if (this.selectedNum > 0) {
                    let articleTitle;
                    for (let i = 0, len = this.selectedArray.length; i < len; i++) {
                        this.articleIdList.push(this.selectedArray[i].articleId);
                        articleTitle = this.selectedArray[i].articleTitle;
                        this.orderNoList.push(this.selectedArray[i].orderNo);
                    }
                    let params = {
                        articleIdList: this.articleIdList,
                        totalFee: this.selectedPay,
                        articleTitle: articleTitle,
                        orderNo: this.orderNoList[0]
                    };

                    this.$router.push({
                        path: "/payment",
                        query: {
                            params: encodeURIComponent(JSON.stringify(params))
                        }
                    })
                    this.selectedNum = 0,
                    this.selectedPay = 0,
                    this.articleIdList = [],
                    this.orderNoList = [],
                    articleTitle = ""
                } else {
                    this.$message({
                        message: '请先选择结算的商品～',
                        type: 'warning'
                    })
                }
            },
            aliPay () {
                if (this.selectedNum > 0) {
                    for (let i = 0, len = this.selectedArray.length; i < len; i++) {
                        this.articleIdList.push(this.selectedArray[i].articleId);
                        this.orderNoList.push(this.selectedArray[i].orderNo);
                    }

                    window.open(`http://localhost:8003/alipay/core/pay?subject=${this.articleIdList}&totalAmount=${this.selectedPay}&traceNo=${this.orderNoList[0]}`);
                    console.log("start")
                } else {
                    this.$message({
                        message: '请先选择结算的商品～',
                        type: 'warning'
                    })
                }
            },
            orderList() {
                getOrderList(this.$store.state.userId).then(res => {
                    this.tableData = res.data.orderList;
                })
            }
        },
    }
</script>

<style lang="stylus" scoped>
    .test{
        ::v-deep .el-table__header .el-table-column--selection .cell .el-checkbox:after {
            color: #909399;
            content: "全选";
            font-size: 14px;
            margin-left: 2px;
            font-weight: bold;
        }
    }
    a {
        color: #000;
        text-decoration: none;
        font-size: 50px;
    }
    th{
        text-align: center!important;
    }
    .total{
        margin-top: 30px;
    }
    .mr30{
        margin-right: 30px;
    }
    .result{
        color red;
    }
</style>
