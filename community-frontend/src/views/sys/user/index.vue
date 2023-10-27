<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" @keyup.enter.native="initData()">
      <el-form-item label="姓名">
        <el-input v-model="listQuery.realName" placeholder="输入姓名查询" clearable />
      </el-form-item>
      <el-form-item label="账号">
        <el-input v-model="listQuery.username" placeholder="输入账号查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="initData">搜索</el-button>
      </el-form-item>
      <el-row>
        <el-col :span="24">
          <el-form-item>
            <el-button v-has="'sys:user:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle(1)">添加</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-has="'sys:user:edit'" type="success" icon="el-icon-edit" :disabled="ids.length <= 0" @click="addOrUpdateHandle()">编辑</el-button>
          </el-form-item>
          <el-form-item>
            <el-button v-has="'sys:user:del'" type="danger" icon="el-icon-delete" :disabled="ids.length <= 0" @click="deleteHandle()">删除</el-button>
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <el-form v-show="moreShow" :inline="true" :model="listQuery" @keyup.enter.native="initData()">
      <el-form-item label="手机号">
        <el-input
          v-model="listQuery.mobile"
          placeholder="输入手机号查询"
          clearable
        />
      </el-form-item>
    </el-form>
    <el-table ref="topictable" v-loading="loading" :height="tableHeight" :row-style="rowStyle" size="mini" border :data="tableData" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="userId" label="ID" width="80" sortable align="center" />
      <el-table-column prop="username" label="账号" show-overflow-tooltip align="center" />
      <el-table-column prop="realName" label="姓名" show-overflow-tooltip align="center" />
      <el-table-column prop="contact" label="联系人" show-overflow-tooltip align="center" />
      <el-table-column prop="mobile" label="联系电话" show-overflow-tooltip align="center" />
      <el-table-column prop="roleName" label="当前角色" show-overflow-tooltip align="center" />
      <el-table-column prop="status" label="状态" width="120" align="center">
        <template slot-scope="scope">
          <p v-if="scope.row.status === 1">正常</p>
          <p v-else>禁用</p>
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getDataList, del, exportExcel } from '@/api/sys/user'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './add-or-update'
import DownloadFile from 'file-saver'
import { getNowFormatDate } from '@/utils/index'

export default {
  name: 'User',
  components: {
    Pagination,
    AddOrUpdate
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        username: '',
        realName: '',
        mobile: '',
        startDate: '',
        endDate: ''
      },
      total: 0,
      dateRange: null,
      loading: true,
      downloadLoading: false,
      ids: [],
      tableData: [],
      addOrUpdateVisible: false,
      moreShow: false,
      pickerOptions: {
        shortcuts: [{
          text: '最近一周',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近一个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            picker.$emit('pick', [start, end])
          }
        }, {
          text: '最近三个月',
          onClick(picker) {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            picker.$emit('pick', [start, end])
          }
        }]
      },
      agentList: []
    }
  },
  watch: {
    dateRange(val) {
      if (val == null) {
        this.listQuery.startDate = ''
        this.listQuery.endDate = ''
      } else {
        this.listQuery.startDate = val[0]
        this.listQuery.endDate = val[1]
      }
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    // console.log(window.innerHeight)
    // console.log(this.$refs.topictable.$el)
    // console.log(this.$refs.topictable.$el.offsetTop)
    this.tableHeight = window.innerHeight - this.$refs.topictable.$el.offsetTop - 80
    // console.log(this.tableHeight)
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
      this.ids = val
    },
    moreSearch() {
      this.moreShow = !this.moreShow
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
          this.$refs.addOrUpdate.init(this.ids[0].userId)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init()
        })
      }
    },
    // 导出
    handleExcel() {
      this.confirm(`是否确认导出所有数据项?`).then(res => {
        this.downloadLoading = true
        exportExcel(this.listQuery).then(res => {
          const fileName = '用户列表' + getNowFormatDate() + '.xlsx'
          DownloadFile(res.data, fileName)
          this.downloadLoading = false
        })
      }).catch(() => {})
    },
    // 删除
    deleteHandle(id) {
      const userIds = id ? [id] : this.ids.map(item => {
        return item.userId
      })
      this.$confirm('确定删除 [id='+userIds+'] 的数据?').then(res => {
        del(userIds).then(res => {
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
      if (this.ids.includes(row)) {
        return { 'background-color': 'rgb(185, 211, 249)' }
      }
    }
  }
}
</script>
