<template>
  <b-container>
    <b-row>
      <b-col>
        <h1>Developer's Blog</h1>
      </b-col>
    </b-row>
    <b-row>
      <b-col>
        <p>
          When I work on something kinda neat, sometimes I write about it.
        </p>
      </b-col>
    </b-row>
    <b-row v-for="(postGroup, gIdx) in postGroups" :key="gIdx">
      <b-col v-for="post in postGroup" :key="post.id">
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
export default {
  name: "DevBlog",
  data () {
    const columns = 4
    return {
      columns,
      postGroups: posts.reduce((accum, currentValue) => {
        if (accum[accum.length - 1].length == columns) {
          accum.push([currentValue])
        } else {
          const group = accum[accum.length - 1]
          group.push(currentValue)
        }
        return accum
      }, [[]])
    }
  }
};
</script>
<style scoped></style>
