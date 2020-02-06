<template>
  <div>
    <Sidebar />
    <Header />
    <b-container>
      <b-row>
        <b-col>
          <b-row class="my-2">
            <b-col>
              <b-button
                class="text-nowrap"
                variant="success"
                size="sm"
                title="Create meme"
                v-b-modal.create-meme
                v-b-tooltip
              >
                <font-awesome-icon icon="plus" class="mr-1" />Create
              </b-button>
              <b-modal id="create-meme" title="Create meme" @ok="createMeme">
                <b-form id="create-meme-form" class="my-3" @submit.stop.prevent>
                  <b-form-group
                    id="title-group"
                    label="Title:"
                    label-for="title"
                  >
                    <b-form-input
                      id="title"
                      name="title"
                      required
                      placeholder="Enter title"
                    />
                  </b-form-group>
                  <b-form-group
                    id="image-group"
                    label="Meme:"
                    label-for="image"
                  >
                    <file-pond
                      id="image"
                      name="image"
                      ref="pond"
                      accepted-file-types="image/jpeg, image/png"
                      v-on:init="handleFilePondInit"
                      v-on:addfile="handleAddFile"
                      :fileRenameFunction="handleFileRename"
                      :imageResizeTargetWidth="500"
                      maxFileSize="2MB"
                      required
                    />
                  </b-form-group>
                </b-form>
              </b-modal>
            </b-col>
            <b-col>
              <b-form-select
                class="mt-2 mt-sm-0"
                v-model="status"
                :options="options"
                size="sm"
                @change="getMemes(1)"
              ></b-form-select>
            </b-col>
            <b-col>
              <b-pagination
                class="float-sm-right mt-2 mt-sm-0"
                v-model="currentPage"
                :per-page="limit"
                :total-rows="total"
                size="sm"
                @change="getMemes"
              />
            </b-col>
          </b-row>
          <b-table
            ref="selectableTable"
            :busy="isBusy"
            striped
            bordered
            hover
            selectable
            :items="items"
            :fields="fields"
            @row-selected="onRowSelected"
            primary-key="_id"
            responsive
          >
            <template v-slot:table-busy>
              <div class="text-center text-dark my-2">
                <b-spinner class="align-middle mr-2"></b-spinner>
                <strong>Loading...</strong>
              </div>
            </template>
            <template v-slot:cell(id)="data">
              <identicon
                :hash="data.item._id"
                :title="data.item._id"
                v-b-tooltip
              />
            </template>
            <template v-slot:cell(author)="data">{{
              data.item.author.login
            }}</template>
            <template v-slot:cell(imageSrc)="data">
              <b-button
                class="text-nowrap"
                :id="`image-popover-${data.item._id}`"
                variant="primary"
                size="sm"
              >
                <font-awesome-icon icon="eye" class="mr-1" />Show
              </b-button>
              <b-popover
                :target="`image-popover-${data.item._id}`"
                triggers="click blur"
                placement="bottom"
              >
                <template v-slot:title>{{ data.item.title }}</template>
                <b-img
                  :src="`http://localhost:3000${data.item.imageSrc}`"
                  fluid
                  thumbnail
                  :alt="data.item.title"
                />
              </b-popover>
            </template>
            <template v-slot:cell(status)="data">
              <b-badge
                v-if="data.item.status === 'WAITING'"
                pill
                variant="info"
                >{{ data.item.status }}</b-badge
              >
              <b-badge
                v-else-if="data.item.status === 'APPROVED'"
                pill
                variant="success"
                >{{ data.item.status }}</b-badge
              >
              <b-badge v-else pill variant="danger">
                {{ data.item.status }}
              </b-badge>
            </template>
            <template v-slot:cell(actions)="data">
              <b-button
                class="text-nowrap"
                v-if="data.item.publishedAt === null"
                variant="info"
                size="sm"
                @click="handlePublish($event, data.item._id)"
              >
                <font-awesome-icon icon="check" class="mr-1" />Publish
              </b-button>
              <b-button
                class="text-nowrap"
                v-else
                variant="primary"
                size="sm"
                @click="handleUnpublish($event, data.item._id)"
              >
                <font-awesome-icon icon="times" class="mr-1" />Unpublish
              </b-button>
            </template>
          </b-table>
          <b-row>
            <b-col>
              <!-- <b-button
              class="mx-2"
              variant="info"
              @click="selectAllRows"
              size="sm"
              title="Select all"
              v-b-tooltip
            >
              <font-awesome-icon icon="check-square" />
            </b-button>
            <b-button
              class="mx-2"
              variant="info"
              @click="clearSelected"
              size="sm"
              title="Clear selected"
              v-b-tooltip
            >
              <font-awesome-icon icon="minus-square" />
            </b-button>-->
              <b-button
                ref="deleteButton"
                class="text-nowrap"
                disabled
                variant="danger"
                size="sm"
                title="Delete selected memes"
                @click="handleDelete"
                v-b-tooltip
              >
                <font-awesome-icon icon="trash" class="mr-1" />Delete
              </b-button>
            </b-col>
            <b-col>
              <b-pagination
                class="float-sm-right mt-2 mt-sm-0"
                v-model="currentPage"
                :per-page="limit"
                :total-rows="total"
                size="sm"
                @change="getMemes"
              />
            </b-col>
          </b-row>
          <p>
            Selected Rows:
            <br />
            {{ selected }}
          </p>
        </b-col>
      </b-row>
    </b-container>
    <Footer />
  </div>
