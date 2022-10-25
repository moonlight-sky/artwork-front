<template>
    <div>
        <el-header>
            <div>
                <img src="../assets/logo.png">
                <span>工艺品展示系统</span>
            </div>
            <el-menu default-active="2"
                class="el-menu-demo"
                mode="horizontal"        
                background-color="#373D41"
                text-color="#fff"
                active-text-color="#ffd04b">
                <!-- <el-menu-item index="1" @click="toBehind">后台</el-menu-item>
                <el-menu-item index="2">前台</el-menu-item> -->
            </el-menu>
            <div id="btns">
                <!-- <el-button icon="el-icon-search" circle></el-button> -->
                <el-button type="primary" @click="tologin" v-show="showlogin" size="medium">登录</el-button>
                <el-button type="success" @click="registerDialogVisible = true" v-show="showlogin" size="medium">用户注册</el-button>
            </div>

            <el-dropdown @command="handleCommand" v-show="!showlogin">
                <span style="cursor: pointer;color:white;size:25px">
                    {{ Personame+" " }}<i class="el-icon-caret-bottom" style="margin-right: 15px"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                    <el-dropdown-item command="personal">个人中心</el-dropdown-item>
                    <el-dropdown-item command="logout">退出</el-dropdown-item>
                </el-dropdown-menu>
            </el-dropdown>
        </el-header>
        
        <el-main>
            <!-- 卡片视图区域 -->
            <el-row :gutter="20">                
                <el-col :span="6" v-for="(item, key) in artList" :key="key">
                    
                    <el-card>
                        <el-link :underline="false" @click="showDetailsDialog(item.id)">
                        <el-image :src="item.url"></el-image> 
                        </el-link> 
                        <div>
                            
                                <el-link :underline="false">   
                                    <h2>                            
                                        {{ item.title }}
                                    </h2>
                                </el-link>
                                <el-button type="text" icon="iconfont icon-icon" @click="Likeit(item)" v-if="!item.isZan"></el-button>
                                <el-button type="text" icon="iconfont icon-mianxingdianzan" @click="Likeit(item)" v-if="item.isZan"></el-button>
                            
                            <span v-html='br'></span>
                            简介：{{ item.content }}
                        </div>
                    </el-card>   
                                    
                </el-col>
            </el-row>
      
    <!-- 注册用户的对话框 -->
        <el-dialog title="注册用户" :visible.sync="registerDialogVisible"
            width="50%" @close="registerDialogClosed">
            
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
            
            <span slot="footer" class="dialog-footer">
                <el-button @click="registerDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="registerUser">确 定</el-button>
            </span>
        </el-dialog>
        <!-- 详情内容的对话框 -->
        <el-dialog  :visible.sync="detailsDialogVisible"
            width="50%" @close="detailsDialogClosed">
            
            <el-form :model="detailsForm" ref="detailsFormRef" :inline="true"
            label-width="70px">
                <h2>
                    {{detailsForm.title }}
                    <el-button type="text" icon="iconfont icon-shoucang" @click="Collect(detailsForm)" v-if="!detailsForm.isCol"></el-button>
                    <el-button type="text" icon="iconfont icon-shoucang1" @click="Collect(detailsForm)" v-if="detailsForm.isCol"></el-button>
                </h2>
                <h3>               
                <el-form-item label="简介" prop="content">
                    <el-tag type="info">{{ detailsForm.content }}</el-tag>
                </el-form-item>
                <el-form-item label="点赞数" prop="zan">
                    <el-tag>{{ detailsForm.zan }}</el-tag>
                </el-form-item>
                </h3>
                <el-form-item label="图片" prop="url">
                    <el-image :src="detailsForm.url">
                    </el-image>
                </el-form-item>
                <el-form-item label="评论" prop="comment">
                    <el-input v-model="detailsForm.comment"></el-input>
                </el-form-item>
            </el-form>

            
            <span slot="footer" class="dialog-footer">
                <el-button @click="detailsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sendcomment">确 定</el-button>
            </span>
        </el-dialog>
        </el-main>
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
            currentDate: new Date(),
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
            //轮播图列表
            artList:[],
            // 控制详情对话框的显示与隐藏
            detailsDialogVisible: false,
            // 详情的表单数据
            detailsForm: {
                id: '',
                title: '',
                content: '',
                comment: '',
                zan: '',
                url: ''
            },
            //登录注册显示
            showlogin: true,
            //登录用户id
            PersonId: '',
            //登录用户名
            Personame: '',
            br: '<br>',
            
        } 
    },
    created(){
        this.getcarousel()
    },
    methods:{
        async getcarousel(){
            //后台获取轮播图片，然后存放到数组。
            const { data : res} =  await this.$http.get('getart')
            this.artList = res;
            const PersonFlag = window.sessionStorage.getItem('person')
            this.PersonId = PersonFlag
            if(this.PersonId){
                this.showlogin = false
                this.getPerson(this.PersonId)
            }
            
        },
        async getPerson(id){
            const { data: res} = await this.$http.get("getpersonbyid?id="+id)
            // console.log(res)
            this.Personame = res.username
        },
        toBehind(){
            this.$router.push("/welcome")
        },
        tologin(){
            this.$router.push("/login")
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
                    this.$message.error('注册用户失败')
                }
                this.$message.success('注册用户成功')
                // 隐藏添加用户的对话框
                this.registerDialogVisible = false
            })
        },
       
        
        //点赞
        async Likeit(item) {
            if(!this.PersonId) 
                return this.$message.error('请先登录~')
            if(item.isZan) {
                return this.$message.error('您已经点过赞了~')
            }
            const {data: res} = await this.$http.put(
                `likeit?id=${item.id}&zan=${item.zan}`
            )
            if(res != "success") {
                this.$message.error('点赞失败')
            }           
            this.$message.success('点赞成功')
            this.$set(item,'isZan','true')
        },

        //收藏
        async Collect(item) {
            if(!this.PersonId)
                return this.$message.error('请先登录~')
            if(item.isCol) {
                return this.$message.error('您已经收藏过了~')
            }
            const {data: res} = await this.$http.put(
                `collection?person_id=${this.PersonId}&art_id=${item.id}`
            )
            if(res != "success") {
                this.$message.error('收藏失败')
            }
            this.$message.success('收藏成功')
            this.$set(item,'isCol','true')
        },
         // 展示详情的对话框
        async showDetailsDialog(id) {
            
            // console.log(id)
            const { data: res} = await this.$http.get("getartbyid?id="+id)
            // console.log(res)
            this.detailsForm = res
            this.detailsDialogVisible = true
        },
        // 监听详情对话框的关闭事件
        detailsDialogClosed() {
            this.$refs.detailsFormRef.resetFields()
        },
        // 点击确定按钮，添加评论
        async sendcomment(){
            const {data: res} = await this.$http.put(
                `addcom?pid=${this.PersonId}&aid=${this.detailsForm.id}&title=${this.detailsForm.comment}`
            )
            if(res != "success") {
                this.$message.error('评论失败')
            }
            this.$message.success('评论成功')
            this.detailsDialogVisible = false
        },
    }
}
</script>


<style lang="less" scoped>
.el-carousel__item h3 {
    color: #475669;
    font-size: 14px;
    opacity: 0.75;
    line-height: 500px;
    margin: 0;
  }

.el-header > div span {
    margin-left: 0;
}
  
  .el-carousel__item:nth-child(2n) {
    background-color: #99a9bf;
  }
  
  .el-carousel__item:nth-child(2n+1) {
    background-color: #d3dce6;
  }

.time {
    font-size: 13px;
    color: #999;
  }
  
  .bottom {
    margin-top: 13px;
    line-height: 12px;
  }

  .button {
    padding: 0;
    float: right;
  }

  .image {
    width: 50%;
    display: block;
  }

  .clearfix:before,
  .clearfix:after {
      display: table;
      content: "";
  }
  
  .clearfix:after {
      clear: both
  }

  .el-header {
    line-height: 60px;
  }

</style>
