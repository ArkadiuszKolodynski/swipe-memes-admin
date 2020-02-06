import Dashboard from "../views/Dashboard.vue";
import Login from "../views/Login.vue";
import Memes from "../views/Memes.vue";
import Tags from "../views/Tags.vue";
import Users from "../views/Users.vue";

const routes = [
  { path: "/", component: Dashboard, name: "Dashboard" },
  { path: "/login", component: Login, name: "Login" },
  { path: "/memes", component: Memes, name: "Memes" },
  { path: "/tags", component: Tags, name: "Tags" },
  { path: "/users", component: Users, name: "Users" }
];

export default routes;
