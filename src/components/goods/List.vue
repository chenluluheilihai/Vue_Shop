<template>
  <div>
    <!-- 面包屑导航 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryInfo.query" clearable @clear="getGoodList">
            <el-button slot="append" icon="el-icon-search" @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="4">
          <el-button type="primary" @click="goAddpage">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- table表格区 -->
      <el-table :data="goodsList" border stripe>
          <el-table-column type="index"></el-table-column>
          <el-table-column label="商品名称" prop="goods_name"></el-table-column>
          <el-table-column label="商品价格（元）" prop="goods_price" width="95px"></el-table-column>
          <el-table-column label="商品重量" prop="goods_weight" width="70px"></el-table-column>
          <el-table-column label="创建时间" prop="add_time" width="140px">
              <template slot-scope="scope">
                  {{scope.add_time | dateFormat()}}
              </template>
          </el-table-column>
          <el-table-column label="操作" width="130px">
             <template slot-scope="scope">
                 <el-button type="primary" icon="el-icon-edit" size="mini"></el-button>
                 <el-button type="danger" icon="el-icon-delete" size="mini" @click="removeById(scope.row.goods_id)"></el-button>
             </template>
          </el-table-column>

        
      </el-table>
    </el-card>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 查询参数对象
      queryInfo: {
        query: "",
        pagenum: 1,
        pagesize: 10
      },
      // 商品列表
      goodsList: [],
      // 总数据条数
      total: 0
    };
  },
  created() {
    this.getGoodList();
  },
  methods: {
    // 根据分页获取商品列表
    async getGoodList() {
      const { data: res } = await this.$http.get("goods", {
        params: this.queryInfo
      });
      if (res.meta.status !== 200) {
        this.$message.error("获取商品列表失败");
      }
      //    console.log(res.data);
      this.goodsList = res.data.goods;
      this.total = res.data.total;
    },
    // 通过id删除商品
    async removeById(goods_id) {
      const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm'){
          return this.$message.error('取消删除');
        }
       const {data : res} = await this.$http.delete('goods/'+ goods_id)
       if(res.meta.status !== 200)  {
         return this.$message.error('删除商品失败');
       }
         this.$message.success('删除商品成功');
         this.getGoodList();
    },
    // 添加商品
    goAddpage() {
      this.$router.push('/goods/add');
    }

  }
};
</script>


<style scoped lang="less">
</style>

