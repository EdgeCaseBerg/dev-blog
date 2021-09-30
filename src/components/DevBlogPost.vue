<template>
  <article>
    <h1>{{title}}</h1>
    <b-row>
      <b-col>
        <p>
           {{ summary }}
        </p>
        <hr/>
      </b-col>
    </b-row>
    <b-row>
      <b-col v-html="content">
      </b-col>
    </b-row>
  </article>
</template>

<script>
const MarkdownIt = require('markdown-it')
const md = new MarkdownIt()

export default {
  name: "DevBlogPost",
  data() {
    return {
      title: "Not found",
      summary: "Looks like you've loaded a post that doesn't exist?",
      content: "Try navigating back home and see if you can find your way back.",
    };
  },
  beforeRouteUpdate(to, from, next) {
      const postId = this.$route.params.id
      if (postId) {
          this.loadPageData(postId)
      }
      next()
  },
  methods: {
      loadPageData(id) {
        const pageDataImport = import (`../posts/${id}`)
        const clone = this
        pageDataImport.then((pageData) => {
            clone.title = pageData.title
            clone.summary = pageData.summary
            clone.content = md.render(pageData.content)
        })
      }
  },
  mounted () {
      const postId = this.$route.params.id
      this.loadPageData(postId)
  }
};
</script>

<style scoped></style>