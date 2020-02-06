import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import VueRouter from "vue-router";
import App from "./App.vue";
// import "bootstrap/dist/css/bootstrap.css";
import "bootstrap-vue/dist/bootstrap-vue.css";
import "bootswatch/dist/darkly/bootstrap.min.css";
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faCheckSquare,
  faMinusSquare,
  faTrash,
  faEdit,
  faImages,
  faTags,
  faUsers,
  faPlus,
  faHome,
  faCheck,
  faTimes,
  faEye,
  faSignOutAlt
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
import Identicon from "./components/Identicon";
import routes from "./router/routes";
import { store } from "./store/store";

library.add(
  faCheckSquare,
  faMinusSquare,
  faTrash,
  faEdit,
  faImages,
  faTags,
  faUsers,
  faPlus,
  faHome,
  faCheck,
  faTimes,
  faEye,
  faSignOutAlt
);
Vue.component("font-awesome-icon", FontAwesomeIcon);
Vue.component("identicon", Identicon);

Vue.config.productionTip = false;
Vue.use(VueRouter);
Vue.use(BootstrapVue);

const router = new VueRouter({ routes });

new Vue({
  store,
  router,
  render: h => h(App)
}).$mount("#app");
