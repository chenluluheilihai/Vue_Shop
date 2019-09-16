<template>
  <div>
    <!-- 面包屑导航区域 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>权限管理</el-breadcrumb-item>
      <el-breadcrumb-item>角色列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片视图区域 -->
    <el-card>
      <!-- 添加角色按钮区域 -->
      <el-row>
        <el-col>
          <el-button type="primary" @click="rolesDialogVisible = true">添加角色</el-button>
        </el-col>
      </el-row>
      <!-- 渲染角色列表 -->
      <el-table :data="rolesList" border stripe>
        <!-- 展开列 -->
        <el-table-column type="expand">
          <template slot-scope="scope">
            <el-row
              :class="['bdbutton',index1===0 ? 'bdtop':'','vcenter' ]"
              v-for="(item1,index1) in scope.row.children"
              :key="item1.id"
            >
              <!-- 渲染一级权限 -->
              <el-col :span="5">
                <!-- <el-button type="primary" plain>{{item1.authName}}</el-button> -->
                <el-tag closable>{{item1.authName}}</el-tag>
                <i class="el-icon-caret-right"></i>
              </el-col>
              <!-- 渲染二级三级权限 -->
              <el-col :span="19">
                <el-row
                  :class="[index2===0 ? '' : 'bdtop','vcenter']"
                  v-for="(item2,index2) in item1.children"
                  :key="item2.id"
                >
                  <!-- 二级权限 -->
                  <el-col :span="6">
                    <el-tag type="success" closable>{{item2.authName}}</el-tag>
                    <i class="el-icon-caret-right"></i>
                  </el-col>
                  <!-- 三级级权限 -->
                  <el-col :span="18">
                    <el-tag
                      type="wraning"
                      v-for="(item3, index3) in item2.children"
                      :key="item3.id"
                      closable
                      @close="closeRolesById(scope.row,item3.id)"
                    >{{item3.authName}}</el-tag>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </template>
        </el-table-column>

        <!-- 索引列 -->
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="角色名称" prop="roleName"></el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"></el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" @click="showEditDialog(scope.row.id)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" @click="removeById(scope.row.id)">删除</el-button>
            <el-button type="warning" icon="el-icon-setting" @click="showSetRightDialog(scope.row)">分配权限</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <!-- 添加角色对话框 -->
    <el-dialog title="添加角色" :visible.sync="rolesDialogVisible" @close="rolesDialogClosed">
      <el-form :model="roles" ref="rolesFromRef">
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="roles.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="roles.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addRoles">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 添加编辑对话框 -->
    <el-dialog title="编辑角色" :visible.sync="editDialogVisible" @close="editDialogClosed">
      <el-form :model="editForm" ref="editFromRef">
        <el-form-item label="编辑名称" prop="roleName">
          <el-input v-model="editForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="编辑描述" prop="roleDesc">
          <el-input v-model="editForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="rolesDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editRoles">确 定</el-button>
      </div>
    </el-dialog>

    <!-- 分配权限对话框 -->
    <el-dialog title="分配权限" :visible.sync="setRightDialogVisible" width="50%" @close="setRightDialogClosed">
      <!-- 树形控件 -->
      <el-tree :data="rightsList" :props="treeProps" show-checkbox node-key="id" :default-expand-all="true" :default-checked-keys="defKeys" ref="treeRef"></el-tree>
      <span slot="footer" class="dialog-footer">
        <el-button @click="setRightDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="allotRigths">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  data() {
    return {
      // 获得所有角色数据
      rolesList: [],
      roles: {
        roleName: "",
        roleDesc: ""
      },
      editForm: {},
      rolesDialogVisible: false,
      editDialogVisible: false,
      // 控制分配权限对话框的显示和隐藏
      setRightDialogVisible: false,
      // 获取所有权限数据
      rightsList: [],
      // 树形控件属性绑定对象
      treeProps:{
        label:'authName',
        children: 'children'
      },
      // 树形第三层id值
      defKeys:[],
      // 角色id
      rolesId:''
    };
  },
  created() {
    this.getRolesList();
  },
  methods: {
    // 获取角色列表数据
    async getRolesList() {
      const { data: res } = await this.$http.get("roles");
      //console.log(res);
      this.rolesList = res.data;
    },
    // 关闭添加角色对话框，清空表单内容
    rolesDialogClosed() {
      this.$refs.rolesFromRef.resetFields();
    },
    // 添加角色
    async addRoles() {
      const { data: res } = await this.$http.post("roles", this.roles);
      // console.log(res);
      if (res.meta.status !== 201) {
        this.$message.error("添加角色失败");
      } else {
        this.$message.success("添加角色成功");
      }
      this.rolesDialogVisible = false;
      this.getRolesList();
    },
    // 关闭编辑角色对话框，清空表单内容
    editDialogClosed() {
      this.$refs.editFromRef.resetFields();
    },
    // 展示编辑角色对话框
    async showEditDialog(rolesId) {
      const { data: res } = await this.$http.get("roles/" + rolesId);
      if (res.meta.status !== 200) {
        this.$message.error("展示角色数据失败");
      } else {
        // console.log(res);
        this.editForm = res.data;
        this.editDialogVisible = true;
      }
    },
    // 修改角色对话框
    async editRoles() {
      const { data: res } = await this.$http.put(
        "roles/" + this.editForm.roleId,
        {
          roleName: this.editForm.roleName,
          roleDesc: this.editForm.roleDesc
        }
      );
      // console.log(res);
      if (res.meta.status !== 200) {
        this.$message.error("添加角色失败");
      } else {
        this.editDialogVisible = false;
        this.getRolesList();
        this.$message.success("添加角色成功");
      }
    },
    // 删除单个角色列表
    async removeById(roleId) {
      const confirmRresult = await this.$confirm(
        "此操作将永久删除该文件, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning"
        }
      ).catch(err => err);
      // console.log(confirmRresult);
      if (confirmRresult !== "confirm") {
        this.$message.success("已经取消删除");
      } else {
        const { data: res } = await this.$http.delete("roles/" + roleId);
        if (res.meta.status !== 200) {
          this.$message.error("删除角色失败");
        } else {
          this.$message.success("删除角色成功");
          this.getRolesList();
        }
      }
    },
    // 展示分配权限对话框
    async showSetRightDialog(roles) {
      this.rolesId = roles.id;
      // 获取所有权限列表
      const {data: res} = await this.$http.get('rights/tree');
      if(res.meta.status !== 200) {
        return this.$message.error('获取权限列表失败');
      }
        this.rightsList = res.data;
        // console.log(this.rightsList);
        // 递归获取三级节点
        this.getLeafKeys(roles,this.defKeys);
        this.setRightDialogVisible = true;
    },
    // 通过递归的形式，获取角色下的所有权限的id，并保存到defkeys数组中
    getLeafKeys(node, arr){
      // 如果当前的node节点不包含children属性，则是三级节点
      if(!node.children) {
        return arr.push(node.id);
      }
      node.children.forEach(item => {
        this.getLeafKeys(item, arr)
      });
    },
    // 通过id号删除权限el-tag
    async closeRolesById(role,id) {
       const confirmResult = await this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).catch(err => err)
        if(confirmResult !== 'confirm') {
          return this.$message.info('取消删除权限')
        }
        const {data : res} = await this.$http.delete(`roles/${role.id}/rights/${id}`)
       if(res.meta.status !== 200){
         return this.$message.error('权限删除失败')
       }
        // console.log(res);
        // 刷新整个页面
        // this.getRolesList();
        // 服务器响应回来的数删除之后的数据 赋值给之前的数据 提高用户体验
        // scope.row.children = res.data;
        role.children = res.data;
    },
    // 监听分配权限对话框的关闭事件
    setRightDialogClosed() {
      this.defKeys = [];
    },
    //点击为角色分配权限
   async allotRigths() {
      const keys = [
        ...this.$refs.treeRef.getCheckedKeys(),
        ...this.$refs.treeRef.getHalfCheckedKeys()
      ]
      // console.log(keys);
      var idStr = keys.join(',');
     const {data : res} = await this.$http.post(`roles/${this.rolesId}/rights`,{
        rids:idStr
      })
      if(res.meta.status !== 200) {
        return this.$message.error('分配角色失败');
      }
        this.setRightDialogVisible = false;
        this.getRolesList();
        this.$message.success('分配角色成功'); 
    }
  }
};
</script>

<style lang="less" scoped>
.vcenter {
  display: flex;
  align-items: center;
}
</style>
