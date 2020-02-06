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
                title="Create tag"
                v-b-modal.create-tag
                v-b-tooltip
              >
                <font-awesome-icon icon="plus" class="mr-1" />Create
              </b-button>
              <b-modal id="create-tag" title="Create tag" @ok="createTag">
                <b-form id="create-tag-form" class="my-3" @submit.stop.prevent>
                  <b-form-group id="tag-group" label="Tag:" label-for="tag">
                    <b-form-input
                      id="tag"
                      name="tag"
                      required
                      placeholder="Enter tag"
                    />
                  </b-form-group>
                </b-form>
              </b-modal>
            </b-col>
            <b-col>
              <b-pagination
                class="float-sm-right mt-2 mt-sm-0"
                v-model="currentPage"
                :per-page="limit"
                :total-rows="total"
                size="sm"
                @change="getTags"
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
            <template v-slot:cell(actions)="data">
              <b-button
                class="text-nowrap"
                size="sm"
                variant="info"
                @click="$bvModal.show(`edit-tag-${data.item._id}`)"
              >
                <font-awesome-icon icon="edit" />Edit
              </b-button>
              <b-modal
                :id="`edit-tag-${data.item._id}`"
                title="Edit tag"
                @ok="editTag($event, data.item.slug)"
              >
                <b-form
                  :id="`edit-tag-${data.item._id}-form`"
                  class="my-3"
                  @submit.stop.prevent
                >
                  <b-form-group id="tag-group" label="Tag:" label-for="tag">
                    <b-form-input
                      id="tag"
                      name="tag"
                      required
                      placeholder="Enter tag"
                      :value="data.item.tag"
                    />
                  </b-form-group>
                </b-form>
              </b-modal>
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
                title="Delete selected items"
                @click="handleDelete()"
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
                @change="getTags"
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
import Footer from "../components/TheFooter";
import Header from "../components/TheHeader";
import Sidebar from "../components/TheSidebar";

export default {
  components: {
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
        { key: "tag", sortable: true },
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
      total: 1
    };
  },

  async created() {
    await this.getTags(this.currentPage);
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

    // eslint-disable-next-line no-unused-vars
    async createTag(event) {
      const form = document.getElementById("create-tag-form");
      const body = this.createBody(form);

      try {
        const response = await fetch("http://localhost:3000/api/v1/tag", {
          method: "POST",
          body: JSON.stringify(body),
          headers: {
            "Content-type": "application/json",
            Authorization:
              "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGEzNjk4MDk0MGIzZDNhYTg3ZWJhNTUiLCJlbWFpbCI6ImFkbWluQGFkbWluLnBsIiwiaXNQcml2aWxlZ2VkIjp0cnVlLCJsb2dpbiI6ImFkbWluIiwiaWF0IjoxNTc0MzY5MTA2fQ.uVWhvuhELdhV1qleRf89MMLJL5m_jVydIDraFRCsz_Y"
          }
        });

        if (response.ok) {
          this.createToast(
            "Tag creation",
            "Tag created successfully!",
            "success"
          );

          await this.getTags(this.currentPage);
        } else {
          this.createToast("Creating tag", "Tag creation failed!", "danger");
        }
      } catch (err) {
        this.createToast("Creating tag", "Tag creation failed!", "danger");
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

    // eslint-disable-next-line no-unused-vars
    async editTag(event, slug) {
      // eslint-disable-next-line no-console
      console.log(event, slug);
      const form = document.getElementById(`${event.componentId}-form`);
      const body = this.createBody(form);

      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/tag/${slug}`,
          {
            method: "PUT",
            body: JSON.stringify(body),
            headers: {
              "Content-type": "application/json",
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGEzNjk4MDk0MGIzZDNhYTg3ZWJhNTUiLCJlbWFpbCI6ImFkbWluQGFkbWluLnBsIiwiaXNQcml2aWxlZ2VkIjp0cnVlLCJsb2dpbiI6ImFkbWluIiwiaWF0IjoxNTc0MzY5MTA2fQ.uVWhvuhELdhV1qleRf89MMLJL5m_jVydIDraFRCsz_Y"
            }
          }
        );

        if (response.ok) {
          this.createToast(
            "Tag edition",
            "Tag edited successfully!",
            "success"
          );

          await this.getTags(this.currentPage);
        } else {
          this.createToast("Editing tag", "Tag edition failed!", "danger");
        }
      } catch (err) {
        this.createToast(
          "Connection error",
          "Unable to connect with server. Please try again.",
          "danger"
        );
      }
    },

    async handleDelete() {
      try {
        if (
          await this.$bvModal.msgBoxConfirm(
            `Are you sure you want to delete ${this.selected.length} tag${
              this.selected.length <= 1 ? "" : "s"
            }?`
          )
        ) {
          for (const tag of this.selected) {
            await this.deleteTag(tag.slug);
          }

          this.getTags(this.currentPage);
        }
      } catch (err) {
        this.createToast("Error", "Please try again.", "danger");
      }
    },

    async deleteTag(slug) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/tag/${slug}`,
          {
            method: "DELETE",
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGEzNjk4MDk0MGIzZDNhYTg3ZWJhNTUiLCJlbWFpbCI6ImFkbWluQGFkbWluLnBsIiwiaXNQcml2aWxlZ2VkIjp0cnVlLCJsb2dpbiI6ImFkbWluIiwiaWF0IjoxNTc0MzY5MTA2fQ.uVWhvuhELdhV1qleRf89MMLJL5m_jVydIDraFRCsz_Y"
            }
          }
        );

        if (response.ok) {
          this.createToast(
            "Tag deletion",
            `Tag with slug '${slug}' was deleted successfully!`,
            "success"
          );
        } else {
          this.createToast(
            "Tag deletion",
            `Unable to delete Tag with slug '${slug}'!`,
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

    async getTags(page) {
      this.isBusy = true;
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/tag/page/${page.toString()}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGEzNjk4MDk0MGIzZDNhYTg3ZWJhNTUiLCJlbWFpbCI6ImFkbWluQGFkbWluLnBsIiwiaXNQcml2aWxlZ2VkIjp0cnVlLCJsb2dpbiI6ImFkbWluIiwiaWF0IjoxNTc0MzY5MTA2fQ.uVWhvuhELdhV1qleRf89MMLJL5m_jVydIDraFRCsz_Y"
            }
          }
        );

        if (response.ok) {
          const tags = await response.json();
          this.items = tags.docs;
          this.limit = tags.limit;
          this.total = tags.totalDocs;
          this.isBusy = false;
        } else {
          this.createToast(
            "Server error",
            "Unable to load tags. Please refresh the page.",
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
