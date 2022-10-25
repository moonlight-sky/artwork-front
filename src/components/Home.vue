<template>
    <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
        <div @click="towelcome">
            <img src="../assets/logo.png">
            <span>工艺品展示系统</span>
        </div>
        <el-menu default-active="1"
            class="el-menu-demo"
            mode="horizontal"
            
            background-color="#373D41"
            text-color="#fff"
            active-text-color="#ffd04b">
            <!-- <el-menu-item index="1">后台</el-menu-item>
            <el-menu-item index="2" @click="toFront">前台</el-menu-item> -->
        </el-menu>
        <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主题区 -->
    <el-container>
        <!-- 侧边栏 -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle-button" @click="toggleCollapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#333744" text-color="#eee"
        active-text-color="#409EFF" :unique-opened="true" 
        :collapse="isCollapse" :collapse-transition="false"
        :router="true" :default-active="activePath">
            <!-- 一级菜单 -->
            <el-submenu :index="item.id+''" v-for="item in menulist" :key="item.id">
                <!-- 一级菜单的模板区域 -->
                <template slot="title">
                    <!-- 图标 -->
                    <i :class="iconsObj[item.id]"></i>
                    <!-- 文本 -->
                    <span>{{item.title}}</span>
                </template>
                <!-- 二级菜单 -->
                <el-menu-item :index="subItem.path" v-for="subItem in item.sList" :key="subItem.id"
                @click="saveNavState(subItem.path)">
                    <template slot="title">
                        <!-- 图标 -->
                        <i class="el-icon-menu"></i>
                        <!-- 文本 -->
                        <span>{{subItem.title}}</span>
                    </template>
                </el-menu-item>
            </el-submenu>
        </el-menu>
      </el-aside>


      <!-- 右侧内容主体 -->
      <el-main>
          <!-- 路由占位符-->
          <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
    data() {
        return {
            //左侧菜单数据
            menulist: [],
            iconsObj: {
                '100': 'iconfont icon-user',
                '200': 'iconfont icon-tijikongjian',
                '300': 'iconfont icon-baobiao'
            },
            // 是否折叠
            isCollapse: false,
            // 被激活的链接地址
            activePath: ''
        }
    },
  created() {
      this.getMenuList()
      this.activePath = window.sessionStorage.getItem('activePath')
  },  
    methods:{
        logout(){
            window.sessionStorage.clear();//清除session(token)
            this.$message.success('退出成功');
            this.$router.push("/");
        },
        // 获取所有的菜单
        async getMenuList() {
            const {data: res} = await this.$http.get('menus')
            if(res.flag != 200) return this.$message.error("获取列表失败");
            
            const UserFlag = window.sessionStorage.getItem('user')
            const PersonFlag = window.sessionStorage.getItem('person')
            if(UserFlag)
                this.menulist = res.data
            else
                this.menulist = res.data
            // console.log(res.data[2])
        },
        //点击按钮，切换菜单的折叠与展开
        toggleCollapse() {
            this.isCollapse = !this.isCollapse
        },
        //保存链接的激活状态
        saveNavState(activePath) {
            window.sessionStorage.setItem('activePath', activePath)
            this.activePath = activePath
        },
        //去前台
        // toFront(){
        //     // window.sessionStorage.clear();//清除session(token)
        //     this.$router.push("/index");
        // },
        //去欢迎页
        towelcome(){
            window.sessionStorage.removeItem('activePath')
            this.$router.push("/welcome");

        }
    }
}
</script>

<style lang="less">
.home-container {
  height: 100%;
}
.el-header{
  background-color:#373D41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
      display: flex;
      align-items: center;
  }
}
.el-aside{
  background-color:#333744;
  .el-menu {
    border-right: none;
  }
}
.el-main{
  background-color:#eaedf1;
}

.iconfont {
    margin-right: 10px;
}

.toggle-button {
    background-color: #4A5064;
    font-size: 10px;
    line-height: 24px;
    color: #fff;
    text-align: center;
    letter-spacing: 0.2em;
    cursor: pointer;
}
img{
    width: 15%;
    height: 15%;
}
</style>