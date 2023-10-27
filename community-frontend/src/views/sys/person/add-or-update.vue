<template>
  <el-dialog
    :title="!dataForm.personId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="30%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:95%;" @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="24">
          <el-form-item label="小区名称" prop="communityId">
            <el-select v-model="dataForm.communityId" placeholder="请选择小区" filterable style="width: 100%">
              <el-option v-for="park in communityList" :key="park.communityId" :label="park.communityName" :value="park.communityId" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="所在楼栋" prop="termName">
            <el-input v-model="dataForm.termName" placeholder="请输入所在楼栋" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="居住房号" prop="houseNo">
            <el-input v-model="dataForm.houseNo" placeholder="请输入房号" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="住户姓名" prop="userName">
            <el-input v-model="dataForm.userName" placeholder="请输入住户姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="手机号码" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="请输入手机号码" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="性别" prop="sex">
            <el-radio-group v-model="dataForm.sex">
              <el-radio :label="'男'">男</el-radio>
              <el-radio :label="'女'">女</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="居住性质" prop="personType">
            <el-select v-model="dataForm.personType" placeholder="请选择居住性质" style="width: 100%">
              <el-option v-for="item in personTypeList" :key="item" :value="item" :label="item" />
            </el-select>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="备注" prop="remark">
            <el-input v-model="dataForm.remark" placeholder="请输入备注" />
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
import { getInfo, add, edit, getCommunityList } from '@/api/sys/person'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        personId: '',
        communityId: '',
        termName: '',
        houseNo: '',
        userName: '',
        sex: '男',
        mobile: '',
        state: 1,
        remark: '',
        faceUrl: '',
        personType: '常住居民'
      },
      personTypeList: [
        '常住居民',
        '企业员工',
        '租户'
      ],
      imgSrc: '',
      communityList: [],
      dataRule: {
        termName: [
          { required: true, message: '所在楼栋不能为空', trigger: 'blur' }
        ],
        houseNo: [
          { required: true, message: '房号不能为空', trigger: 'blur' }
        ],
        userName: [
          { required: true, message: '姓名不能为空', trigger: 'blur' }
        ],
        mobile: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' }
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
      this.dataForm.faceUrl = ""
      this.dataForm.state = 1
      getInfo(id).then(res => {
        if (res && res.code === 200) {
          this.communityList = res.data.communityList
          if (id > 0) {
            this.dataForm.personId = res.data.person.personId
            this.dataForm.communityId = res.data.person.communityId
            this.dataForm.termName = res.data.person.termName
            this.dataForm.houseNo = res.data.person.houseNo
            this.dataForm.userName = res.data.person.userName
            this.dataForm.sex = res.data.person.sex
            this.dataForm.mobile = res.data.person.mobile
            this.dataForm.personType = res.data.person.personType
            this.dataForm.state = res.data.person.state
            this.dataForm.remark = res.data.person.remark
            this.dataForm.faceUrl = res.data.person.faceUrl
          } else {
            this.dataForm.communityId = this.communityList[0].communityId
            this.dataForm.personType = this.personTypeList[0]
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
            'personId': this.dataForm.personId,
            'communityId': this.dataForm.communityId,
            'termName': this.dataForm.termName,
            'houseNo': this.dataForm.houseNo,
            'userName': this.dataForm.userName,
            'mobile': this.dataForm.mobile,
            'sex': this.dataForm.sex,
            'personType': this.dataForm.personType,
            'faceUrl': this.dataForm.faceUrl,
            'state': this.dataForm.state,
            'remark': this.dataForm.remark
          }
          if (!this.dataForm.personId) {
            console.log(param)
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
      this.dataForm.communityId = ''
      getCommunityList().then(res => {
        if (res.code === 200) {
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
