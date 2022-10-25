<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>工艺品管理</el-breadcrumb-item>
            <el-breadcrumb-item>详情列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="querInfo.query" clearable @clear="getArtList">
                        <el-button slot="append" icon="el-icon-search" @click="getArtList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="showaddDialog">添加工艺品
                    </el-button>
                </el-col>
            </el-row>
            <!-- 工艺品列表区域 -->
            <!-- border边框 stripe隔行变色 -->
            <el-table :data="artList" border stripe> 
                <el-table-column type="index"></el-table-column>
                <el-table-column label="名字" prop="title"></el-table-column>
                <el-table-column label="所属分类" prop="cat_id" :formatter="stateFormat"></el-table-column>
                <el-table-column label="简介" prop="content"></el-table-column>
                <el-table-column label="添加时间" prop="add_time"></el-table-column>
                <el-table-column label="点赞数" prop="zan"></el-table-column>
                <el-table-column label="图片" prop="url">
                    <template slot-scope="scope">
                    <el-image
                        style="width: 100px; height: 100px"
                        :src="scope.row.url"></el-image>
                    </template>
                </el-table-column>
                <el-table-column label="删除">
                    <template slot-scope="scope">
                    <!-- 删除按钮 -->
                    <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeArtById(scope.row.id)"></el-button>
                    </template>
                </el-table-column>               
            </el-table>
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
        <!-- 添加工艺品的对话框 -->
        <el-dialog title="添加工艺品" :visible.sync="addDialogVisible"
            width="50%" @close="addDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" ref="addFormRef"
            label-width="70px">
                <el-form-item label="名字" prop="title">
                    <el-input v-model="addForm.title"></el-input>
                </el-form-item>
                <el-form-item label="分类" prop="password">
                      <el-select v-model="value" placeholder="请选择" @change="handleChange">
                        <el-option
                            v-for="item in catList"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="简介" prop="content">
                    <el-input v-model="addForm.content"></el-input>
                </el-form-item>
                <el-form-item label="图片" prop="url">
                    <el-upload
                        accept="image/png,image/gif,image/jpg,image/jpeg"
                        action="http://localhost:9000/uploadFile/"
                        :show-file-list="false"
                        :on-success="handleAvatarSuccess"
                        :before-upload="beforeAvatarUpload">
                        <img v-if="imageUrl" :src="imageUrl" class="avatar">
                        <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                    </el-upload>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addArt">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
  export default {
    data() {
        return {
            // 获取工艺品列表的参数对象
            querInfo: {
                query: '',
                //当前的页数
                pageNum: 1,
                //当前每页显示多少条数据
                pageSize: 5
            },
            artList: [],
            total: 0,
            // 控制添加工艺品对话框的显示与隐藏
            addDialogVisible: false,
            value: '',
            //分类列表
            catList: [],
            // 添加工艺品的表单数据
            addForm: {
                title: '',
                cat_id: 0,
                content: '',
                url: ''
            },
            file:{},
            imageUrl: '',
            }
    },
    created() {
        this.getArtList()
        this.getCatDialog()
    },
    methods: {
        async getArtList() {
            const {data :res} = await this.$http.get('allart', {
                params: this.querInfo 
                } )
            // console.log(res)
            this.artList = res.data
            this.total = res.number
            // console.log(this.artList)
        },
        //将获取到的分类列表加到缓冲区
        stateFormat(row){
            for(let i=0;i<this.catList.length;i++){
                if(this.catList[i].id === row.cat_id) return this.catList[i].name
            }
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.querInfo.pageSize = newSize
            this.getArtList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.querInfo.pageNum = newPage
            this.getArtList()
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 获取分类列表
        async getCatDialog() {
            const { data: res} = await this.$http.get("getcatlist")
            // console.log(res)
            this.catList = res
        },
        showaddDialog(){
            this.addDialogVisible = true
        },
        //添加对话框中的分类菜单栏
        handleChange(value){
            this.addForm.cat_id = value       
        },
        handleAvatarSuccess(res, file) {
            // console.log(res.fileDownloadUri)
            this.imageUrl = URL.createObjectURL(file.raw);
            this.addForm.url = res.fileDownloadUri
        },
        beforeAvatarUpload(file) {
            if(!(file.type === 'image/png' || file.type === 'image/gif' || file.type === 'image/jpg' || file.type === 'image/jpeg')) {
            this.$notify.warning({
            title: '警告',
            message: '请上传格式为image/png, image/gif, image/jpg, image/jpeg的图片'
            })
        }
        let size = file.size / 1024 / 1024 / 2
        if(size > 2) {
            this.$notify.warning({
            title: '警告',
            message: '图片大小必须小于2M'
            })
        }
        },
        // 点击按钮，添加工艺品
        addArt() {
            this.$refs.addFormRef.validate(async vaild => {
                if(!vaild) return
                // 可以发起添加用户的网络请求
                const {data: res} = await this.$http.post('addart', this.addForm)
                if(res != "success") {
                    this.$message.error('添加工艺品失败')
                }
                this.$message.success('添加工艺品成功')
                // 隐藏添加用户的对话框
                this.addDialogVisible = false
                // 重新获取用户列表数据
                this.getArtList()
            })
        },
        // 根据id删除相应的工艺品信息
        async removeArtById(id) {
            // 弹框询问用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该工艺品, 是否继续?', '提示', {
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
            const { data: res } = await this.$http.delete("deleteart?id="+id)
            if(res != "success") {
                this.$message.error('删除工艺品失败')
            }
            this.$message.success('删除工艺品成功')
            this.getArtList()
        },
        handleRemove(file) {
            // console.log(file);
        },
    }
  }
</script>

<style lang="less" scoped>
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
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>