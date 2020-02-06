<template>
  <b-container fluid>
    <b-row class="my-5">
      <b-col cols="0" md="4"></b-col>
      <b-col cols="12" md="4">
        <b-card title="Login" class="text-light">
          <b-form id="login" @submit="login">
            <b-form-group
              id="usernameLabel"
              label="Username"
              label-for="username"
            >
              <b-form-input
                id="username"
                type="text"
                name="username"
                v-model="input.username"
                required
                placeholder="Username"
                ref="username"
              ></b-form-input>
            </b-form-group>
            <b-form-group
              id="passwordLabel"
              label="Password"
              label-for="password"
            >
              <b-form-input
                id="password"
                type="password"
                name="password"
                v-model="input.password"
                required
                placeholder="Password"
              ></b-form-input>
            </b-form-group>
            <b-button variant="primary" type="submit">Login</b-button>
          </b-form>
        </b-card>
      </b-col>
      <b-col cols="0" md="4"></b-col>
    </b-row>
  </b-container>
</template>

<script>
import jwtDecorde from "jwt-decode";
export default {
  name: "Login",
  data() {
    return {
      input: {
        username: "",
        password: ""
      }
    };
  },
  beforeCreate() {
    if (this.$store.getters.authenticated) {
      this.$router.replace({ name: "Dashboard" });
    }
  },
  mounted() {
    const app = document.getElementById("app");
    //TODO
    app.style.marginLeft = 0;
    app.style.marginTop = 0;
    this.$refs.username.focus();
  },
  methods: {
    async login(event) {
      event.preventDefault();
      if (this.input.username !== "" && this.input.password !== "") {
        try {
          const response = await fetch("http://localhost:3000/api/v1/auth", {
            method: "POST",
            body: JSON.stringify({
              login: this.input.username,
              password: this.input.password
            }),
            headers: {
              "Content-type": "application/json"
            }
          });

          if (response.ok) {
            const payload = await response.json();
            localStorage.setItem("jwt", payload.jwt);
            this.$store.commit("setUser", jwtDecorde(payload.jwt));
            this.$store.commit("setAuthenticated", true);
            this.$router.replace({ name: "Dashboard" });
            const app = document.getElementById("app");
            //TODO
            app.style.marginTop = "6rem";
            app.style.marginLeft = "12rem";
          } else {
            //TODO
            alert("Wrong login/password!");
          }
        } catch (err) {
          // eslint-disable-next-line no-console
          console.error(err);
        }
      } else {
        //TODO
        alert("A username and password must be present!");
      }
    }
  }
};
</script>
