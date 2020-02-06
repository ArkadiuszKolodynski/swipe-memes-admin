<template>
  <footer class="bg-primary text-light">SwipeMemes Ⓒ {{ year }}</footer>
</template>

<script>
export default {
  mounted() {},
  data() {
    return {
      year: new Date().getUTCFullYear()
    };
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
footer {
  padding: 2rem 0 2rem 0;
  position: fixed;
  bottom: 0;
  left: 12rem;
  text-align: center;
  overflow: hidden;
  width: calc(100% - 12rem);
}
</style>