</template>
<script>
import vueFilePond from "vue-filepond";
import "filepond/dist/filepond.min.css";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.min.css";
import FilePondPluginFileValidateSize from "filepond-plugin-file-validate-size";
import FilePondPluginFileValidateType from "filepond-plugin-file-validate-type";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import FilePondPluginImageResize from "filepond-plugin-image-resize";
import FilePondPluginFileEncode from "filepond-plugin-file-encode";
import FilePondPluginFileRename from "filepond-plugin-file-rename";
import moment from "moment";
import Footer from "../components/TheFooter";
import Header from "../components/TheHeader";
import Sidebar from "../components/TheSidebar";

const FilePond = vueFilePond(
  FilePondPluginFileValidateSize,
  FilePondPluginFileValidateType,
  FilePondPluginImagePreview,
  FilePondPluginImageResize,
  FilePondPluginFileEncode,
  FilePondPluginFileRename
);

export default {
  components: {
    FilePond,
    Footer,
    Header,
    Sidebar
  },
  data() {
    return {
      fields: [
        {
          key: "id",
          class: "text-center text-nowrap",
          thStyle: { width: "1%" }
        },
        { key: "title", sortable: true },
        { key: "author", sortable: true },
        { key: "imageSrc" },
        {
          key: "createdAt",
          // eslint-disable-next-line no-unused-vars
          formatter: (value, key, item) => {
            moment.locale("en-GB");
            return moment(value).format("LLL:ss");
          },
          sortable: true
        },
        {
          key: "publishedAt",
          // eslint-disable-next-line no-unused-vars
          formatter: (value, key, item) => {
            if (value !== null) {
              moment.locale("en-GB");
              return moment(value).format("LLL:ss");
            } else {
              return "-";
            }
          },
          sortable: true
        },
        {
          key: "status",
          sortable: true,
          class: "text-center text-nowrap",
          thStyle: { width: "1%" }
        },
        {
          key: "actions",
          class: "text-center text-nowrap",
          thStyle: { width: "1%" }
        }
      ],
      isBusy: true,
      items: [],
      selected: [],
      currentPage: 1,
      limit: 1,
      total: 1,
      status: "WAITING",
      options: [
        { value: null, text: "All" },
        { value: "APPROVED", text: "Approved" },
        { value: "REJECTED", text: "Rejected" },
        { value: "WAITING", text: "Waiting" }
      ]
    };
  },

  async created() {
    await this.getMemes(this.currentPage);
  },

  methods: {
    onRowSelected(items) {
      this.selected = items;
      if (this.selected.length <= 0) {
        this.$refs.deleteButton.disabled = true;
        this.$refs.deleteButton.classList.add("disabled");
      } else {
        this.$refs.deleteButton.disabled = false;
        this.$refs.deleteButton.classList.remove("disabled");
      }
    },
    selectAllRows() {
      this.$refs.selectableTable.selectAllRows();
    },
    clearSelected() {
      this.$refs.selectableTable.clearSelected();
    },
    handleFilePondInit() {
      // eslint-disable-next-line no-console
      console.log("FilePond has initialized");
    },
    handleFileRename(file) {
      return `swipememe${file.extension}`;
    },
    async handleAddFile(err, item) {
      if (err) {
        // eslint-disable-next-line no-console
        console.warn(err);
        return;
      }
      try {
        const base64String = item.getFileEncodeBase64String();
        const response = await fetch("http://127.0.0.1:3000/api/v1/upload", {
          method: "POST",
          body: JSON.stringify({
            id: item.id,
            name: item.filename,
            nameWithoutExtension: item.filenameWithoutExtension,
            type: item.fileType,
            extension: item.fileExtension,
            size: item.fileSize,
            metadata: item.getMetadata(),
            data: base64String
          }),
          headers: {
            Authorization: `Bearer ${localStorage.getItem("jwt")}`,
            "Content-type": "application/json"
          }
        });

        if (response.ok) {
          document.getElementsByName("image")[0].value = await response.text();
        } else {
          this.createToast(
            "Uploading file",
            "Uploading file failed!",
            "danger"
          );
        }
      } catch (err) {
        this.createToast("Uploading file", "Uploading file failed!", "danger");
      }
    },

    // eslint-disable-next-line no-unused-vars
    async createMeme(event) {
      const form = document.getElementById("create-meme-form");
      const body = this.createBody(form);

      try {
        const response = await fetch("http://localhost:3000/api/v1/meme", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt")}`
          }
        });

        if (response.ok) {
          this.createToast(
            "Meme creation",
            "Meme created successfully!",
            "success"
          );

          await this.getMemes(this.currentPage);
        } else {
          this.createToast("Creating meme", "Meme creation failed!", "danger");
        }
      } catch (err) {
        this.createToast("Creating meme", "Meme creation failed!", "danger");
      }
    },

    createBody(form) {
      const body = {};
      for (const input of form) {
        if (input.type === "checkbox") {
          body[input.name] = input.checked;
        } else {
          body[input.name] = input.value;
        }
      }
      return body;
    },

    createToast(title, body, variant) {
      this.$bvToast.toast(body, {
        autoHideDelay: 5000,
        title,
        variant
      });
    },

    async handleDelete() {
      try {
        if (
          await this.$bvModal.msgBoxConfirm(
            `Are you sure you want to delete ${this.selected.length} meme${
              this.selected.length <= 1 ? "" : "s"
            }?`
          )
        ) {
          for (const meme of this.selected) {
            await this.deleteMeme(meme._id);
          }
          this.getMemes(this.currentPage);
        }
      } catch (err) {
        this.createToast("Error", "Please try again.", "danger");
      }
    },

    async deleteMeme(id) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/meme/${id}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
          }
        );

        if (response.ok) {
          this.createToast(
            "Meme deletion",
            `Meme with id '${id}' was deleted successfully!`,
            "success"
          );
        } else {
          this.createToast(
            "Meme deletion",
            `Unable to delete meme with id '${id}'!`,
            "danger"
          );
        }
      } catch (err) {
        this.createToast(
          "Connection error",
          "Unable to connect with server. Please try again.",
          "danger"
        );
      }
    },

    async getMemes(page) {
      this.isBusy = true;
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/meme/page/${page.toString()}${
            this.status === null ? "" : "?status=" + this.status
          }`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
          }
        );

        if (response.ok) {
          const memes = await response.json();
          this.items = memes.docs;
          this.limit = memes.limit;
          this.total = memes.totalDocs;
          this.isBusy = false;
        } else {
          this.createToast(
            "Server error",
            "Unable to load memes. Please refresh the page.",
            "danger"
          );
        }
      } catch (err) {
        this.createToast(
          "Connection error",
          "Unable to connect with server. Please try again.",
          "danger"
        );
      }
    },
    // eslint-disable-next-line no-unused-vars
    async handlePublish(event, id) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/meme/${id}/publish`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
          }
        );

        if (response.ok) {
          this.createToast(
            "Meme published",
            `Meme with id '${id}' published successfully.`,
            "success"
          );
          this.getMemes(this.currentPage);
        } else {
          this.createToast(
            "Publishing error",
            "Meme publishing failed. Please try again.",
            "danger"
          );
        }
      } catch (err) {
        this.createToast(
          "Connection error",
          "Unable to connect with server. Please try again.",
          "danger"
        );
      }
    },
    // eslint-disable-next-line no-unused-vars
    async handleUnpublish(event, id) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/meme/${id}/unpublish`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${localStorage.getItem("jwt")}`
            }
          }
        );

        if (response.ok) {
          this.createToast(
            "Meme unpublished",
            `Meme with id '${id}' unpublished successfully.`,
            "success"
          );
          this.getMemes(this.currentPage);
        } else {
          this.createToast(
            "Unpublishing error",
            "Meme unpublishing failed. Please try again.",
            "danger"
          );
        }
      } catch (err) {
        this.createToast(
          "Connection error",
          "Unable to connect with server. Please try again.",
          "danger"
        );
      }
    }
  }
};
</script>
<style scoped></style>
