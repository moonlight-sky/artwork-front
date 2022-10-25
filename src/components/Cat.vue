<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>工艺品管理</el-breadcrumb-item>
            <el-breadcrumb-item>分类列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="querInfo.query" clearable @clear="getCatList">
                        <el-button slot="append" icon="el-icon-search" @click="getCatList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">新增分类
                    </el-button>
                </el-col>
            </el-row>
            <!-- 工艺品列表区域 -->
            <!-- border边框 stripe隔行变色 -->
            <el-table :data="catList" border stripe> 
                <el-table-column type="index"></el-table-column>
                <el-table-column label="分类名" prop="name"></el-table-column>
                <el-table-column label="状态" prop="state">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" @change="catStateChange(scope.row)">
                        </el-switch> 
                    </template>
                </el-table-column>
                <el-table-column label="删除">
                    <template slot-scope="scope">
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeCatById(scope.row.id)"></el-button>
                    </template>
                </el-table-column>
                
                
            </el-table>

            <!-- 分页 -->
            <!-- 分页区域 -->
            <!-- size-change每页最大变化 current-change 当前最大变化 layout 功能组件  -->
            <el-pagination @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page="querInfo.pageNum"
            :page-sizes="[1, 2, 5, 10]"
            :page-size="querInfo.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="total">
            </el-pagination>
        </el-card>
        <!-- 新增分类的对话框 -->
        <el-dialog title="新增分类" :visible.sync="addDialogVisible"
            width="50%" @close="addDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" ref="addFormRef"
            label-width="70px">
                <el-form-item label="分类名" prop="name">
                    <el-input v-model="addForm.name"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addCat">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
export default {
    data(){
        return {
            //分页,查询条件
            querInfo:{
                query: '',
                //当前的页数
                pageNum: 1,
                //当前每页显示多少条数据
                pageSize: 5
            },
            //工艺品分类的数据列表，默认为空
            catList: [],
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                name: ''
            }
        }
    },
    created() {
        this.getCatList()
    },
    methods:{
        //获取工艺品分类数据
        async getCatList() {
            const {data :res} = await this.$http.get('allcat', {
                params: this.querInfo 
                } )
            // console.log(this.catList)
            this.catList = res.data
            this.total = res.number
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.querInfo.pageSize = newSize
            this.getCatList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.querInfo.pageNum = newPage
            this.getCatList()
        },
        //监听 switch 开关状态的改变
        async catStateChange(catInfo) {
            const { data: res} = await this.$http.put(
                `updatecat?id=${catInfo.id}&state=${catInfo.state}`
                );
            if (res != "success") {
                catinfo.state = ! catinfo.state;
                return this.$message.error("更新分类状态失败!");
        }
        this.$message.success("更新分类状态成功!");
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮，添加新分类
        addCat() {
            this.$refs.addFormRef.validate(async vaild => {
                if(!vaild) return
                // 可以发起添加分类的网络请求
                const {data: res} = await this.$http.post('addcat', this.addForm)
                if(res != "success") {
                    this.$message.error('添加分类失败')
                }
                this.$message.success('添加分类成功')
                // 隐藏添加分类的对话框
                this.addDialogVisible = false
                // 重新获取分类列表数据
                this.getCatList()
            })
        },
        // 根据id删除对于的分类信息
        async removeCatById(id) {
            // 弹框询问用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该分类, 是否继续?', '提示', {
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
            const { data: res } = await this.$http.delete("deletecat?id="+id)
            if(res != "success") {
                this.$message.error('删除分类失败')
            }
            this.$message.success('删除分类成功')
            this.getCatList()
        },
    }
}
</script>

<style lang="less" scoped>

</style>