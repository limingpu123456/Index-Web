<template>
  <div class="login-container">
    <el-row>
      <el-col :xs="14" :sm="14" :md="14" :lg="24" :xl="24">
        <el-form  style="position: relative;left: -375px;" ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" autocomplete="on" label-position="left">
          <div class="title-container">
            <h3 class="title">智慧社区物业管理平台</h3>
          </div>
          <el-form-item prop="username">
            <el-input
              ref="username"
              v-model="loginForm.username"
              placeholder="请输入用户名"
              prefix-icon="el-icon-user"
              name="username"
              type="text"
              size="default"
            />
          </el-form-item>
          <el-form-item prop="password">
            <el-input
              ref="password"
              v-model="loginForm.password"
              placeholder="请输入密码"
              prefix-icon="el-icon-lock"
              name="password"
              type="password"
              show-password
              size="default"
            />
          </el-form-item>
          <el-form-item prop="captcha">
            <el-input
              ref="captcha"
              v-model="loginForm.captcha"
              placeholder="请输入验证码"
              prefix-icon="el-icon-circle-check"
              name="captcha"
              style="width: 65%"
              size="default"
              @keyup.enter.native="handleLogin"
            />
            <el-image
              class="captcha-img"
              :src="captchaPath"
              @click="getCaptcha()"
            />
          </el-form-item>
          <el-button :loading="loading" type="primary" class="login-btn" @click.native.prevent="handleLogin">
            <span v-if="!loading">登 录</span>
            <span v-else>登录中...</span>
          </el-button>
        </el-form>
      </el-col>
    </el-row>
    <div class="el-login-footer" style="position: relative;top:183px">
      <span>Copyright © 2023-2033 All Rights Reserved.</span>
    </div>
  </div>
</template>

<script>
import { getCaptchaImg } from '@/api/sys/login'
export default {
  name: 'Login',
  data() {
    return {
      captchaPath: '',
      loginForm: {
        username: '',
        password: '',
        captcha: '',
        uuid: ''
      },
      loginRules: {
        username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }],
        captcha: [{ required: true, message: '请输入验证码', trigger: 'blur' }]
      },
      loading: false,
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  created() {
    this.getCaptcha()
  },
  mounted() {
    if (process.env.NODE_ENV === 'development') {
      this.loginForm.username = 'admin'
      this.loginForm.password = '123456'
    }
  },
  methods: {
    // 获取验证码
    getCaptcha() {
      getCaptchaImg().then(res => {
        this.captchaPath = res.data.captcha
        this.loginForm.uuid = res.data.uuid
        if (process.env.NODE_ENV === 'development') {
          this.loginForm.captcha = res.data.code
        }
      })
    },
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true
          this.$store.dispatch('user/login', this.loginForm)
            .then(() => {
              this.$router.push({ path: this.redirect || '/' })
            })
            .catch(() => {
              this.getCaptcha()
              this.loading = false
            })
        } else {
          return false
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>

.login-container {
  min-height: 102%;
  width: 100%;
  background: url(~@/assets/images/login3.jpg) no-repeat center fixed;
  background-size: cover;
  overflow: hidden;

  .login-form {
    padding: 30px;
    background: #ffffff;
    position: relative;
    width: 390px;
    max-width: 100%;
    margin: 10% 0px 0px 62%;
    overflow: hidden;
    border-radius: 5px;
  }

  .title-container {
    position: relative;
    .title {
      font-size: 26px;
      color: #208be6;
      margin: 0px auto 30px auto;
      text-align: center;
      font-weight: bold;
    }
  }
  .captcha-img {
    width: 100px;
    height: 40px;
    margin-left: 8px;
    position: absolute;
    cursor: pointer;
  }
  .login-btn {
    height: 45px;
    width: 100%;
    font-size: 16px;
    margin: 20px 0px 10px 0px;
  }
  .el-login-footer {
    height: 50px;
    line-height: 50px;
    position: fixed;
    width: 100%;
    text-align: center;
    color: #fff;
    font-size: 14px;
  }
}
</style>
