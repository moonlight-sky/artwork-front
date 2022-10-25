<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>工艺品管理</el-breadcrumb-item>
            <el-breadcrumb-item>评论管理</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 列表区域 -->
            <!-- border边框 stripe隔行变色 -->
            <el-table :data="comList" border stripe> 
                <el-table-column type="index"></el-table-column>
                <el-table-column label="名字" prop="atitle"></el-table-column>
                <el-table-column label="评论" prop="title"></el-table-column>
                <el-table-column label="用户" prop="pname"></el-table-column>
                <el-table-column label="删除">
                    <template slot-scope="scope">
                    <!-- 删除按钮 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeComById(scope.row.id)"></el-button>
                    </template>
                </el-table-column>               
            </el-table>            
        </el-card>
            
            
        
    </div>
</template>

<script>
export default({
    data() {
        return {
            comList: [],
        }      
    },
    created(){
        this.getCommentList();
    },
    
    methods:{
        async getCommentList() {
            const {data :res} = await this.$http.get('allcom')
            // console.log(res)
            this.comList = res
            console.log(this.artList)
        },
        // 根据id删除相应的工艺品信息
        async removeComById(id) {
            // 弹框询问用户是否删除
            const confirmResult = await this.$confirm('此操作将删除该条评论, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }
            ).catch(err => err)
            // 如果用户确认删除，则返回值为字符串 confirm
            // 如果用户取消了删除，则返回值为字符串 cancel
            // console.log(confirmResult)
            if(confirmResult != 'confirm') {
                return this.$message.info('已取消删除')
            }
            //删除
            const { data: res } = await this.$http.delete("deletecom?id="+id)
            if(res != "success") {
                this.$message.error('删除评论失败')
            }
            this.$message.success('删除评论成功')
            this.getCommentList()
        },
    }
})
</script>

<style lang="less" scoped>

</style>
