<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>管理员列表</el-breadcrumb-item>
        </el-breadcrumb>

        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="querInfo.query" clearable @clear="getUserList">
                        <el-button slot="append" icon="el-icon-search" @click="getUserList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="addDialogVisible = true">添加管理员
                    </el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <!-- border边框 stripe隔行变色 -->
            <el-table :data="userList" border stripe> 
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="密码" prop="password"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="状态" prop="state">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" @change="userStateChange(scope.row)">
                        </el-switch> 
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120px">
                    <template slot-scope="scope">
                        <!-- 修改按钮 -->
                        <el-tooltip effect="dark" content="修改" placement="top" :enterable="false">
                        <el-button type="primary" icon="el-icon-edit" size="mini" @click="showEditDialog(scope.row.id)"></el-button>
                        </el-tooltip>
                        <!-- 删除按钮 -->
                        <el-tooltip effect="dark" content="删除" placement="top" :enterable="false">
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeUserById(scope.row.id)"></el-button>
                        </el-tooltip>
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
        <!-- 添加用户的对话框 -->
        <el-dialog title="添加用户" :visible.sync="addDialogVisible"
            width="30%" @close="addDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="addForm" :rules="addFormRules" ref="addFormRef"
            label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="addForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="addForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="addForm.email"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="addDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="addUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改管理员信息" :visible.sync="editDialogVisible" 
            width="30%" @colse="editDialogClosed">
            <el-form :model="editForm" :rules="editFormRules" ref="editFormRef" 
            label-width="70px">
                <!-- 用户名 -->
                <el-form-item label="用户名" prop="username">
                <el-input v-model="editForm.username" disabled></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                <el-input v-model="editForm.password"></el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email">
                <el-input v-model="editForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editUserInfo">确 定</el-button>
            </span>
        </el-dialog>
        
    </div>
</template>

<script>
export default {
    data() {
        // 验证邮箱的规则
        var checkEmail = (rule, value, cb) => {
            // 验证邮箱的正则表达式
            const regEmail = /^[A-Za-z0-9\u4e00-\u9fa5]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/
            if (regEmail.test(value)) {
                // 合法的邮箱
                return cb()
            }
            cb(new Error('请输入合法的邮箱'))
        }

        return {
            // 获取用户列表的参数对象
            querInfo: {
                query: '',
                //当前的页数
                pageNum: 1,
                //当前每页显示多少条数据
                pageSize: 5
            },
            userList: [],
            total: 0,
            // 控制添加用户对话框的显示与隐藏
            addDialogVisible: false,
            // 添加用户的表单数据
            addForm: {
                username: '',
                password: '',
                email: ''
            },
            // 添加表单的验证规则对象
            addFormRules: {
                username: [
                    {required: true,message: '请输入用户名', trigger: 'blur'},
                    {min: 3, max: 10, message: '用户名的长度在3-10个字符之间',
                    trigger: 'blur'}
                ],
                password: [
                    {required: true,message: '请输入密码', trigger: 'blur'},
                    {min: 6, max: 15, message: '密码的长度在6-15个字符之间',
                    trigger: 'blur'}
                ],
                email: [
                    {required: true,message: '请输入邮箱', trigger: 'blur'},
                    {validator: checkEmail, trigger: 'blur'}                    
                ]
            },
            // 控制修改用户对话框的显示和隐藏
            editDialogVisible: false,
            // 查询到的用户信息对象
            editForm: {},
            //修改表单的验证规则对象
            editFormRules: {
                email: [
                    {required: true,message: '请输入修改后的邮箱', trigger: 'blur'},
                    {validator: checkEmail, trigger: 'blur'}
                ]
            },
        }
    },
    created() {
        this.getUserList()
    },
    methods: {
        async getUserList() {
            const {data :res} = await this.$http.get('alluser', {
                params: this.querInfo 
                } )
            // console.log(res)
            this.userList = res.data
            this.total = res.number
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.querInfo.pageSize = newSize
            this.getUserList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.querInfo.pageNum = newPage
            this.getUserList()
        },
        //监听 switch 开关状态的改变
        async userStateChange(userInfo) {
            const { data: res} = await this.$http.put(
                `updateuser?id=${userInfo.id}&state=${userInfo.state}`
                );
            if (res != "success") {
                userinfo.state = ! userinfo.state;
                return this.$message.error("更新用户状态失败!");
        }
        this.$message.success("更新用户状态成功!");
        },
        // 监听添加用户对话框的关闭事件
        addDialogClosed() {
            this.$refs.addFormRef.resetFields()
        },
        // 点击按钮，添加新用户
        addUser() {
            this.$refs.addFormRef.validate(async vaild => {
                if(!vaild) return
                // 可以发起添加用户的网络请求
                const {data: res} = await this.$http.post('adduser', this.addForm)
                if(res != "success") {
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                // 隐藏添加用户的对话框
                this.addDialogVisible = false
                // 重新获取用户列表数据
                this.getUserList()
            })
        },
        // 展示编辑用户的对话框
        async showEditDialog(id) {
            
            // console.log(id)
            const { data: res} = await this.$http.get("getuserbyid?id="+id)
            this.editForm = res
            this.editDialogVisible = true
        },
        // 监听修改用户对话框的关闭事件
        editDialogClosed() {
            this.$refs.editFormRef.resetFields()
        },
        // 修改用户信息并提交
        editUserInfo() {
            this.$refs.editFormRef.validate(async vaild => {
                // console.log(vaild)
                if(!vaild) return
                // 发起修改用户信息的数据请求
                const {data: res} = await this.$http.put("edituser",this.editForm)
                if(res != "success") {
                    this.$message.error('更新用户失败')
                }
                // 隐藏更新用户的对话框
                this.editDialogVisible = false
                // 重新获取用户列表数据
                this.getUserList()
                // 提示修改用户成功
                this.$message.success('更新用户成功')
            })
        },
        // 根据id删除对于的用户信息
        async removeUserById(id) {
            // 弹框询问用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该管理员, 是否继续?', '提示', {
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
            const { data: res } = await this.$http.delete("deleteuser?id="+id)
            if(res != "success") {
                this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            this.getUserList()
        },
        

    }
}
</script>

<style lang="less" scoped>

</style>