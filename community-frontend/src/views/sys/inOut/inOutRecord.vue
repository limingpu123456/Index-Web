<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery" @keyup.enter.native="initData()">
      <el-form-item label="姓名" prop="userName">
        <el-input v-model="listQuery.userName" type="text" placeholder="请输入姓名" clearable style="width:120px" />
      </el-form-item>
      <el-form-item>
        <el-form-item label="入场时间 从" prop="startDate">
          <el-date-picker v-model="listQuery.startDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd  HH:mm:ss" placeholder="开始时间" style="width:190px" />
          至<el-date-picker v-model="listQuery.endDate" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd  HH:mm:ss" placeholder="结束时间" style="width:190px" />
        </el-form-item>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="initData">搜索</el-button>
      </el-form-item>
    </el-form>
    <el-table ref="topictable" v-loading="loading" :height="tableHeight" :row-style="rowStyle" size="mini" border :data="tableData" @selection-change="selectionChangeHandle">
      <el-table-column prop="inOutRecordId" label="ID" width="60" sortable align="center" />
      <el-table-column prop="communityName" label="小区名称" show-overflow-tooltip align="center" width="150" />
      <el-table-column prop="termName" label="所在楼栋" show-overflow-tooltip align="center" width="130" />
      <el-table-column prop="houseNo" label="房号" show-overflow-tooltip align="center" width="130" />
      <el-table-column prop="userName" label="姓名" show-overflow-tooltip align="center" width="130" />
      <el-table-column prop="inTime" label="入场时间" show-overflow-tooltip align="center" width="180" />
      <el-table-column prop="inPic" label="入场图片" show-overflow-tooltip width="130" align="center">
        <template slot-scope="scope">
          <el-image v-if="scope.row.inPic" :src="scope.row.inPic" style="height:50px" title="点击查看大图" :preview-src-list="[scope.row.inPic]" />
        </template>
      </el-table-column>
      <el-table-column prop="outTime" label="出场时间" show-overflow-tooltip width="180" align="center" />
      <el-table-column prop="inPic" label="出场图片" show-overflow-tooltip width="130" align="center">
        <template slot-scope="scope">
          <el-image v-if="scope.row.outPic" :src="scope.row.outPic" style="height:50px" title="点击查看大图" :preview-src-list="[scope.row.outPic]" />
        </template>
      </el-table-column>
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
  </div>
</template>

<script>
import { getList, exportExcel } from '@/api/sys/inOut'
import Pagination from '@/components/Pagination'

export default {
  name: 'Consume',
  components: {
    Pagination
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        userName: '',
        startDate: '',
        endDate: ''
      },
      totalMoney: 0,
      total: 0,
      dateRange: null,
      loading: true,
      downloadLoading: false,
      ids: [],
      tableData: [],
      addOrUpdateVisible: false
    }
  },
  created() {
    this.initData()
  },
  mounted() {
    this.tableHeight = window.innerHeight - this.$refs.topictable.$el.offsetTop - 60
  },
  methods: {
    initData() {
      this.loading = true
      getList(this.listQuery).then(res => {
        console.log(this.listQuery)
        console.log(res)
        this.tableData = res.data.pageList.list
        this.total = res.data.pageList.totalCount
        this.totalMoney = res.data.totalMoney
        this.loading = false
      })
    },
    // 多选
    selectionChangeHandle(val) {
      this.ids = val
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
    rowStyle({ row, rowIndex }) {
      if (this.ids.includes(row)) {
        return { 'background-color': 'rgb(185, 211, 249)' }
      }
    }
  }
}
</script>
