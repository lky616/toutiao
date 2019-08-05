<template>
  <div>article</div>
</template>

<script>
export default {
  created () {
    this.$https
      .get('http://ttapi.research.itcast.cn/mp/v1_0/articles')
      .then(res => console.log(res.data))
  }
}
</script>

<style scoped lang='less'>
</style>
