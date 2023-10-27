<template>
  <el-dialog
    :title="'上传住户资料'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
  >
    <el-form label-width="100px" style="width:95%;" @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="24">
          <el-form-item label="导入住户资料">
            <el-upload
              class="avatar-uploader"
              :headers="headers"
              :action="uploadUrl"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              name="uploadExcel"
              :before-upload="beforeAvatarUpload">
              <i class="el-icon-plus avatar-uploader-icon"></i>
            </el-upload>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="模板下载">
            <a href="http://localhost/dev-api/community/upload/excel/personInfo.xls">点击下载Excel模板</a>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <span style="color:red" v-html="errorInfo" />
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { parsefile } from '@/api/sys/person'
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      uploadUrl: process.env.VUE_APP_BASE_API + '/sys/person/excelUpload/',
      headers: {
        token: getToken()
      },
      visible: false,
      agentId: '',
      errorInfo: ''
    }
  },
  watch: {
    visible(val) {
      this.errorInfo = ''
    }
  },
  created() {
  },
  methods: {
    init() {
      this.visible = true
    },
    // logo上传
    beforeAvatarUpload(file) {
      this.errorInfo = ''
      const ext = file.name.substring(file.name.lastIndexOf('.') + 1).toLowerCase()
      const imgSize = file.size / 1024 / 1024 < 10
      if (ext !== 'xls') {
        this.$message.error('文件格式只能为xls文件')
        return
      }
      if (!imgSize) {
        this.$message.error('文件大小不能超过10M')
        return
      }
      return imgSize
    },

    handleAvatarSuccess(data) {
      if (data && data.code === 200) {
        parsefile(data.data).then(res => {
          console.log(data.data)
          console.log(res)
          if (res && res.code === 200) {
            if(res.status === 'success'){
              this.errorInfo = res.data
              this.$message.success('上传成功')
            }
            if(res.status === 'fail'){
              this.errorInfo = res.data
              this.$message.error('上传失败')
            }
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit() {
      // this.$emit.listQuery.testId = this.testId
      this.$emit('refreshDataList')
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
    width: 80px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
