<template>
  <div class="my-image">
    <!-- 图片按扭 -->
    <div class="img-btn">
      <img :src="value||defaultImage " @click="openDialog()" alt />
    </div>
    <!-- 对话框 -->
    <el-dialog :visible.sync="dialogVisible" width="750px">
      <el-tabs type="card" v-model="activeName">
        <el-tab-pane label="素材库" name="image">
          <el-radio-group v-model="reqParams.collect" @change="collectChange" size="mini">
            <el-radio-button :label="false">全部</el-radio-button>
            <el-radio-button :label="true">收藏</el-radio-button>
          </el-radio-group>
          <div class="img-list">
            <div
              class="img-item"
              :class="{selected:selectedImageUrl === item.url}"
              @click="selectedImage(item.url)"
              v-for="item in images"
              :key="item.id"
            >
              <img :src="item.url" alt />
            </div>
          </div>
          <el-pagination
            v-if="total>reqParams.per_page"
            background
            layout="prev, pager, next"
            :total="total"
            :page-size="reqParams.per_page"
            :current-page="reqParams.page"
            @current-change="changePager"
          ></el-pagination>
        </el-tab-pane>
        <el-tab-pane label="上传图片" name="upload">
          <el-upload
            class="avatar-uploader"
            action="http://ttapi.research.itcast.cn/mp/v1_0/user/images"
            :show-file-list="false"
            :on-success="handleSuccess"
            :headers="uploadHeaders"
            name="image"
          >
            <img v-if="uploadImageUrl" :src="uploadImageUrl" class="avatar" />
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
        </el-tab-pane>
      </el-tabs>
      <span slot="footer" class="dialog-footer" style="text-align: center; display: block;">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="confirmImage()">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import store from '@/store'
import defaultImage from '../assets/images/default.png'
export default {
  name: 'my-image',
  props: ['value'],
  data () {
    return {
      reqParams: {
        collect: false,
        page: 1,
        per_page: 8
      },
      dialogVisible: false,
      uploadImageUrl: null,
      images: [],
      activeName: 'image',
      total: 0,
      defaultImage,
      // 记录选中的图片地址
      selectedImageUrl: null,
      uploadHeaders: {
        Authorization: `Bearer ${store.getUser().token}`
      }
    }
  },
  methods: {
    // 点击确定上传图片
    confirmImage () {
      // 让图片按钮能够显示选中的或者上传的图片地址
      if (this.activeName === 'image') {
        // this.value = this.selectedImageUrl
        this.$emit('input', this.selectedImageUrl)
      } else {
        this.$emit('input', this.uploadImageUrl)
      }
      this.dialogVisible = false
    },

    handleSuccess (res) {
      // 1、获取图片地址显示img标签
      this.uploadImageUrl = res.data.url
    },

    openDialog () {
      this.dialogVisible = true
      this.getImages()
    },
    // 请求素材图片
    async getImages () {
      const {
        data: { data }
      } = await this.$https.get('user/images', { params: this.reqParams })
      this.images = data.results
      this.total = data.total_count
    },
    // 切换分页
    changePager (newPage) {
      this.reqParams.page = newPage
      this.getImages()
    },
    // 切换到收藏
    collectChange () {
      this.reqParams.page = 1
      this.getImages()
    },
    // 选中图片
    selectedImage (url) {
      this.selectedImageUrl = url
      console.log(url)
      console.log(this.selectedImageUrl)
      console.log(123)
    }
    // 确认图片
  }
}
</script>

<style scoped lang="less">
.my-image{
  display: inline-block;
  margin-right: 20px;
}
.img-btn {
  width: 160px;
  height: 160px;
  border: 1px dashed #ddd;
  img {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.img-list {
  margin-top: 10px;
}
.img-item {
  width: 160px;
  height: 120px;
  border: 1px dashed #ddd;
  display: inline-block;
  margin-right: 15px;
  margin-bottom: 10px;
  position: relative;
  &.selected {
    &::after {
      content: "";
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background: rgba(0, 0, 0, 0.2) url(../assets/images/selected.png)
        no-repeat center/ 50px 50px;
    }
  }
  img {
    width: 100%;
    height: 100%;
    display: block;
    object-fit: contain;
  }
}
</style>
