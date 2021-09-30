const content = `
## Why?

1. I'm still a novice at VueJS and I want to get more experience.
2. I wanted to experiment with [Cocos Creator] and blog about the experience
3. I didn't feel like using a pre-made solution since I know I can whip one up for myself.

## Getting started

First off, I already have Visual Studio Code setup with Node and have done a Vue project in the past week. 
So I was easily able to start the project by opening up a new project and then in the terminal typing:

    vue create .

I then went through the motions of selecting what I wanted from the dialog, and then I forgot to pass it the flag to not generate the Hello World defaults. Oops. 
A few minutes later and I had ran my imports to get the vue-bootstrap and vue-router libraries included in my project because I'm lazy and don't like to style things.
After I had made a Nav component, setup a couple of main "view" components to pass to the router I realized I didn't know how I was going to structure my posts.

## How do I dynamically load data for a static site?

I don't want to keep everything in one file, and I like having an organized file hierarchy if at all possible. So I knew I was going to dump some type of metadata or data file
for each one of these blog posts into a seperate file. This meant loading each of them individually by an id that corresponds to their filename. The routing was straightforward,
in the vue-router documentation it talks about how to setup a dynamic route using \`:\` in the object like so

    {
      path: "/dev-blog/:id",
      component: DevBlogPost,
    }

But how does one load posts dynamically onto a page from vue? A little bit of reading further in the vue docs led me to the [reacting to params changes] page.
This section mentions that you can use the \`this.$route\` to get at the params, but still no hint since the people writing this docs probably assume we're using Ajax.
I turned towards a web search and [found out] that you can just call \`import\` and resolve the promise to get back data from a JS file. So, about 10 seconds later I had

    loadPageData(id) {
      const pageDataImport = import (\`../posts/\${id}\`)
      const clone = this
      pageDataImport.then((pageData) => {
          clone.title = pageData.title
          clone.summary = pageData.summary
          clone.content = md.render(pageData.content)
      })
    }

and then plugged it into the \`beforeRouteUpdate\` method as well as the \`mounted\` hook and I had a simple way to load data in. This was working from my local machine. But I did
curious if it was going to work once it was live. So I quickly fired off \`npm run build\` and waited for it to create the dist folder so I could pop it open. I ran into a problem
when I forgot that I didn't have php or python installed on my Windows machine I was working on. So a quick search found me [this extension for chrome] that let me serve the files.

It worked. Which I guess shouldn't surprise me, but I guess I'm just so used to the JVM that an import command being ran on the fly like this just throws me for a loop.

## DRY the meta data?

At this point I had started writing this blog post, creating a meta object in my main blog listing like this

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

and also creating the file _posts/making-the-blog.js_ like this

    module.exports = {
      title: "Making the blog",
      summary: "About how I made this site with Vue",
      content: 'test'
    };

this worked out and rendered as expected, but I was stuck wondering if there was a way I could avoid duplicating my efforts here. After about 5 minutes of thinking about it
I came up with a solution that would work and only introduce one extra file into the mix. 

[Cocos Creator]:https://www.bookstack.cn/read/cocos-creator-3.3-en/5880ef9ce7a58296.md
[reacting to params changes]:https://router.vuejs.org/guide/essentials/dynamic-matching.html#reacting-to-params-changes
[found out]:https://vueschool.io/articles/vuejs-tutorials/lazy-loading-and-code-splitting-in-vue-js/
[this extension for chrome]:https://chrome.google.com/webstore/detail/web-server-for-chrome/ofhbbkphhbklhfoeikjpcbhemlocgigb?hl=en
`;
module.exports = {
    title: "Making the blog",
    summary: "About how I made this site with Vue",
    content
  };