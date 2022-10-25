<template>
    <div>
        <!-- 面包屑导航区 -->
        <el-breadcrumb separator-class="el-icon-arrow-right">
            <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
            <el-breadcrumb-item>权限管理</el-breadcrumb-item>
            <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 卡片视图区域 -->
        <el-card>
            <!-- 搜索与添加区域 -->
            <el-row :gutter="20">
                <el-col :span="8">
                    <el-input placeholder="请输入内容" v-model="querInfo.query" clearable @clear="getPersonList">
                        <el-button slot="append" icon="el-icon-search" @click="getPersonList"></el-button>
                    </el-input>
                </el-col>
                <el-col :span="4">
                    <el-button type="primary" @click="registerDialogVisible = true">添加用户
                    </el-button>
                </el-col>
            </el-row>
            <!-- 用户列表区域 -->
            <!-- border边框 stripe隔行变色 -->
            <el-table :data="personList" border stripe> 
                <el-table-column type="index"></el-table-column>
                <el-table-column label="姓名" prop="username"></el-table-column>
                <el-table-column label="邮箱" prop="email"></el-table-column>
                <el-table-column label="密码" prop="password"></el-table-column>
                <el-table-column label="注册时间" prop="add_time"></el-table-column>
                <el-table-column label="状态" prop="state">
                    <template slot-scope="scope">
                        <el-switch v-model="scope.row.state" @change="personStateChange(scope.row)">
                        </el-switch> 
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="180px">
                    <template slot-scope="scope">
                        <!-- 重置按钮 -->
                        <el-button type="primary" icon="el-icon-refresh" size="mini" @click="resetPersonInfo(scope.row)"></el-button>
                        <!-- 删除按钮 -->
                        <el-button type="danger" icon="el-icon-delete" size="mini" @click="removePersonById(scope.row.id)"></el-button>
                        <!-- 编辑按钮 -->
                        <el-button type="dark" icon="el-icon-setting" size="mini" @click="showPersonEditDialog(scope.row.id)"></el-button>
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
        <!-- 注册用户的对话框 -->
        <el-dialog title="注册用户" :visible.sync="registerDialogVisible"
            width="30%" @close="registerDialogClosed">
            <!-- 内容主体区域 -->
            <el-form :model="registerForm" :rules="registerFormRules" ref="registerFormRef"
            label-width="70px">
                <el-form-item label="用户名" prop="username">
                    <el-input v-model="registerForm.username"></el-input>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="registerForm.password"></el-input>
                </el-form-item>
                <el-form-item label="邮箱" prop="email">
                    <el-input v-model="registerForm.email"></el-input>
                </el-form-item>
            </el-form>
            <!-- 底部区域 -->
            <span slot="footer" class="dialog-footer">
                <el-button @click="registerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="registerUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="editPersonDialogVisible" 
            width="30%" @colse="editPersonDialogClosed">
            <el-form :model="editPersonForm" :rules="editPersonFormRules" ref="editPersonFormRef" 
            label-width="70px">
                <!-- 用户名 -->
                <el-form-item label="用户名" prop="username">
                <el-input v-model="editPersonForm.username" disabled></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item label="密码" prop="password">
                <el-input v-model="editPersonForm.password"></el-input>
                </el-form-item>
                <!-- 邮箱 -->
                <el-form-item label="邮箱" prop="email">
                <el-input v-model="editPersonForm.email"></el-input>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editPersonDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="editPersonInfo">确 定</el-button>
            </span>
        </el-dialog>
    </div>  
</template>

