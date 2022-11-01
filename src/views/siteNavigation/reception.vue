<template>
    <v-card class="blog-container">
        <el-table
                :data="tableData"
                style="width: 100%"
                :default-sort = "{prop: 'date', order: 'descending'}"
        >
            <el-table-column
                    prop="date"
                    label="日期"
                    sortable
                    width="180">
                <template slot-scope="scope">{{ scope.row.updateTime | date }}</template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="商品图片"
                    width="180">
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
                    prop="name"
                    label="商品名称"
                    width="160">
                <template slot-scope="scope">{{ scope.row.articleTitle }}</template>
            </el-table-column>
            <el-table-column
                    prop="name"
                    label="商品数量"
                    width="80">
                <template slot-scope="scope">{{ scope.row.articleNum }}</template>
            </el-table-column>
            <el-table-column
                    prop="address"
                    label="地址"
                    :formatter="formatter"
                    width="140">
                <template>九江学院 23-527</template>
            </el-table-column>
            <el-table-column
                    prop="value"
                    label="收货状态"
                    width="100">
                    <el-button type="primary"> 待收货 </el-button>
            </el-table-column>
        </el-table>
    </v-card>
</template>

<script>
    import { getReceptionList } from "../../api/user";
    export default {
        created() {
            this.receptionList();
        },
        data() {
            return {
                tableData: [],
            }
        },
        methods: {
            formatter(row) {
                return row.address;
            },
            receptionList(){
                getReceptionList(this.$store.state.userId).then(res => {
                    this.tableData = res.data.receptionList;
                    console.log("receptionList", this.tableData)
                })
            }
        }
    }
</script>
