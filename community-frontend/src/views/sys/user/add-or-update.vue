<template>
  <el-dialog
    :title="!dataForm.userId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="40%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:95%;" @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="24">
          <el-form-item label="账号" prop="username">
            <el-input v-model="dataForm.username" :disabled="dataForm.userId>0" placeholder="请输入帐号" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="密码" prop="password" :class="{ 'is-required': !dataForm.userId }">
            <el-input v-model="dataForm.password" type="password" placeholder="请输入密码" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="确认密码" prop="confirmPassword" :class="{ 'is-required': !dataForm.userId }">
            <el-input v-model="dataForm.confirmPassword" type="password" placeholder="确认密码" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="真实姓名" prop="realName">
            <el-input v-model="dataForm.realName" placeholder="请输入真实姓名" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="联系人" prop="contact">
            <el-input v-model="dataForm.contact" placeholder="请输入联系人" />
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="手机号" prop="mobile">
            <el-input v-model="dataForm.mobile" placeholder="请输入手机号" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="状态" prop="status">
            <el-radio-group v-model="dataForm.status">
              <el-radio :label="1">正常</el-radio>
              <el-radio :label="0">禁用</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="角色" prop="roleId">
            <el-select v-model="dataForm.roleId" filterable placeholder="请选择角色" style="width: 100%">
              <el-option
                v-for="role in roleList"
                :key="role.roleId"
                :label="role.roleName"
                :value="role.roleId" />
            </el-select>
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
// import { isMobile } from '@/utils/validate'
import { getUserInfo, add, edit } from '@/api/sys/user'
import { getRoleList } from '@/api/sys/role'
export default {
  data() {
    const validatePassword = (rule, value, callback) => {
      if (!this.dataForm.userId && !/\S/.test(value)) {
        callback(new Error('密码不能为空'))
      } else {
        callback()
      }
    }
    const validateConfirmPassword = (rule, value, callback) => {
      if (!this.dataForm.userId && !/\S/.test(value)) {
        callback(new Error('确认密码不能为空'))
      } else if (this.dataForm.password !== value) {
        callback(new Error('确认密码与密码输入不一致'))
      } else {
        callback()
      }
    }
    // const validateMobile = (rule, value, callback) => {
    //   if (!isMobile(value)) {
    //     callback(new Error('手机号格式错误'))
    //   } else {
    //     callback()
    //   }
    // }
    return {
      visible: false,
      roleList: [],
      deptOptions: [],
      dataForm: {
        userId: '',
        username: '',
        password: '',
        realName: '',
        confirmPassword: '',
        mobile: '',
        roleId: '',
        status: 1,
        contact: '',
      },
      dataRule: {
        username: [
          { required: true, message: '用户名不能为空', trigger: 'blur' },
          { min: 3, max: 20, message: '账号长度在 3 到 20 个字符', trigger: 'blur' }
        ],
        password: [
          { validator: validatePassword, trigger: 'blur' }
        ],
        confirmPassword: [
          { validator: validateConfirmPassword, trigger: 'blur' }
        ],
        realName: [
          { required: true, message: '真实姓名不能为空', trigger: 'blur' }
        ],
        roleId: [
          { required: true, message: '请选择用户角色', trigger: 'change' }
        ]
      }
    }
  },
  created() {
    this.getRoleList()
  },
  methods: {
    init(id) {
      this.dataForm.userId = id
      this.visible = true
      this.resetForm('dataForm')
      this.dataForm.username = ''
      this.dataForm.realName = ''
      this.dataForm.mobile = ''
      this.dataForm.roleId = ''
      this.dataForm.status = 1
      if (this.dataForm.userId) {
        getUserInfo(id).then(res => {
          if (res && res.code === 200) {
            this.dataForm.userId = res.data.userId
            this.dataForm.username = res.data.username
            this.dataForm.realName = res.data.realName
            this.dataForm.mobile = res.data.mobile
            this.dataForm.roleId = res.data.roleId
            this.dataForm.status = res.data.status
            this.dataForm.contact = res.data.contact
          }
        })
      }
    },
    // 获取角色列表
    getRoleList() {
      getRoleList().then(res => {
        this.roleList = res.data && res.code === 200 ? res.data : []
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            'userId': this.dataForm.userId,
            'username': this.dataForm.username,
            'password': this.dataForm.password,
            'realName': this.dataForm.realName,
            'mobile': this.dataForm.mobile,
            'status': this.dataForm.status,
            'roleId': this.dataForm.roleId,
            'contact': this.dataForm.contact
          }
          if (!this.dataForm.userId) {
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
    }
  }
}
</script>
