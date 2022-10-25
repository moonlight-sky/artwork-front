<template>
    <div>
        <h3>Welcome</h3>
        <el-card>
            <el-descriptions title="管理员信息">
                <el-descriptions-item label="用户名">{{userinfo.username}}</el-descriptions-item>
                <el-descriptions-item label="邮箱">{{userinfo.email}}</el-descriptions-item>
                <el-descriptions-item label="状态">{{userinfo.state}}</el-descriptions-item>
            </el-descriptions>
        </el-card>
    </div>
</template>

<script>
export default {
    data(){
        return{
            user: true,
            userinfo:[],
            showinfo: " ",
            id: '',
        }
    },
    created(){
        this.getinfo()
    },
    methods:{
        async getinfo() {
            const UserId = window.sessionStorage.getItem('user')
            this.showinfo = "getuserbyid"
            this.id = UserId
            const { data: res} = await this.$http.get(this.showinfo+"?id="+this.id)
            this.userinfo  = res
        }
    }
}
</script>

<style lang="less" scoped>

</style>