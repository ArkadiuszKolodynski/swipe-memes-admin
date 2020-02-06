<template>
  <div class="sidebar bg-dark">
    <nav class="list-group list-group-flush">
      <router-link
        to="/"
        active-class="active"
        class="list-group-item list-group-item-action"
        exact
        onclick="this.blur();"
      >
        <font-awesome-icon class="mr-1" icon="home" fixed-width />Dashboard
      </router-link>
      <router-link
        to="/memes"
        active-class="active"
        class="list-group-item list-group-item-action"
        exact
        onclick="this.blur();"
      >
        <font-awesome-icon class="mr-1" icon="images" fixed-width />Memes
      </router-link>
      <router-link
        to="/tags"
        active-class="active"
        class="list-group-item list-group-item-action"
        exact
        onclick="this.blur();"
      >
        <font-awesome-icon class="mr-1" icon="tags" fixed-width />Tags
      </router-link>
      <router-link
        to="/users"
        active-class="active"
        class="list-group-item list-group-item-action"
        exact
        onclick="this.blur();"
      >
        <font-awesome-icon class="mr-1" icon="users" fixed-width />Users
      </router-link>
    </nav>
    <div
      class="text-light w-100 p-1"
      style="position: absolute; bottom: 0; left: 0;"
      ref="userbar"
    >
      <span>{{ $store.getters.user.login }}</span>
      <b-button
        class="mx-3"
        variant="primary"
        size="sm"
        @click="logout()"
        title="Logout"
        ><font-awesome-icon icon="sign-out-alt"
      /></b-button>
    </div>
  </div>
</template>

<script>
import gravatarUrl from "gravatar-url";
export default {
  mounted() {
    const img = document.createElement("img");
    img.src = gravatarUrl(this.$store.getters.user.email, {
      size: 25,
      default: "identicon"
    });
    img.classList.add("mx-1");
    img.classList.add("rounded-circle");
    this.$refs.userbar.insertBefore(img, this.$refs.userbar.firstChild);
  },
  methods: {
    logout() {
      localStorage.removeItem("jwt");
      this.$store.commit("setAuthenticated", false);
      this.$router.replace({ name: "Login" });
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.sidebar {
  height: 100vh;
  position: fixed;
  left: 0;
  bottom: 0;
  overflow: hidden;
  width: 12rem;
}
.sidebar:hover {
  overflow: auto;
}
</style>
