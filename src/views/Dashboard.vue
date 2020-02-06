<template>
  <div>
    <Sidebar />
    <Header />
    <b-container>
      <b-row>
        <b-col>
          <b-card-group deck class="text-white">
            <b-card
              title="Memes board"
              img-src="https://via.placeholder.com/600x300"
              img-alt="memes"
              img-top
              tag="article"
              class="mx-2"
              border-variant="primary"
            >
              <router-link to="/memes" class="btn btn-primary stretched-link"
                >Go</router-link
              >
            </b-card>
            <b-card
              title="Tags board"
              img-src="https://via.placeholder.com/600x300"
              img-alt="tags"
              img-top
              tag="article"
              class="mx-2"
              border-variant="primary"
            >
              <router-link to="/tags" class="btn btn-primary stretched-link"
                >Go</router-link
              >
            </b-card>
            <b-card
              title="Users board"
              img-src="https://via.placeholder.com/600x300"
              img-alt="users"
              img-top
              tag="article"
              class="mx-2"
              border-variant="primary"
            >
              <router-link to="/users" class="btn btn-primary stretched-link"
                >Go</router-link
              >
            </b-card>
          </b-card-group>
        </b-col>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>
<script>
import Footer from "../components/TheFooter";
import Header from "../components/TheHeader";
import Sidebar from "../components/TheSidebar";

export default {
  components: {
    Footer,
    Header,
    Sidebar
  }
};
</script>
