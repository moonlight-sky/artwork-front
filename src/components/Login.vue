<template>
    <div class="login_container">
        <!-- 登录块 -->
        <div class="login_box">
            <!-- 头像logo -->
            <div class="avatar_box">
                <img src="../assets/logo.png" alt="">
            </div>
            <!-- 表单区域 -->
            <el-form ref="loginFormRef" :model="loginForm" :rules="loginFormRules" class="login_form" label-width="0">
                <!-- 用户名 -->
                <el-form-item prop="username">
                    <el-input prefix-icon="iconfont icon-user" v-model="loginForm.username"></el-input>
                </el-form-item>
                <!-- 密码 -->
                <el-form-item prop="password">
                    <el-input prefix-icon="iconfont icon-3702mima" v-model="loginForm.password" type="password"></el-input>
                </el-form-item>
                <!-- 按钮 -->
                <el-form-item class="btns">
                    <el-radio v-model="radio" label="1">管理员</el-radio>
                    <el-radio v-model="radio" label="2">用户</el-radio>
                    <el-button type="primary" @click="login">登录</el-button>
                    <el-button type="info" @click="resetLoginForm">重置</el-button>
                </el-form-item>
            </el-form>
        </div>
        
    </div>
</template>

<script>
export default{
    data(){
        return{
            //登录表单的数据绑定对象
            loginForm:{
                username:"",
                password:""
            },
            //这是表单的验证规则对象
            loginFormRules: {
                //验证用户名是否合法
                username: [
                    { required: true, message: '请输入登录名称', trigger: 'blur' },
                    { min: 3, max: 10, message: '长度在 3 到 10 个字符', trigger: 'blur' }
                ],
                //验证密码是否合法
                password: [
                    { required: true, message: '请输入登录密码', trigger: 'blur' },
                    { min: 6, max: 15, message: '长度在 6 到 15 个字符', trigger: 'blur' }
                ]
            },
            //登录角色选择
            radio: '1',
            loginurl: " "
        }
    },
    methods:{
        resetLoginForm(){
            this.$refs.loginFormRef.resetFields();
        },
        login(){
            this.$refs.loginFormRef.validate(async valid =>{
                if(!valid) return;
                if(this.radio == 1){
                    this.loginurl = "login"
                }                 
                else{
                    this.loginurl = "userlogin"
                }
                const {data: res } = await this.$http.post(this.loginurl,this.loginForm);
                if(res.flag=="ok"){
                    this.$message.success('登录成功');
                    if(this.radio == 1){
                        window.sessionStorage.setItem("user",res.user.id);//存储user对象(token值)
                        this.$router.push("/home");
                    }else{
                        window.sessionStorage.setItem("person",res.user.id);
                        this.$router.push("/index");
                    }
                    
                    
                }else{
                    this.$message.error('登录失败');
                }
            })
        },
    }
}

</script>

<style lang="less" scoped>
// 根结点样式
.login_container{
    background-color: #2b4b6b;
    height: 100%;
}
.login_box{
    width: 450px;
    height: 300px;
    background-color: #fff;
    border-radius: 3px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%);
    .avatar_box{
        width: 130px;
        height: 130px;
        // border: 1px solid #eee;
        border-radius: 50%;
        
        box-shadow: 0 0 10px #ddd;
        position: absolute;
        left: 50%;
        transform: translate(-50%,-50%);
        background-color: #eee;
        img{
            width: 100%;
            height: 100%;
            border-radius: 50%;
            background-color: #eee;
        }
    }
}
.btns{
    display: flex;
    justify-content: flex-end;
}
.login_form{
    position: absolute;
    bottom: 0%;
    width: 100%;
    padding: 0 10px;
    box-sizing: border-box;
}
</style>
