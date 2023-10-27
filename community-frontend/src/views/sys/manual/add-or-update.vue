<template>
  <el-dialog
    :title="!dataForm.manualRecordId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:95%;" @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="12">
          <el-form-item label="小区名称" prop="communityId">
            <el-select v-model="dataForm.communityId" placeholder="请选择小区" filterable style="width: 100%">
              <el-option v-for="park in communityList" :key="park.communityId" :label="park.communityName" :value="park.communityId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="访客姓名" prop="visitor">
            <el-input v-model="dataForm.visitor" placeholder="请输入访客姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="请输入手机号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="身份证号" prop="cardNo">
            <el-input v-model="dataForm.cardNo" placeholder="请输入身份证号码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="进入时间" prop="inTime">
            <el-date-picker v-model="dataForm.inTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd  HH:mm:ss" placeholder="请选择进入时间" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="受访者姓名" prop="interviewee">
            <el-input v-model="dataForm.interviewee" placeholder="请输入受访者姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="所在楼栋" prop="termName">
            <el-input v-model="dataForm.termName" placeholder="请输入所在楼栋" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="房号" prop="houseNo">
            <el-input v-model="dataForm.houseNo" placeholder="请输入房号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="离开时间" prop="outTime">
            <el-date-picker v-model="dataForm.outTime" type="datetime" value-format="yyyy-MM-dd HH:mm:ss" format="yyyy-MM-dd  HH:mm:ss" placeholder="请选择离开时间" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="访问事由" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="请输入访问事由" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="closeDialog">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getInfo, add, edit, getCommunityList } from '@/api/sys/manual'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        manualRecordId: '',
        communityId: '',
        visitor: '',
        mobile: '',
        cardNo: '',
        termName: '',
        houseNo: '',
        interviewee: '',
        inTime: '',
        outTime: '',
        userName: '',
        signTime: '',
        remark: ''
      },
      imgSrc: '',
      communityList: [],
      dataRule: {
        visitor: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ]
      },
      video: null,
      context: null,
      canvas: null,
      openSuccess: true
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    init(id) {
      this.dataForm.personId = id
      this.visible = true
      this.resetForm('dataForm')
      getInfo(id).then(res => {
        if (res && res.code === 200) {
          this.agentList = res.data.agentList
          this.communityList = res.data.communityList
          if (id > 0) {
            this.dataForm.manualRecordId = res.data.manualInfo.manualRecordId
            this.dataForm.communityId = res.data.manualInfo.communityId
            this.dataForm.visitor = res.data.manualInfo.visitor
            this.dataForm.cardNo = res.data.manualInfo.cardNo
            this.dataForm.mobile = res.data.manualInfo.mobile
            this.dataForm.termName = res.data.manualInfo.termName
            this.dataForm.houseNo = res.data.manualInfo.houseNo
            this.dataForm.interviewee = res.data.manualInfo.interviewee
            this.dataForm.userName = res.data.manualInfo.userName
            this.dataForm.remark = res.data.manualInfo.remark
            this.dataForm.signTime = res.data.manualInfo.signTime
            this.dataForm.inTime = res.data.manualInfo.inTime
            this.dataForm.outTime = res.data.manualInfo.outTime
          } else {
            this.dataForm.communityId = this.communityList[0].communityId
          }
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      if (this.dataForm.communityId === '') {
        alert('请选择小区')
        return
      }
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            'manualRecordId': this.dataForm.manualRecordId,
            'communityId': this.dataForm.communityId,
            'visitor': this.dataForm.visitor,
            'cardNo': this.dataForm.cardNo,
            'mobile': this.dataForm.mobile,
            'termName': this.dataForm.termName,
            'houseNo': this.dataForm.houseNo,
            'interviewee': this.dataForm.interviewee,
            'inTime': this.dataForm.inTime,
            'outTime': this.dataForm.outTime,
            'userName': this.dataForm.userName,
            'signTime': this.dataForm.signTime,
            'remark': this.dataForm.remark
          }
          if (!this.dataForm.personId) {
            add(param).then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            edit(param).then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
            })
          }
        }
      })
    },
    getcommunityList() {
      getCommunityList().then(res => {
        if (res.code === 200) {
          this.dataForm.communityId = ''
          this.communityList = res.data
          this.dataForm.communityId = this.communityList[0].communityId
        } else {
          this.$message.error(res.msg)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 关闭弹出层
    closeDialog() {
      this.visible = false
    }
  }
}
</script>
<style>
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 178px;
    height: 178px;
    line-height: 178px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
