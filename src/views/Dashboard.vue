<template>
  <div class="dashboard">
    <header class="topbar">
      <div>
        <h1>MonScenar.io</h1>
      </div>

      <div class="user-menu--horizontal">
        <img src="../assets/UserProfile.svg" alt="">
        <span class="user-menu--horizontal__name">Hello {{ user.username }}</span>
        <i class="fas fa-caret-down"></i>
        <div class="user-menu--horizontal__dropdown">
          <ul>
            <li>
              <router-link :to="{name: 'Logout'}">Se déconnecter</router-link>
            </li>
          </ul>
        </div>
      </div>
    </header>
    <section role="main">
      <loader v-if="displayLoader"></loader>
      <h2>Mes projets</h2>
      <div class="projects">
        <div class="projects__item" v-for="project of projects" v-bind:key="project.id">
          <router-link :to="{ name: 'Editor', params: { projectId: project.id }}">
            <h3>{{ project.name }}</h3>
          </router-link>
        </div>

        <div class="projects__item projects__add" v-on:click="onCreateProject">
          <span>+</span>
        </div>
      </div>
    </section>
  </div>
</template>

<script>
import Loader from "@/components/Loader";
import ApiService from "@/services/ApiService";

export default {
  name: 'Dashboard',
  components: {
    Loader
  },
  mounted() {
    let self = this;

    this.apiService = new ApiService();

    this.apiService.sendRequest('/project', 'GET').then(function (response) {
      self.projects = JSON.parse(response);
      self.displayLoader = false;
    });
  },
  computed: {
    user() {
      return this.$store.state.user;
    }
  },
  data: function () {
    return {
      projects: [],
      displayLoader: true,
      apiService: null
    }
  },
  methods: {
    onCreateProject() {
      let self = this;

      let project = {
        name: 'Nouveau projet'
      };

      this.apiService.sendRequest(
          '/project/',
          'POST',
          JSON.stringify(project)
      ).then(function (response) {
        let JSONResponse = JSON.parse(response);
        self.projects.push(JSONResponse);
        window.location = '/editor/' + JSONResponse.id;
      })
    }
  }
}
</script>

<style lang='scss' scoped='true'>
section[role=main] {
  padding: 1em;
  text-align: left;
  position: relative;

  h2 {
    font-size: 2em;
  }
}

.projects {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;

  &__item {
    height: 12em;
    width: 22em;
    margin: 1em;
    background: url('../assets/IllustrationSmall.svg');
    background-size: 90%;
    background-position: center;
    background-repeat: no-repeat;
    box-shadow: $shadow;
    border-radius: $radius;

    a {
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
      padding: 1em;

      height: 100%;
      text-decoration: none;
      color: $darkblue;
    }

    h3 {
      width: 70%;
      font-size: 2.2em;
      margin: 0;
    }
  }

  &__add {
    display: flex;
    justify-content: center;
    align-items: center;
    background: none;
    color: $orange;
    cursor: pointer;

    span {
      font-size: 8em;
      font-weight: 500;
      text-align: center;
    }
  }
}
</style>