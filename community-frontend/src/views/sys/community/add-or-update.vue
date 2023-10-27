<template>
  <el-dialog
    :title="!dataForm.communityId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="50%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:95%;" @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="24">
          <el-form-item label="小区名称" prop="communityName">
            <el-input v-model="dataForm.communityName" placeholder="请输入小区名称" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="楼栋数量" prop="termCount">
            <el-input v-model="dataForm.termCount" placeholder="请输入楼栋数量" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="经度" prop="lng">
            <el-input v-model="dataForm.lng" placeholder="请输入经度" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="纬度" prop="lat">
            <el-input v-model="dataForm.lat" placeholder="请输入维度" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="排序" prop="seq">
            <el-input v-model="dataForm.seq" placeholder="请输入排序" />
          </el-form-item>
        </el-col>
      </el-row>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>
<script>
import { getInfo, add, edit } from '@/api/sys/community'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        communityId: '',
        communityName: '',
        termCount: '',
        lng: '',
        lat: '',
        seq: '1'
      },
      dataRule: {
        communityName: [
          { required: true, message: '小区名称不能为空', trigger: 'blur' }
        ],
        seq: [
          { required: true, message: '排序不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.communityId = id
      this.visible = true
      this.resetForm('dataForm')
      this.dataForm.seq = 1
      if (this.dataForm.communityId) {
        getInfo(id).then(res => {
          if (res && res.code === 200) {
            this.dataForm.communityId = res.data.communityId
            this.dataForm.communityName = res.data.communityName
            this.dataForm.termCount = res.data.termCount
            this.dataForm.lng = res.data.lng
            this.dataForm.lat = res.data.lat
            this.dataForm.seq = res.data.seq
          }
        })
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            'communityId': this.dataForm.communityId,
            'communityName': this.dataForm.communityName,
            'termCount': this.dataForm.termCount,
            'lng': this.dataForm.lng,
            'lat': this.dataForm.lat,
            'seq': this.dataForm.seq
          }
          if (!this.dataForm.communityId) {
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
