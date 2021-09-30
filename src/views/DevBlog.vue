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
export default {
  name: "DevBlog",
  data () {
    return {
      posts: [
        {
          id: 'making-the-blog',
          title: 'Making the Blog',
          summary: 'Using Vue JS to make a quick static site blogging platform for myself in a couple of hours.'
        }
      ]
    }
  }
};
</script>
<style scoped></style>
