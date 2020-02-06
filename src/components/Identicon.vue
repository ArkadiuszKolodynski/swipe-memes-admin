<template>
  <img ref="icon" src="data:image/svg+xml;utf8," :alt="this._props.hash" />
</template>

<script>
import Identicon from "identicon.js";

export default {
  mounted() {
    this.$refs.icon.src += new Identicon(this._props.hash, {
      format: "svg",
      size: 25
    }).toString(true);
  },
  props: ["hash"]
};
</script>
