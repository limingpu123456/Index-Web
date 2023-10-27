<template>
  <el-dialog
    :title="'采集人脸相片'"
    :close-on-click-modal="false"
    :visible.sync="visible"
    width="1100px"
  >
    <el-form ref="dataForm" :model="dataForm" label-width="100px" style="width:95%;">
      <el-row>
        <el-col :span="9">
          <el-form-item label="" style="margin: 0;">
            <video v-if="openSuccess" id="videoCamera" autoplay width="260" height="200" style="border: none;" />
          </el-form-item>
        </el-col>
        <el-col :span="3" style="height: 200px;display: flex; justify-content: center;align-items: center;flex-wrap: wrap;">
          <el-button v-if="openSuccess" size="small" type="primary" style="width: 80px; text-align: center;" @click="setImage()">拍照</el-button>
          <el-upload
            class="upload-demo"
            action="#"
            :show-file-list="false"
            :http-request="fileUpload"
          >
            <el-button size="small" type="primary">上传人脸</el-button>
          </el-upload>
        </el-col>
        <el-col :span="8" style="display: flex; justify-content: center; align-items: center;">
          <canvas id="canvasCamera" style="display:none;" width="640" height="480" />
          <img v-if="imgSrc" :src="imgSrc" alt height="200">
        </el-col>
      </el-row>
      <hr>
      <el-row>
        <el-col :span="12">
          <el-card>
            <div class="text item">
              <b><font color="red">常见问题:</font></b><br><br>
              1、不支持IE浏览器，建议使用火狐、谷歌、Edge浏览器进行考试<br><br>
              2、若浏览器弹出是否允许调用摄像头，请点击允许<br><br>
              3、<font color="red">必须使用https加密协议，摄像头方能正常使用</font><br><br>
              4、如果问题还存在，请按<a
                href="https://examai.cn/pc/zhinan.pdf"
                target="_blank"
              ><font color="red"><b>启用摄像头操作指南</b></font></a>进行操作><br><br>
              5、本模块仅供测试接口，具体使用请以实际情况为准
            </div>
          </el-card>
        </el-col>
        <el-col :span="12">
          <img src="@/assets/images/cm.png" width="100%">
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>
<script>
import { addPerson } from '@/api/sys/person'
export default {
  data() {
    return {
      visible: false,
      dataForm: {
        personId: '',
        extName: '',
        fileBase64: ''
      },
      imgSrc: '',
      video: null,
      context: null,
      canvas: null,
      openSuccess: true
    }
  },
  watch: {
    visible(val) {
      if (val) {
        this.imgSrc = ''
        setTimeout(() => {
          this.getCamera()
        }, 1000)
      } else {
        if (this.openSuccess) {
          this.closeCamera()
        }
      }
    }
  },
  created() {
    setTimeout(() => {
      this.getCamera()
    }, 1000)
    this.init()
  },
  methods: {
    init(personId) {
      this.visible = true
      this.dataForm.personId = personId
    },
    // 表单提交
    dataFormSubmit() {
      const _this = this
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const param = {
            'personId': this.dataForm.personId,
            'extName': this.dataForm.extName,
            'fileBase64': this.dataForm.fileBase64
          }
          addPerson(param).then(res => {
            if (res.code === 200) {
              _this.visible = false
              _this.$emit('refreshDataList')
              _this.$message.success(res.msg)
            } else {
              _this.$message.error(res.msg)
            }
          })
        }
      })
    },
    // 打开摄像头
    getCamera() {
      this.video = document.getElementById('videoCamera')
      this.canvas = document.getElementById('canvasCamera')
      this.context = this.canvas.getContext('2d')
      const errocb = () => {
        this.$message.error('摄像头打开失败！')
        this.openSuccess = false
      }
      if (navigator.webkitGetUserMedia) {
        navigator.webkitGetUserMedia({ audio: false, video: true }, (stream) => {
          // video.src=window.URL.createObjectURL(stream);
          this.video.srcObject = stream
          this.video.play()
        }, errocb)
      } else if (navigator.mediaDevices.getUserMedia) {
        // var constraints = { audio: true, video: { width: 1280, height: 720 } };
        const constraints = { audio: false, video: true }
        navigator.mediaDevices.getUserMedia(constraints).then((stream) => {
          // var video = document.querySelector('video');
          this.video.srcObject = stream
          this.video.onloadedmetadata = (e) => {
            this.video.play()
          }
        })
      } else if (navigator.getUserMedia) {
        navigator.getUserMedia({ audio: false, video: true }, (stream) => {
          this.video.src = window.webkitURL.createObjectURL(stream)
          this.video.srcObject = stream
          this.video.play()
        }, errocb)
      } else {
        alert('你的浏览器不支持打开摄像头')
      }
    },
    //  绘制图片（拍照功能）
    setImage() {
      this.context.drawImage(
        this.video,
        0,
        0,
        this.video.videoWidth,
        this.video.videoHeight
      )
      this.imgSrc = this.canvas.toDataURL('image/png')
      this.dataForm.extName = this.imgSrc.substring(this.imgSrc.indexOf('/') + 1, this.imgSrc.indexOf(';'))
      this.dataForm.fileBase64 = this.imgSrc.substring(22)
      this.dataFormSubmit()
    },
    // 关闭摄像头
    closeCamera() {
      this.video.srcObject.getTracks()[0].stop()
    },
    // 关闭弹出层
    closeDialog() {
      this.visible = false
    },
    // 重写文件上传方法
    fileUpload(file) {
      this.fileToBase64(file.file).then(res => {
        // console.log(res)
        this.imgSrc = res
        this.dataForm.extName = res.substring(res.indexOf('/') + 1, res.indexOf(';'))
        const len = 19 + this.dataForm.extName.length
        this.dataForm.fileBase64 = res.substring(len)
        // console.log(this.dataForm.fileBase64)
        this.dataFormSubmit()
      }).catch(err => {
        console.log(err)
        this.$message.error(err)
      })
    },
    // 转base64
    fileToBase64(file) {
      return new Promise((resolve, reject) => {
        const reader = new FileReader()
        let fileResult = ''
        if (file.size > 1024 * 1024) {
          reject('文件大小不能超过1M')
        }
        reader.readAsDataURL(file)
        // 开始转
        reader.onload = () => {
          fileResult = reader.result
          // data:image/jpeg;base64,
        }
        // 转 失败
        reader.onerror = function(error) {
          reject(error)
        }
        // 转 结束  咱就 resolve 出去
        reader.onloadend = function() {
          resolve(fileResult)
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
