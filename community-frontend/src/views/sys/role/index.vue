<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" @keyup.enter.native="initData()">
      <el-form-item label="角色名称">
        <el-input v-model="listQuery.roleName" placeholder="输入角色名称查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="initData">搜索</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-has="'sys:role:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle(1)">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-has="'sys:role:del'" type="success" icon="el-icon-edit" :disabled="dataListSelections.length <= 0" @click="addOrUpdateHandle()">编辑</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-has="'sys:role:del'" type="danger" icon="el-icon-delete" :disabled="dataListSelections.length <= 0" @click="deleteHandle()">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table v-loading="loading" border :data="tableData" :row-style="rowStyle" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="roleId" label="ID" width="80" align="center" />
      <el-table-column prop="roleName" label="角色名称" align="center" />
      <el-table-column prop="type" label="角色类型" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.type === 1">系统角色</p>
          <p v-else-if="scope.row.type === 2">单位角色</p>
        </template>
      </el-table-column>
      <el-table-column prop="remark" label="备注" align="center" />
      <el-table-column prop="createTime" label="创建时间" align="center" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getDataList, del } from '@/api/sys/role'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './add-or-update'

export default {
  name: 'Role',
  components: {
    Pagination,
    AddOrUpdate
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        roleName: ''
      },
      total: 0,
      loading: true,
      dataListSelections: [],
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
      getDataList(this.listQuery).then(res => {
        this.tableData = res.data.list
        this.total = res.data.totalCount
        this.loading = false
      })
    },
    // 多选
    selectionChangeHandle(val) {
      this.dataListSelections = val
    },
    // 添加和编辑
    addOrUpdateHandle(id) {
      this.addOrUpdateVisible = true
      if (id !== 1) {
        if (this.dataListSelections.length > 1) {
          this.$message.error('编辑操作只能选择单条数据')
          return
        }
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.dataListSelections[0].roleId)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(0)
        })
      }
    },
    // 删除
    deleteHandle(id) {
      const roleIds = id ? [id] : this.dataListSelections.map(item => {
        return item.roleId
      })
      this.$confirm('确定删除 [id='+roleIds+'] 的数据?').then(res => {
        del(roleIds).then(res => {
          console.log(roleIds)
          console.log(res)
          this.loading = true
          if (res.code === 200) {
            this.$message.success(res.msg)
            this.loading = false
            this.initData()
          } else {
            this.$message.error(res.msg)
          }
        })
      }).catch(() => {})
    },
    rowStyle({ row, rowIndex }) {
      if (this.dataListSelections.includes(row)) {
        return { 'background-color': 'rgb(185, 211, 249)' }
      }
    }
  }
}
</script>
