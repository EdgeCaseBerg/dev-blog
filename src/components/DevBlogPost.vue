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
const md = new MarkdownIt({html: true})
const postIndex = require('../posts/meta')
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
      let meta = null
      for (let index = 0; index < postIndex.length; index++) {
        meta = postIndex[index];
        if (meta.id === id) {
          break;
        }
      }

      if (!meta) {
        this.title = 'No Post Here'
        this.summary = "Looks like you've loaded a post that doesn't exist?"
        this.content = "Try navigating back home and see if you can find your way back."
        return
      }

      const pageContent = import (`../posts/${id}`)
      
      const clone = this
      pageContent.then((pageData) => {
          clone.title = meta.title
          clone.summary = meta.summary
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

<style>
blockquote {
  font-style: italic;
  padding-left: 2em;
}
pre {
  padding-left: 2em;
  font-family: monospace;
}
img, video {
  max-width: 90%;
}

</style>