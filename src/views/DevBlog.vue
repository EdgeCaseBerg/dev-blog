<template>
  <b-container>
    <h1>Hi Dev Blog</h1>
    <b-row>
      <b-col v-for="post in posts" :key="post.id">
        <router-link :to="`/dev-blog/${post.id}`">
        <b-card :title="post.title">
          <b-card-text>
            {{ post.summary }}
          </b-card-text>
        </b-card>
        </router-link>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
const posts = require('../posts/meta.js')
console.log(posts)
export default {
  name: "DevBlog",
  data () {
    return {
      posts: posts
    }
  }
};
</script>
<style scoped></style>
