<template>
  <el-container class="home_container">
    <!-- 头部区域 -->
    <el-header>
      <div>
        <img src="../assets/heima.png" alt>
        <span>电商后台管理系统</span>
      </div>
      <el-button type="info" @click="logout">退出</el-button>
    </el-header>
    <!-- 页面主体区域 -->
    <el-container>
      <!--侧边栏  -->
      <el-aside :width="isCollapse ? '64px' : '200px'">
        <div class="toggle_button" @click="toggleColleapse">|||</div>
        <!-- 侧边栏菜单区域 -->
        <el-menu background-color="#545c64" text-color="#fff" active-text-color="#409EFF" :unique-opened="true" :collapse="isCollapse" :collapse-transition="false" :router="true" :default-active="activePath">
          <!-- 一级菜单 -->
          <el-submenu :index="items.id + ''" v-for="items in menuList" :key="items.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <!-- 图标 -->
              <i :class="iconsObj[items.id]"></i>
              <!-- 文本 -->
              <span>{{items.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <!-- 路由跳转地址 -->
            <el-menu-item :index="'/'+ subItem.path" v-for="subItem in items.children" :key="subItem.id" @click="saveNavState('/'+ subItem.path)">
              <!-- 二级菜单模板区域 -->
             <template slot="title">
                <!-- 图标 -->
                <i class="el-icon-menu"></i>
                <!-- 文本 -->
                <span>{{subItem.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <!-- 右侧内容主体 -->
      <el-main>
        <!-- 路由占位符 -->
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
export default {
    // 组件的私有数据
    data() {
      return {
        // 左侧菜单数据
        menuList:[],
        iconsObj:{
          125:'iconfont icon-users',
          103:'iconfont icon-tijikongjian',
          101:'iconfont icon-shangpin',
          102:'iconfont icon-danju',
          145:'iconfont icon-baobiao'
        },
        isCollapse:false,
        // 被激活的链接地址
        activePath:''
       
      }
    },
  // 页面一加载就获取所有左侧菜单
  created(){
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem('activePath');
  },
  methods: {
    logout() {
      window.sessionStorage.clear();
      this.$router.push("/login");
    },
    // 获取所有菜单
    async getMenuList() {
        // 解构赋值
        const {data :res} = await this.$http.get('menus')
        // 将获取的数据挂载在data中
        // console.log(res);
        if(res.meta.status !== 200) return this.$message.error(res.meta.msg)
        this.menuList = res.data;
    },
    toggleColleapse() {
      this.isCollapse = !this.isCollapse;
    },
    saveNavState(activePath) {
      console.log(activePath);
      window.sessionStorage.setItem('activePath',activePath)
      this.activePath = activePath;
    }
  }
};
</script>

<style lang="less" scoped>
.home_container {
  height: 100%;
}
.el-header {
  background-color: #383d41;
  display: flex;
  justify-content: space-between;
  padding-left: 0;
  align-items: center;
  color: #fff;
  font-size: 20px;
  > div {
    display: flex;
    align-items: center;
    span {
      margin-left: 15px;
    }
  }
}
.el-aside {
  background-color: #333743;
  .el-menu {
    border-right:0;
  }
}
.el-main {
  background-color: #eaedf2;
}
.iconfont {
  margin-right: 10px;
}
.toggle_button {
  background-color: #4A5064;
  color:#fff;
  font-size: 10px;
  line-height: 24px;
  text-align: center;
  letter-spacing: 0.2em;
  cursor: pointer;

}
</style>
