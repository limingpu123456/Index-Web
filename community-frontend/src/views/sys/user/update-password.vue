<template>
  <el-dialog
    :visible.sync="visible"
    title="修改密码"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
    :append-to-body="true"
    width="35%"
  >
    <el-form ref="dataForm" style="width:90%" label-width="120px" :model="dataForm" :rules="dataRule" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="账号">
        <span>{{ $store.state.user.name }}</span>
      </el-form-item>
      <el-form-item prop="password" label="原密码">
        <el-input v-model="dataForm.password" type="password" placeholder="请输入原密码" />
      </el-form-item>
      <el-form-item prop="newPassword" label="新密码">
        <el-input v-model="dataForm.newPassword" type="password" placeholder="请输入新密码" />
      </el-form-item>
      <el-form-item prop="confirmPassword" label="确认新密码">
        <el-input v-model="dataForm.confirmPassword" type="password" placeholder="请再次输入新密码" />
      </el-form-item>
    </el-form>
    <template slot="footer">
      <el-button @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </template>
  </el-dialog>
</template>

<script>
import debounce from 'lodash/debounce'
import { updatePassword } from '@/api/sys/user'

export default {
  data() {
    return {
      visible: false,
      dataForm: {
        password: '',
        newPassword: '',
        confirmPassword: ''
      }
    }
  },
  computed: {
    dataRule() {
      const validateConfirmPassword = (rule, value, callback) => {
        if (this.dataForm.newPassword !== value) {
          return callback(new Error('确认密码和新密码不一致'))
        }
        callback()
      }
      return {
        password: [
          { required: true, message: '原密码不能为空', trigger: 'change' }
        ],
        newPassword: [
          { required: true, message: '新密码不能为空', trigger: 'blur' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '确认密码不能为空', trigger: 'change' },
          { min: 6, max: 20, message: '长度在 6 到 20 个字符', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init() {
      this.visible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].resetFields()
      })
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login`)
    },
    // 表单提交
    dataFormSubmit: debounce(function() {
      this.$refs['dataForm'].validate((valid) => {
        if (!valid) {
          return false
        }
        updatePassword(this.dataForm).then(res => {
          console.log(res)
          if (res.code === 200) {
            if(res.status === 'passwordError'){
              this.$message.error('密码验证失败，无法修改')
            } else {
              this.visible = false
              this.logout()
              this.$message.success(res.msg)
            }
          } else {
            this.$message.error(res.msg)
          }
        })
      })
    }, 1000, { 'leading': true, 'trailing': false })
  }
}
</script>
