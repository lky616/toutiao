<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>个人设置</my-bread>
      </div>
      <!-- 栅格 -->
      <el-row>
        <el-col :span="12">
          <el-form label-width="120px">
            <el-form-item label="编号 : ">111</el-form-item>
            <el-form-item label="手机 : ">13200000000</el-form-item>
            <el-form-item label="媒体名称 : ">
              <el-input v-model="userForm.name"></el-input>
            </el-form-item>
            <el-form-item label="媒体介绍 : ">
              <el-input v-model="userForm.intro" type="textarea" :row="3"></el-input>
            </el-form-item>
            <el-form-item label="邮箱 : ">
              <el-input v-model="userForm.email"></el-input>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="saveUserInfo">保存设置</el-button>
            </el-form-item>
          </el-form>
        </el-col>
        <el-col :span="12">
          <!-- 上传头像 -->
          <el-upload
            class="avatar-uploader"
            action=""
            :show-file-list="false"
            :http-request="myUpload"
          >
            <img v-if="userForm.photo" :src="userForm.photo" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <p style="text-align:center; font-size:14px">修改头像</p>
        </el-col>
      </el-row>
    </el-card>
  </div>
</template>
<script>
import store from '@/store'
import eventBus from '@/components/eventBus'
export default {
  data () {
    return {
      userForm: {
        id: null,
        name: null,
        intro: null,
        email: null,
        photo: null,
        mobile: null
      },
      imageUrl: null
    }
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    // 获取用户信息
    async getUserInfo () {
      // 后台的头像可能和前端本地保存头像不一致， 保存后进行过修改 重新登录可同步
      const { data: { data } } = await this.$https.get('user/profile')
      this.userForm = data
    },
    async saveUserInfo () {
      // patch 请求类型做修改 局部修改
      // put 请求类型做修改 完整修改
      await this.$https.patch('user/profile', {
        name: this.userForm.name,
        intro: this.userForm.intro,
        email: this.userForm.email
      })
      this.$message.success('保存设置成功')
      // 当刷新页面的时候 HOME组件使用的本地存储的数据 更新本地存储
      store.setUser({ name: this.userForm.name })
      // 更新HOME组件用户名
      eventBus.$emit('updateName', this.userForm.name)
    },
    // 图片上传
    myUpload (result) {
      // 选中图片后 触发函数 选择的结果result
      // 文件信息获取 result.file
      // axios+formdate 进行上传
      const formData = new FormData()
      formData.append('photo', result.file)
      this.$https.patch('user/photo', formData).then(res => {
        // 上传头像成功
        this.$message.success('修改头像成功')
        // 预览
        this.userForm.photo = res.data.data.photo
        // 同步本地存储
        store.setUser({ photo: this.userForm.photo })
        // 同步HOME组件
        eventBus.$emit('updatePhoto', this.userForm.photo)
      })
    }
  }
}
</script>

<style lang="less" scoped></style>
