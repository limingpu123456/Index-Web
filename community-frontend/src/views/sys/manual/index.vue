<template>
  <div class="app-container">
    <el-form :inline="true" :model="listQuery">
      <el-form-item label="小区名称">
        <el-select v-model="listQuery.communityId" filterable placeholder="请选择" style="width:150px" clearable>
          <el-option
            v-for="park in communityList"
            :key="park.communityId"
            :label="park.communityName"
            :value="park.communityId"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="姓名">
        <el-input v-model="listQuery.visitor" placeholder="输入访客姓名" clearable />
      </el-form-item>
      <el-form-item label="手机号">
        <el-input v-model="listQuery.mobile" placeholder="输入手机号查询" clearable />
      </el-form-item>
      <el-form-item>
        <el-button type="primary" icon="el-icon-search" @click="initData">搜索</el-button>
      </el-form-item>
      <el-row>
        <el-form-item>
          <el-button v-has="'sys:manual:add'" type="primary" icon="el-icon-plus" @click="addOrUpdateHandle(1)">添加</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-has="'sys:manual:info'" type="success" icon="el-icon-edit" :disabled="ids.length <= 0" @click="addOrUpdateHandle()">编辑</el-button>
        </el-form-item>
        <el-form-item>
          <el-button v-has="'sys:manual:del'" type="danger" icon="el-icon-delete" :disabled="ids.length <= 0" @click="deleteHandle()">删除</el-button>
        </el-form-item>
      </el-row>
    </el-form>
    <el-table ref="topictable" v-loading="loading" :height="tableHeight" :row-style="rowStyle" size="mini" border :data="tableData" @selection-change="selectionChangeHandle">
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column prop="manualRecordId" label="ID" width="60" sortable align="center" />
      <el-table-column prop="communityName" label="小区名称" show-overflow-tooltip align="center" width="120" />
      <el-table-column prop="visitor" label="访客姓名" width="80" align="center" />
      <el-table-column prop="cardNo" label="身份证号" width="120" align="center" />
      <el-table-column prop="mobile" label="手机号码" show-overflow-tooltip align="center" width="100" />
      <el-table-column prop="termName" label="所在楼栋" show-overflow-tooltip align="center" width="80" />
      <el-table-column prop="houseNo" label="房号" show-overflow-tooltip align="center" width="80" />
      <el-table-column prop="interviewee" label="受访者姓名" width="100" align="center" />
      <el-table-column prop="remark" label="备注" show-overflow-tooltip align="center" width="100" />
      <el-table-column prop="inTime" label="进入时间" show-overflow-tooltip align="center" width="150" />
      <el-table-column prop="outTime" label="离开时间" show-overflow-tooltip align="center" width="150" />
      <el-table-column prop="userName" label="登记人" show-overflow-tooltip align="center" width="80" />
      <el-table-column prop="signTime" label="登记时间" show-overflow-tooltip align="center" width="150" />
    </el-table>
    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="initData" />
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="initData" />
  </div>
</template>

<script>
import { getmanualList, del, getCommunityList } from '@/api/sys/manual'
import Pagination from '@/components/Pagination'
import AddOrUpdate from './add-or-update'

export default {
  name: 'Manual',
  components: {
    Pagination,
    AddOrUpdate
  },
  data() {
    return {
      listQuery: {
        page: 1,
        limit: 10,
        userName: '',
        communityId: '',
        carNo: '',
        personId: '',
        mobile: ''

      },
      total: 0,
      loading: true,
      downloadLoading: false,
      ids: [],
      tableData: [],
      communityList: [],
      agentList: [],
      addOrUpdateVisible: false
    }
  },
  created() {
    this.initData()
    // this.getAllAgent()
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
      getmanualList(this.listQuery).then(res => {
        this.communityList = res.data.communityList
        // this.getCommunityList()
        this.tableData = res.data.pageList.list
        this.total = res.data.pageList.totalCount
        this.loading = false
      })
    },
    getCommunityList() {
      getCommunityList().then(res => {
        if (res.code === 200) {
          this.communityList = []
          this.communityList = res.data
          this.listQuery.communityId = ''
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
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
          this.$refs.addOrUpdate.init(this.ids[0].manualRecordId)
        })
      } else {
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(0)
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
        return item.manualRecordId
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