<script>
export default {
    data(){
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
        return{
            // 获取用户列表的参数对象
            querInfo: {
                query: '',
                //当前的页数
                pageNum: 1,
                //当前每页显示多少条数据
                pageSize: 5
            },
            personList: [],
            total: 0,
            // 控制修改用户对话框的显示和隐藏
            editPersonDialogVisible: false,
            // 查询到的用户信息对象
            editPersonForm: {},
            //修改表单的验证规则对象
            editPersonFormRules: {
                email: [
                    {required: true,message: '请输入修改后的邮箱', trigger: 'blur'},
                    {validator: checkEmail, trigger: 'blur'}
                ]
            },
             // 控制注册用户对话框的显示与隐藏
            registerDialogVisible: false,
            // 注册用户的表单数据
            registerForm: {
                username: '',
                password: '',
                email: ''
            },
            // 注册表单的验证规则对象
            registerFormRules: {
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
        }
    },
    created() {
        this.getPersonList()
    },
    methods:{
       async getPersonList() {
            const {data :res} = await this.$http.get('allperson', {
                params: this.querInfo 
                } )
            this.personList = res.data
            this.total = res.number
        },
        // 监听 pagesize 改变的事件
        handleSizeChange(newSize) {
            // console.log(newSize)
            this.querInfo.pageSize = newSize
            this.getPersonList()
        },
        // 监听 页码值 改变的事件
        handleCurrentChange(newPage) {
            // console.log(newPage)
            this.querInfo.pageNum = newPage
            this.getPersonList()
        },
        //监听 switch 开关状态的改变
        async personStateChange(personInfo) {
            const { data: res} = await this.$http.put(
                `updateperson?id=${personInfo.id}&state=${personInfo.state}`
                );
            if (res != "success") {
                personinfo.state = ! personinfo.state;
                return this.$message.error("更新用户状态失败!");
        }
        this.$message.success("更新用户状态成功!");
        },
        // 修改重置用户密码为123456并提交
        async resetPersonInfo(personInfo) {
            // 弹框询问用户是否重置
            const confirmResult = await this.$confirm('此操作将重置该用户密码为:123456, 是否继续?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
                }
            ).catch(err => err)
            // 如果用户确认重置，则返回值为字符串 confirm
            // 如果用户取消了重置，则返回值为字符串 cancel
            if(confirmResult != 'confirm') {
                return this.$message.info('已取消重置')
            }
            //重置
            // console.log(vaild)
            // 发起修改用户信息的数据请求
            const {data: res} = await this.$http.put(
                `resetperson?id=${personInfo.id}&state=${personInfo.state}`)
            if(res != "success") {
                this.$message.error('重置用户失败')
            }
            // 重新获取用户列表数据
            this.getPersonList()
            // 提示重置用户成功
            this.$message.success('重置用户成功')
            
        },
        // 根据id删除对于的用户信息
        async removePersonById(id) {
            // 弹框询问用户是否删除
            const confirmResult = await this.$confirm('此操作将永久删除该用户, 是否继续?', '提示', {
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
            const { data: res } = await this.$http.delete("deleteperson?id="+id)
            if(res != "success") {
                this.$message.error('删除用户失败')
            }
            this.$message.success('删除用户成功')
            this.getPersonList()
        },
         // 展示编辑用户的对话框
        async showPersonEditDialog(id) {
            
            // console.log(id)
            const { data: res} = await this.$http.get("getpersonbyid?id="+id)
            this.editPersonForm = res
            this.editPersonDialogVisible = true
        },
        // 监听修改用户对话框的关闭事件
        editPersonDialogClosed() {
            this.$refs.editPersonFormRef.resetFields()
        },
        // 修改用户信息并提交
        editPersonInfo() {
            this.$refs.editPersonFormRef.validate(async vaild => {
                // console.log(vaild)
                if(!vaild) return
                // 发起修改用户信息的数据请求
                const {data: res} = await this.$http.put("editperson",this.editPersonForm)
                if(res != "success") {
                    this.$message.error('更新用户失败')
                }
                // 隐藏更新用户的对话框
                this.editPersonDialogVisible = false
                // 重新获取用户列表数据
                this.getPersonList()
                // 提示修改用户成功
                this.$message.success('更新用户成功')
            })
        },
        // 监听注册用户对话框的关闭事件
        registerDialogClosed() {
            this.$refs.registerFormRef.resetFields()
        },
        // 点击按钮，添加新用户
        registerUser() {
            this.$refs.registerFormRef.validate(async vaild => {
                if(!vaild) return
                // 可以发起添加用户的网络请求
                const {data: res} = await this.$http.post('register', this.registerForm)
                if(res != "success") {
                    this.$message.error('添加用户失败')
                }
                this.$message.success('添加用户成功')
                // 隐藏添加用户的对话框
                this.registerDialogVisible = false
                // 重新获取用户列表数据
                this.getPersonList()
            })
        },
        
    }
}
</script>

<style lang="less" scoped>

</style>