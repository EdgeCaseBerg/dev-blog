<template>
  <b-row>
    <b-col>
      <b-nav tabs>
        <b-nav-item :to="'/'" exact-active-class="active" class="nav-link">
          Home
        </b-nav-item>
        <b-nav-item
          :to="'/dev-blog'"
          exact-active-class="active"
          class="nav-link"
        >
          Dev Blog
        </b-nav-item>
      </b-nav>
    </b-col>
  </b-row>
</template>

<script>
export default {
  name: "Nav",
};
</script>

<style scoped></style>
