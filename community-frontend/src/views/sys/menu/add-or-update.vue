<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="60%"
  >
    <el-form ref="dataForm" :model="dataForm" :rules="dataRule" label-width="100px" style="width:90%;" @keyup.enter.native="dataFormSubmit()">
      <el-row>
        <el-col :span="24">
          <el-form-item label="上级菜单" prop="parentId">
            <treeselect
              v-model="dataForm.parentId"
              :options="menuOptions"
              :normalizer="normalizer"
              :show-count="true"
              placeholder="选择上级菜单"
            />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单名称" prop="name">
            <el-input v-model="dataForm.name" placeholder="请输入菜单名称" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="路由地址" prop="path">
            <el-input v-model="dataForm.path" placeholder="请输入路由地址" />
            <i class="el-icon-warning-outline"> 例如：user</i>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="菜单图标" prop="icon">
            <el-input v-model="dataForm.icon" placeholder="请选择图标" />
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="排序" prop="sort">
            <el-input-number v-model="dataForm.sort" :min="1" :max="1000" />
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-form-item label="组件路径" prop="component">
            <el-input v-model="dataForm.component" placeholder="请输入组件路径" />
            <i class="el-icon-warning-outline"> 例如：sys/user/index</i>
          </el-form-item>
        </el-col>
        <el-col :span="24">
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="dataForm.status">
                <el-radio :label="1">正常</el-radio>
                <el-radio :label="0">禁用</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="隐藏">
              <el-radio-group v-model="dataForm.hidden">
                <el-radio :label="'true'">隐藏</el-radio>
                <el-radio :label="'false'">显示</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
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

import { getDataList, add, edit, getInfo } from '@/api/sys/menu'
import Treeselect from '@riophae/vue-treeselect'
import '@riophae/vue-treeselect/dist/vue-treeselect.css'

export default {
  components: { Treeselect },
  data() {
    return {
      visible: false,
      menuOptions: [],
      dataForm: {
        id: '',
        name: '',
        parentId: undefined,
        component: '',
        icon: '',
        path: '',
        sort: 10,
        status: 1,
        menuType: 1,
        hidden: 'false'
      },
      dataRule: {
        parentId: [
          { required: true, message: '上级菜单不能为空', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '菜单名称不能为空', trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    init(id) {
      this.dataForm.id = id
      this.visible = true
      this.resetForm('dataForm')
      this.getTreeData()
      if (this.dataForm.id) {
        getInfo(id).then(res => {
          if (res && res.code === 200) {
            this.dataForm.id = res.data.id
            this.dataForm.name = res.data.name
            this.dataForm.icon = res.data.icon
            this.dataForm.menuType = 1
            this.dataForm.component = res.data.component
            this.dataForm.parentId = res.data.parentId
            this.dataForm.path = res.data.path
            this.dataForm.sort = res.data.sort
            this.dataForm.status = res.data.status
            this.dataForm.hidden = res.data.hidden
          }
        })
      }
    },
    getTreeData() {
      getDataList().then(res => {
        this.menuOptions = []
        const tree = { id: 0, name: '主目录', children: [] }
        tree.children = this.handleTree(res.data, 'id')
        this.menuOptions.push(tree)
      })
    },
    // 转换数据结构
    normalizer(node) {
      if (node.children && !node.children.length) {
        delete node.children
      }
      return {
        id: node.id,
        label: node.name,
        children: node.children
      }
    },
    // 表单提交
    dataFormSubmit() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          if (!this.dataForm.id) {
            add(this.dataForm).then(res => {
              if (res.code === 200) {
                this.visible = false
                this.$emit('refreshDataList')
                this.$message.success(res.msg)
              } else {
                this.$message.error(res.msg)
              }
            })
          } else {
            edit(this.dataForm).then(res => {
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
