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
                title="Create user"
                v-b-modal.create-user
                v-b-tooltip
              >
                <font-awesome-icon icon="plus" class="mr-1" />Create
              </b-button>
              <b-modal id="create-user" title="Create user" @ok="createUser">
                <b-form id="create-user-form" class="my-3" @submit.stop.prevent>
                  <b-form-group
                    id="login-group"
                    label="Login:"
                    label-for="login"
                  >
                    <b-form-input
                      id="login"
                      name="login"
                      required
                      placeholder="Enter login"
                    />
                  </b-form-group>
                  <b-form-group
                    id="email-group"
                    label="Email:"
                    label-for="email"
                  >
                    <b-form-input
                      id="email"
                      name="email"
                      required
                      placeholder="Enter email"
                    />
                  </b-form-group>
                  <b-form-group
                    id="password-group"
                    label="Password:"
                    label-for="password"
                  >
                    <b-form-input
                      type="password"
                      id="password"
                      name="password"
                      required
                      placeholder="Enter password"
                    />
                  </b-form-group>
                  <b-form-checkbox id="is-privileged" name="isPrivileged"
                    >Is privileged</b-form-checkbox
                  >
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
                @change="getUsers"
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
            <template v-slot:cell(isPrivileged)="data">
              <b-form-checkbox
                disabled
                :id="`checkbox-${data.item._id}`"
                v-model="data.item.isPrivileged"
                :name="`checkbox-${data.item._id}`"
              ></b-form-checkbox>
            </template>
            <template v-slot:cell(actions)="data">
              <b-button
                class="text-nowrap"
                size="sm"
                variant="info"
                @click="$bvModal.show(`edit-user-${data.item._id}`)"
              >
                <font-awesome-icon icon="edit" />Edit
              </b-button>
              <b-modal
                :id="`edit-user-${data.item._id}`"
                title="Edit user"
                @ok="editUser($event, data.item._id)"
              >
                <b-form
                  :id="`edit-user-${data.item._id}-form`"
                  class="my-3"
                  @submit.stop.prevent
                >
                  <b-form-group
                    id="login-group"
                    label="Login:"
                    label-for="login"
                  >
                    <b-form-input
                      id="login"
                      name="login"
                      required
                      placeholder="Enter login"
                      :value="data.item.login"
                    />
                  </b-form-group>
                  <b-form-group
                    id="email-group"
                    label="Email:"
                    label-for="email"
                  >
                    <b-form-input
                      id="email"
                      name="email"
                      required
                      placeholder="Enter email"
                      :value="data.item.email"
                    />
                  </b-form-group>
                  <b-form-checkbox
                    id="is-privileged"
                    name="isPrivileged"
                    :checked="data.item.isPrivileged"
                    >Is privileged</b-form-checkbox
                  >
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
                title="Delete selected users"
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
                @change="getUsers"
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
        { key: "login", sortable: true },
        { key: "email", sortable: true },
        {
          key: "isPrivileged",
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
      total: 1
    };
  },

  async created() {
    await this.getUsers(this.currentPage);
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
    async createUser(event) {
      const form = document.getElementById("create-user-form");
      const body = this.createBody(form);

      try {
        const response = await fetch("http://localhost:3000/api/v1/user", {
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
            "User creation",
            "User created successfully!",
            "success"
          );

          await this.getUsers(this.currentPage);
        } else {
          this.createToast("Creating user", "User creation failed!", "danger");
        }
      } catch (err) {
        this.createToast("Creating user", "User creation failed!", "danger");
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
    async editUser(event, id) {
      const form = document.getElementById(`${event.componentId}-form`);
      const body = this.createBody(form);

      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/user/${id}`,
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
            "User edition",
            "User edited successfully!",
            "success"
          );

          await this.getUsers(this.currentPage);
        } else {
          this.createToast("Editing user", "User edition failed!", "danger");
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
            `Are you sure you want to delete ${this.selected.length} user${
              this.selected.length <= 1 ? "" : "s"
            }?`
          )
        ) {
          for (const user of this.selected) {
            await this.deleteUser(user._id);
          }

          this.getUsers(this.currentPage);
        }
      } catch (err) {
        this.createToast("Error", "Please try again.", "danger");
      }
    },

    async deleteUser(id) {
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/user/${id}`,
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
            "User deletion",
            `User with id '${id}' was deleted successfully!`,
            "success"
          );
        } else {
          this.createToast(
            "User deletion",
            `Unable to delete user with id '${id}'!`,
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

    async getUsers(page) {
      this.isBusy = true;
      try {
        const response = await fetch(
          `http://localhost:3000/api/v1/user/page/${page.toString()}`,
          {
            headers: {
              Authorization:
                "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1ZGEzNjk4MDk0MGIzZDNhYTg3ZWJhNTUiLCJlbWFpbCI6ImFkbWluQGFkbWluLnBsIiwiaXNQcml2aWxlZ2VkIjp0cnVlLCJsb2dpbiI6ImFkbWluIiwiaWF0IjoxNTc0MzY5MTA2fQ.uVWhvuhELdhV1qleRf89MMLJL5m_jVydIDraFRCsz_Y"
            }
          }
        );

        if (response.ok) {
          const users = await response.json();
          this.items = users.docs;
          this.limit = users.limit;
          this.total = users.totalDocs;
          this.isBusy = false;
        } else {
          this.createToast(
            "Server error",
            "Unable to load users. Please refresh the page.",
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
