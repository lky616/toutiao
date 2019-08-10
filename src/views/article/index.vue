<template>
  <div class="container">
    <!-- 筛选条件 -->
    <el-card>
      <div slot="header">
        <my-bread>内容管理</my-bread>
      </div>
      <el-form label-width="80px" size="small">
        <el-form-item label="状态 : ">
          <el-radio-group v-model="reqParams.status">
            <el-radio :label="null">全部</el-radio>
            <el-radio :label="0">草稿</el-radio>
            <el-radio :label="1">待审核</el-radio>
            <el-radio :label="2">审核通过</el-radio>
            <el-radio :label="3">审核失败</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="频道 : ">
          <!-- 使用自己的组件 -->
          <my-channel v-model="reqParams.channel_id"></my-channel>
        </el-form-item>
        <el-form-item label="日期 : ">
          <el-date-picker
            v-model="dateArr"
            type="daterange"
            range-separator="至"
            start-placeholder="开始日期"
            end-placeholder="结束日期"
            @change="changeDate"
            value-format="yyyy-MM-dd"
          ></el-date-picker>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="search()">筛选</el-button>
        </el-form-item>
      </el-form>
    </el-card>
    <!-- 筛选结果 -->
    <el-card>
      <div slot="header">根据筛选条件共查询到{{total}}条结果</div>
      <!-- 表格组件 -->
      <el-table :data="articles">
        <el-table-column prop="img" label="封面">
          <template slot-scope="scope">
            <el-image :src="scope.row.cover.images[0]" fit="cover" style="width:120px;height:80px">
              <div slot="error">
                <img src="../../assets/images/error.gif" style="width:120px;height:80px" alt />
              </div>
            </el-image>
          </template>
        </el-table-column>
        <el-table-column prop="title" label="标题"></el-table-column>
        <el-table-column label="状态">
          <template slot-scope="scope">
            <el-tag v-if="scope.row.status ===0" type="info">草稿</el-tag>
            <el-tag v-if="scope.row.status ===1">待审核</el-tag>
            <el-tag v-if="scope.row.status ===2" type="success">审核通过</el-tag>
            <el-tag v-if="scope.row.status ===3" type="warning">审核失败</el-tag>
            <el-tag v-if="scope.row.status ===4" type="danger">删除</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="pubdate" label="发布时间"></el-table-column>
        <el-table-column label="操作" width="120px">
          <template slot-scope="scope">
            <el-button plain type="primary" @click="edit(scope.row.id)" icon="el-icon-edit" circle></el-button>
            <el-button plain type="danger" @click="del(scope.row.id)" icon="el-icon-delete" circle></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页组件 -->
      <el-pagination
        style="text-align:center; margin-top:30px"
        background
        layout="prev,pager,next"
        :total="total"
        :page-size="reqParams.per_page"
        :current-page="reqParams.page"
        @current-change="changePager"
      ></el-pagination>
    </el-card>
  </div>
</template>

<script>
// import MyBread from '@/components/my-bread'
// import MyChannel from '@/components'
export default {
  // components: { MyBread },
  data () {
    return {
      // 筛选项表单数据
      reqParams: {
        status: null,
        channel_id: null,
        begin_pubdate: null,
        end_pundate: null,
        page: 1,
        per_page: 20
      },
      // 频道下拉选项数据
      channelOptions: [],
      // 日期数据
      dateArr: [],
      tableData: [
        {
          date: '2016-05-02',
          name: '王小虎',
          address: '上海市普陀区金沙江路 1518 弄'
        }
      ],
      articles: [],
      total: 0
    }
  },
  created () {
    // this.$https
    //   .get('http://ttapi.research.itcast.cn/mp/v1_0/articles')
    //   .then(res => console.log(res.data))
    // 获取频道下拉选项数据
    // this.getChannelOptions()
    // 获取文章类表数据
    this.getArticals()
  },
  methods: {
    // 点击删除按钮 删除列表项
    del (id) {
      this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(async () => {
          // 点击确认
          await this.$https.delete(`articles/${id}`)
          // 这两句代码没有执行 上面一句代码报错 没有抛出这个错误
          this.$message.success('删除文章成功')
          this.getArticals()
        })
        .catch(() => {})
    },
    // 点击编辑进行跳转
    edit (id) {
      this.$router.push('/publish?id=' + id)
    },
    /*  获取频道数据
      async getChannelOptions () {
      const {
        data: { data }
      } = await this.$https.get('channels')
      this.channelOptions = data.channels
    }, */
    async getArticals () {
      const {
        data: { data }
      } = await this.$https.get('articles', { params: this.reqParams })
      this.articles = data.results
      this.total = data.total_count
    },
    // 改变分页事件对应函数
    changePager (newPage) {
      // 修改获取数据的页码
      this.reqParams.page = newPage
      this.getArticals()
    },
    // 筛选函数
    search () {
      // 筛选项双向绑定 拿着对应的数据发请求即可 注意：重新筛选后页码应是第一页
      this.reqParams.page = 1
      this.getArticals()
    },
    changeDate (dateArr) {
      if (dateArr) {
        this.reqParams.begin_pubdate = dateArr[0]
        this.reqParams.end_pubdate = dateArr[1]
      } else {
        this.reqParams.begin_pubdate = null
        this.reqParams.end_pubdate = null
      }
    }
  }
  /* watch: {
    'reqParams.channel_id': function (newVal, oldVal) {
      if (newVal === '') {
        this.reqParams.channel_id = null
      }
    }
  } */
}
</script>

<style scoped lang='less'>
.el-card {
  margin-bottom: 20px;
}
</style>
