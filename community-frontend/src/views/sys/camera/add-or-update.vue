<template>
  <el-dialog
    :title="!dataForm.cameraInfoId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:95%;" @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="24">
          <el-form-item label="摄像头名称" prop="cameraName">
            <el-input v-model="dataForm.cameraName" placeholder="请输入摄像头名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="IP地址" prop="macID">
            <el-input v-model="dataForm.macID" placeholder="请输入IP地址（必须唯一）" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="方向" prop="direction">
            <el-radio-group v-model="dataForm.direction">
              <el-radio :label="1">进场</el-radio>
              <el-radio :label="2">出场</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="状态" prop="state">
            <el-radio-group v-model="dataForm.state">
              <el-radio :label="1">启用</el-radio>
              <el-radio :label="2">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序" prop="seq">
            <el-input v-model="dataForm.seq" placeholder="请输入排序号" />
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
      <el-button type="danger" @click="visible=false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getInfo, add, edit } from '@/api/sys/camera'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        cameraInfoId: '',
        communityId: '',
        cameraName: '',
        macID: '',
        direction: '1',
        seq: '1',
        state: 1,
        remark: ''
      },
      dataRule: {
        macID: [
          { required: true, message: 'IP地址不能为空且唯一', trigger: 'blur' }
        ],
        cameraName: [
          { required: true, message: '摄像头名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  watch: {
  },
  created() {
  },
  methods: {
    init(communityId, id) {
      this.dataForm.communityId = communityId
      this.dataForm.cameraInfoId = id
      this.dataForm.direction = 1
      this.dataForm.state = 1
      this.dataForm.seq = 1
      this.visible = true
      this.resetForm('dataForm')
      if (id > 0) {
        getInfo(id).then(res => {
          if (res && res.code === 200) {
              this.dataForm.cameraInfoId = res.data.cameraInfoId
              this.dataForm.communityId = res.data.communityId
              this.dataForm.cameraName = res.data.cameraName
              this.dataForm.macID = res.data.macID
              this.dataForm.direction = res.data.direction
              this.dataForm.state = res.data.state
              this.dataForm.seq = res.data.seq
              this.dataForm.remark = res.data.remark
            }
        })
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            'cameraInfoId': this.dataForm.cameraInfoId,
            'communityId': this.dataForm.communityId,
            'cameraName': this.dataForm.cameraName,
            'macID': this.dataForm.macID,
            'direction': this.dataForm.direction,
            'seq': this.dataForm.seq,
            'state': this.dataForm.state,
            'remark': this.dataForm.remark
          }
          if (!this.dataForm.cameraInfoId) {
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
