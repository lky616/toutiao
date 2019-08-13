<template>
  <div class="container">
    <el-card>
      <div slot="header">
        <my-bread>{{articleId?'修改文章' : '发布文章'}}</my-bread>
      </div>
      <!-- 表单 -->
      <el-form label-width="100px">
        <el-form-item label="标题：">
          <el-input v-model="articleForm.title" style="width:400px"></el-input>
        </el-form-item>
        <el-form-item label="内容：">
          <quill-editor v-model="articleForm.content" :options="editorOption"></quill-editor>
        </el-form-item>
        <el-form-item label="封面：">
          <el-radio-group v-model="articleForm.cover.type" @change="changeType">
            <el-radio :label="1">单图</el-radio>
            <el-radio :label="3">三图</el-radio>
            <el-radio :label="0">无图</el-radio>
            <el-radio :label="-1">自动</el-radio>
          </el-radio-group>
          <!-- 图片按钮 -->
          <div v-if="articleForm.cover.type === 1">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
          </div>
          <div v-if="articleForm.cover.type === 3">
            <my-image v-model="articleForm.cover.images[0]"></my-image>
            <my-image v-model="articleForm.cover.images[1]"></my-image>
            <my-image v-model="articleForm.cover.images[2]"></my-image>
          </div>
        </el-form-item>
        <el-form-item label="频道：">
          <my-channel v-model="articleForm.channel_id"></my-channel>
        </el-form-item>
        <el-form-item v-if="!articleId">
          <el-button type="primary" @click="submit(false)">发表</el-button>
          <el-button @click="submit(true)">存入草稿</el-button>
        </el-form-item>
        <el-form-item v-else>
          <el-button type="success" @click="update(false)">发表</el-button>
          <el-button @click="update(true)">存入草稿</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import { quillEditor } from 'vue-quill-editor'
export default {
  components: {
    quillEditor
  },
  data () {
    return {
      articleForm: {
        title: null,
        content: null,
        cover: {
          type: 1,
          images: []
        },
        channel_id: null
      },
      // 富文本配置
      editorOption: {
        modules: {
          toolbar: [
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ header: 1 }, { header: 2 }],
            [{ list: 'ordered' }, { list: 'bullet' }],
            [{ indent: '-1' }, { indent: '+1' }]
          ]
        }
      },
      articleId: null
    }
  },
  methods: {
    changeType () {
      this.articleForm.cover.images = []
    },
    async submit (draft) {
      await this.$https.post(`articles?draft=${draft}`, this.articleForm)
      this.$message.success(draft ? '文章存入草稿成功' : '文章发表成功')
      // 去内容管理
      this.$router.push('/article')
    },
    async update (draft) {
      await this.$https.put(`articles/${this.articleId}?draft=${draft}`, this.articleForm)
      this.$message.success(draft ? '修改存入草稿成功' : '文章修改成功')
      // 去内容管理
      this.$router.push('/article')
    },
    async getArticle () {
      const { data: { data } } = await this.$https.get('articles/' + this.articleId)
      this.articleForm = data
    }
  },
  created () {
    // 获取地址栏传参
    this.articleId = this.$route.query.id
    // 判断如果有ID 修改文章 获取当前文章数据
    if (this.articleId) {
      this.getArticle()
    }
  },
  // 使用数据监听
  watch: {
    // 不仅仅是data中的数据才可以去监听 $route实例的数据
    $route () {
      if (!this.$route.query.id) {
        this.articleId = null
        this.articleForm = {
          title: null,
          content: null,
          cover: {
            type: 1,
            images: []
          },
          channel_id: null
        }
      }
    }
  }
}
</script>

<style scoped lang='less'>

</style>
