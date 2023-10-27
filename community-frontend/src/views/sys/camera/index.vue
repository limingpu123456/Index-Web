<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" @keyup.enter.native="initData()">
      <el-form-item>
        <el-button v-has="'sys:camera:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle(1)">添加</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-has="'sys:camera:info'" type="success" icon="el-icon-edit" :disabled="ids.length <= 0" @click="addOrUpdateHandle()">编辑</el-button>
      </el-form-item>
      <el-form-item>
        <el-button v-has="'sys:camera:del'" type="danger" icon="el-icon-delete" :disabled="ids.length <= 0" @click="deleteHandle()">删除</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="topictable" v-loading="loading" :height="tableHeight" :row-style="rowStyle" size="mini" border :data="tableData" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="cameraInfoId" label="ID" width="60" sortable align="center" />
      <el-table-column prop="communityName" label="小区名称" show-overflow-tooltip align="center" width="180" />
      <el-table-column prop="cameraName" label="摄像头名称" show-overflow-tooltip align="center" width="150" />
      <el-table-column prop="macID" label="IP地址" width="180" align="center" />
      <el-table-column prop="direction" label="方向" width="100" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.direction === 1">进场</p>
          <p v-else-if="scope.row.direction === 2">出场</p>
        </template>
      </el-table-column>
      <el-table-column prop="state" label="状态" width="100" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.state === 1">启用</p>
          <p v-else-if="scope.row.state === 2">禁用</p>
        </template>
      </el-table-column>
      <el-table-column prop="seq" label="排序" show-overflow-tooltip align="center" width="100" />
      <el-table-column prop="creater" label="操作人" show-overflow-tooltip align="center" width="150" />
      <el-table-column prop="createTime" label="操作时间" show-overflow-tooltip align="center" width="180" />
    </el-table>
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getCameraList, del } from '@/api/sys/camera'
import AddOrUpdate from './add-or-update'

export default {
  name: 'Camera',
  components: {
    AddOrUpdate
  },
  data() {
    return {
      listQuery: {
        communityId: ''

      },
      total: 0,
      loading: true,
      downloadLoading: false,
      ids: [],
      tableData: [],
      addOrUpdateVisible: false
    }
  },
  watch: {
    $route(to, from) {
      if (this.$route.query.communityId !== undefined) {
        this.listQuery.communityId = this.$route.query.communityId
        this.initData()
      }
    }
  },
  created() {
    this.listQuery.communityId = this.$route.query.communityId
    this.initData()
  },
  mounted() {
    // console.log(window.innerHeight)
    // console.log(this.$refs.topictable.$el)
    // console.log(this.$refs.topictable.$el.offsetTop)
    this.tableHeight = window.innerHeight - this.$refs.topictable.$el.offsetTop - 50
    // console.log(this.tableHeight)
  },
  methods: {
    initData() {
      this.loading = true
      getCameraList(this.listQuery.communityId).then(res => {
        this.tableData = res.data
        this.loading = false
      })
    },
    // 多选
    selectionChangeHandle(val) {
      this.ids = val
    },
    // 添加和编辑
    addOrUpdateHandle(flag) {
      this.addOrUpdateVisible = true
      if (flag !== 1) {
        if (this.ids.length > 1) {
          this.$message.error('编辑操作只能选择单条数据')
          return
        }
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.listQuery.communityId, this.ids[0].cameraInfoId)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(this.listQuery.communityId, 0)
        })
      }
    },
    formatDate(row, column) {
      const daterc = row[column.property]
      console.log(daterc)
      if (daterc != null) {
        const dateMat = new Date(daterc)
        const year = dateMat.getFullYear()
        const month = dateMat.getMonth() + 1
        const day = dateMat.getDate()
        // const hh = dateMat.getHours()
        // const mm = dateMat.getMinutes()
        // const ss = dateMat.getSeconds()
        // const timeFormat = year + '/' + month + '/' + day + ' ' + hh + ':' + mm + ':' + ss
        const timeFormat = year + '-' + month + '-' + day
        return timeFormat
      }
    },
    // 删除
    deleteHandle(id) {
      const userIds = id ? [id] : this.ids.map(item => {
        return item.cameraInfoId
      })
      this.$confirm('确定删除 [id='+userIds+'] 的数据?').then(res => {
        del(userIds).then(res => {
          console.log(userIds)
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
    selectAgent() {
      console.log(this.listQuery)
    },
    rowStyle({ row, rowIndex }) {
      if (this.ids.includes(row)) {
        return { 'background-color': 'rgb(185, 211, 249)' }
      }
    }
  }
}
</script>
