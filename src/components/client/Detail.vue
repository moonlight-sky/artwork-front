<template>
    <div>
        <el-header>
            <div>
                <img src="../../assets/logo.png">
                <span>工艺品展示系统</span>
            </div>
            <el-menu default-active="2"
                class="el-menu-demo"
                mode="horizontal"        
                background-color="#373D41"
                text-color="#fff"
                active-text-color="#ffd04b">
            </el-menu>

            <el-dropdown @command="handleCommand">
                <span style="cursor: pointer;color:white;">
                    {{ this.person.username+" " }}<i class="el-icon-caret-bottom" style="margin-right: 15px"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        <el-main>
            
                <el-card>
                 <el-descriptions class="margin-top" title="个人中心" :column="4" size="medium" border>
                    <template slot="extra">
                        <el-button type="primary" size="small" @click="back()">返回</el-button>
                        <el-button type="primary" size="small" @click="showPersonEditDialog()">修改</el-button>
                    </template>
                    <el-descriptions-item>
                        <template slot="label">
                        <i class="el-icon-user"></i>
                        用户名
                        </template>
                        {{ person.username }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                        <i class="el-icon-mobile-phone"></i>
                        密码
                        </template>
                        {{ person.password }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                        <i class="el-icon-location-outline"></i>
                        邮箱
                        </template>
                        {{ person.email }}
                    </el-descriptions-item>
                    <el-descriptions-item>
                        <template slot="label">
                        <i class="el-icon-tickets"></i>
                        添加时间
                        </template>
                        <el-tag size="small">{{ person.add_time }}</el-tag>
                    </el-descriptions-item>
                    </el-descriptions>
                </el-card>
                <!-- 收藏 -->
                <el-card>
                    <h3>用户收藏</h3>
                    <el-table
                        :data="collectionList"
                        stripe
                        style="width: 100%">
                        <el-table-column prop="atitle" label="工艺品名"  width="180"></el-table-column>
                        <el-table-column label="删除">
                            <template slot-scope="scope">
                            <!-- 删除按钮 -->
                                <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeColById(scope.row.id)"></el-button>
                            </template>
                </el-table-column>
                    </el-table>
                </el-card>
            
        </el-main>
        <!-- 修改用户对话框 -->
        <el-dialog title="修改用户信息" :visible.sync="editPersonDialogVisible" 
            width="50%" @colse="editPersonDialogClosed">
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
            person: {},
            //登录用户id
            PersonId: '',
            collectionList: [],
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
        }
    },
    created(){
        this.getPersonId();
    },
    methods:{
        async getPersonId(){
            const PersonFlag = window.sessionStorage.getItem('person')
            this.PersonId = PersonFlag
            this.getPerson(this.PersonId)
            this.getCollection(this.PersonId)
        },
        async getPerson(id){
            const { data: res} = await this.$http.get("getpersonbyid?id="+id)
            // console.log(res)
            this.person = res
        },
        handleCommand(command){
            if(command == "logout"){
                // console.log("退出")
                window.sessionStorage.clear();//清除session(token)
                this.showlogin = true
                this.$message.success('退出成功');
                this.$router.push("/");
            }else{
                this.$router.push("/detail");
            }
        },
        //获取收藏
        async getCollection(person_id){
            const { data: res} = await this.$http.get("getcol?person_id="+person_id)
            // console.log(res)
            this.collectionList = res;
        },
        // 展示编辑用户的对话框
        async showPersonEditDialog() {
            
            // console.log(id)
            const { data: res} = await this.$http.get("getpersonbyid?id="+this.PersonId)
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
        async removeColById(id) {
            // 弹框询问用户是否删除
            const confirmResult = await this.$confirm('此操作将删除该收藏, 是否继续?', '提示', {
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
            const { data: res } = await this.$http.delete("deletecol?id="+id)
            if(res != "success") {
                this.$message.error('删除评论失败')
            }
            this.$message.success('删除评论成功')
            this.getCollection(this.PersonId)
        },
        //返回首页
        back(){
            this.$router.push("/")
        }
    }
}
</script>

<style lang="less" scoped>

</style>