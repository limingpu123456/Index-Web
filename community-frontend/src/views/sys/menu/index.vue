<template>
  <div class="app-container">
    <el-form :inline="true">
      <el-form-item>
        <el-button v-has="'sys:menu:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle()">添加</el-button>
      </el-form-item>
    </el-form>
    <el-table
      v-loading="loading"
      border
      :data="tableData"
      row-key="id"
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
    >
      <el-table-column prop="name" label="名称" header-align="center" />
      <el-table-column prop="icon" label="图标" align="center">
        <template slot-scope="scope" align="center">
          <svg-icon :icon-class="scope.row.icon" />
        </template>
      </el-table-column>
      <el-table-column prop="status" label="类型" width="120" align="center">
        目录
      </el-table-column>
      <el-table-column prop="path" label="路由" align="center" />
      <el-table-column prop="hidden" label="隐藏" align="center" />
      <el-table-column prop="status" label="状态" width="120" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.status === 1">正常</p>
          <p v-else size="small" type="danger">禁用</p>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" align="center" />
      <el-table-column align="center" label="操作">
        <template slot-scope="scope">
          <el-button v-has="'sys:menu:edit'" size="small" type="text" @click="addOrUpdateHandle(scope.row.id)">编辑</el-button>
          <el-button v-has="'sys:menu:del'" size="small" type="text" @click="deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getDataList, del } from '@/api/sys/menu'
import AddOrUpdate from './add-or-update'

export default {
  name: 'Menu',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      loading: true,
      tableData: [],
      addOrUpdateVisible: false
    }
  },
  created() {
    this.initData()
  },
  methods: {
    initData() {
      this.loading = true
      getDataList().then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    // 添加和编辑
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      this.$nextTick(() => {
        this.$refs.addOrUpdate.init(id)
      })
    },
    // 删除
    deleteHandle(id) {
      this.$confirm('此操作将永久删除该数据, 是否继续?').then(res => {
        del(id).then(res => {
          this.loading = true
          if (res.code === 200) {
            this.loading = false
            this.initData()
            this.$message.success(res.msg)
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    }
  }
}
</script>
