<template>
  <div id="app">
    <router-view />
  </div>
</template>

<script>
import jwtDecode from "jwt-decode";

export default {
  name: "app",
  beforeMount() {
    const token = localStorage.getItem("jwt");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        this.$store.commit("setUser", decodedToken);
        this.$store.commit("setAuthenticated", true);
      } catch (err) {
        console.error(err);
      }
    }
  },
  mounted() {
    if (!this.$store.getters.authenticated) {
      this.$router.replace({ name: "Login" });
    }
  },
  updated() {
    if (!this.$store.getters.authenticated) {
      this.$router.replace({ name: "Login" });
    }
  }
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-left: 12rem;
  margin-top: 6rem;
}
.container {
  height: calc(100vh - 11.5rem);
  overflow: auto;
  scrollbar-color: #adb5bd rgb(30, 30, 30);
}
.table.b-table > thead > tr > [aria-sort="none"],
.table.b-table > tfoot > tr > [aria-sort="none"] {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='white' opacity='.3' d='M51 1l25 23 24 22H1l25-22zM51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e") !important;
}
.table.b-table > thead > tr > [aria-sort="ascending"],
.table.b-table > tfoot > tr > [aria-sort="ascending"] {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='white' d='M51 1l25 23 24 22H1l25-22z'/%3e%3cpath fill='white' opacity='.3' d='M51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e") !important;
}
.table.b-table > thead > tr > [aria-sort="descending"],
.table.b-table > tfoot > tr > [aria-sort="descending"] {
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' width='101' height='101' view-box='0 0 101 101' preserveAspectRatio='none'%3e%3cpath fill='white' opacity='.3' d='M51 1l25 23 24 22H1l25-22z'/%3e%3cpath fill='white' d='M51 101l25-23 24-22H1l25 22z'/%3e%3c/svg%3e") !important;
}
</style>
