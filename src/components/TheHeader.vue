<template>
  <header class="text-light">
    <h1>{{ this.$route.name }}</h1>
  </header>
</template>

<script>
export default {
  mounted() {}
  // data() {}
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
header {
  background-color: rgba(0, 0, 0, 0);
  padding: 1rem 2rem;
  position: fixed;
  top: 0;
  left: 12rem;
  overflow: hidden;
  width: calc(100vw - 12rem);
}
</style>
