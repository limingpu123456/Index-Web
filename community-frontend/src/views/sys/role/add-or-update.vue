<template>
  <el-dialog
    :title="!dataForm.roleId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="30%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:90%;" @keyup.enter.native="dataFormSubmit()">
      <el-form-item label="角色名" prop="roleName">
        <el-input v-model="dataForm.roleName" placeholder="请输入角色名" />
      </el-form-item>
      <el-form-item label="角色类型" prop="type">
        <el-select v-model="dataForm.type" placeholder="请输入角色类型" style="width:235px;">
          <el-option v-for="t in typeList" :key="t.id" :label="t.name" :value="t.id" />
        </el-select>
      </el-form-item>
      <el-form-item label="备注" prop="remark">
        <el-input v-model="dataForm.remark" placeholder="请输入备注" />
      </el-form-item>
      <el-form-item label="授权">
        <el-form-item>
          <el-tree
            ref="tree"
            :data="menuList"
            :props="{ label: 'name', children: 'children' }"
            node-key="id"
            show-checkbox
            accordion
          />
        </el-form-item>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button type="danger" @click="visible = false">取 消</el-button>
      <el-button type="primary" @click="dataFormSubmit()">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { getInfo, add, edit } from '@/api/sys/role'
import { getDataList } from '@/api/sys/menu'

export default {
  data() {
    return {
      menuList: [],
      visible: false,
      dataForm: {
        roleId: '',
        roleName: '',
        type: '',
        remark: '',
        menuIdList: []
      },
      typeList: [
        { id: 1, name: '系统角色' },
        { id: 2, name: '单位角色' }
      ],
      dataRule: {
        roleName: [
          { required: true, message: '角色名不能为空', trigger: 'blur' }
        ],
        type: [
          { required: true, message: '角色类型不能为空', trigger: 'blur' }
        ],
        remark: [
          { required: true, message: '备注不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.roleId = id
      this.dataForm.type = ''
      this.visible = true
      this.resetForm('dataForm')
      this.$nextTick(() => {
        this.$refs.tree.setCheckedKeys([])
        Promise.all([
          this.getMenuList()
        ]).then(() => {
          if (this.dataForm.roleId) {
            this.getInfo()
          }
        })
      })
    },
    getInfo() {
      getInfo(this.dataForm.roleId).then(res => {
        if (res && res.code === 200) {
          this.dataForm = res.data
          setTimeout(() => {
            res.data.menuIdList.forEach((value) => {
              this.$refs.tree.setChecked(value, true, false)
            })
          }, 200)
        }
      })
    },
    // 获取菜单列表
    getMenuList() {
      getDataList().then(res => {
        if (res && res.code === 200) {
          this.menuList = res.data
        }
      })
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.dataForm.menuIdList = [
            ...this.$refs.tree.getCheckedKeys(),
            ...this.$refs.tree.getHalfCheckedKeys()
          ]
          const param = {
            'roleId': this.dataForm.roleId,
            'roleName': this.dataForm.roleName,
            'type': this.dataForm.type,
            'remark': this.dataForm.remark,
            'menuIdList': this.dataForm.menuIdList
          }
          if (!this.dataForm.roleId) {
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
