<template>
  <div class="navbar">
    <hamburger id="hamburger-container" :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <breadcrumb id="breadcrumb-container" class="breadcrumb-container" />

    <div class="right-menu">
      <screenfull id="screenfull" class="right-menu-item hover-effect" />
      <div class="right-menu">
        <div class="right-menu-item">
          <span class="el-link">您好</span>
        </div>
        <div class="right-menu-item">
          <el-link type="primary">{{ name }}</el-link>
        </div>
        <div class="right-menu-item">
          <el-link type="primary" @click="updatePassword()">修改密码</el-link>
        </div>

        <div class="right-menu-item">
          <el-link type="danger" @click="logout()">安全退出</el-link>
        </div>
      </div>
    </div>
    <updatePassword v-if="updatePasswordVisiable" ref="updatePassword" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import UpdatePassword from '../../views/sys/user/update-password'
import { cleanCache } from '@/api/sys/index'
import Screenfull from '@/components/Screenfull'

export default {
  components: {
    Screenfull,
    Breadcrumb,
    Hamburger,
    UpdatePassword
  },
  data() {
    return {
      updatePasswordVisiable: false,
      username: ''
    }
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar',
      'device',
      'name'
    ])
  },
  methods: {
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      this.$confirm('是否确认退出系统？', '提示', {
        confirmButtonText: '退出',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(async() => {
        await this.$store.dispatch('user/logout')
        this.$router.push(`/login`)
        this.$message.success('退出成功')
      }).catch(() => {
        this.$message.info('取消退出')
      })
    },
    clean() {
      this.$confirm('确定要清除系统缓存吗, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.cleanHandle()
      }).catch(() => {
      })
    },
    cleanHandle() {
      cleanCache().then(res => {
        if (res.code === 200) {
          this.$message.success(res.msg)
          this.logout()
        } else {
          this.$message.error(res.msg)
        }
      })
    },
    updatePassword() {
      this.updatePasswordVisiable = true
      this.$nextTick(() => {
        this.$refs.updatePassword.init()
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background .3s;

        &:hover {
          background: rgba(0, 0, 0, .025)
        }
      }
    }

    .avatar-container {
      margin-right: 30px;

      .avatar-wrapper {
        margin-top: 5px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
