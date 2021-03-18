<template>
  <div class="editor" >
    <modal id="delete-project-confirm">
        <div class="delete-project-confirm__content">
         <i class="fas fa-exclamation-triangle text-red "></i>Supprimer le projet est irréversible.
          <div>
            <button class="btn bg-red" v-on:click="onConfirmDeleteProject">Supprimer</button>
          </div>
        </div>
    </modal>
    <loader v-if="displayLoader"></loader>
    <header class="topbar">
      <div class="topbar__left">
        <div class="topbar__left--top">
          <router-link :to="{ name: 'Dashboard'}">
            <i class="fas fa-arrow-left"></i>
          </router-link>
          <div class="topbar__title">
            <input type="text" v-model="project.name" v-on:input="onProjectNameChange">
          </div>
        </div>
        <div class="topbar__left--bottom">
          <editor-tab-selector></editor-tab-selector>
        </div>
      </div>
      <div class="topbar__right">
        <button v-on:click="onSave" class="topbar__button">
          <i class="fas fa-spinner" v-if="isSaving"></i>
          <i class="fas fa-save" v-if="!isSaving"></i>
          Enregistrer
        </button>

        <router-link class="topbar__button" :to="{ name: 'Preview', params: { projectId: project.id }}">
          <i class="fas fa-glasses"></i> Mode lecture
        </router-link>

        <button class="topbar__button" style="text-decoration: line-through" v-on:click="onFreeze()">
          <i class="fas fa-tag"></i> Figer une version
        </button>

        <button v-on:click="onDeleteProject" class="topbar__button">
          <i class="fas fa-trash"></i> Supprimer
        </button>
      </div>
    </header>
    <section role="main">
      <aside class="sidebar">
        <sidebar-panel>
          <template slot="actors" style="padding: 1em;">
            <actors-table></actors-table>
          </template>
          <template slot="scenes">
            <scenes-table></scenes-table>
          </template>
          <template slot="versions">
            <versions-table :project="project"></versions-table>
          </template>
        </sidebar-panel>
        <div class="user-menu--vertical">
          <img src="../assets/UserProfile.svg" alt="">
          <i class="fas fa-caret-down"></i>
          <div class="user-menu--vertical__dropdown">
            <ul>
              <li>
                <router-link :to="{name: 'Logout'}">Se déconnecter</router-link>
              </li>
            </ul>
          </div>
        </div>
      </aside>
      <div class="editor-tabs">
       <div
           v-for="(sequence, idx) of sequences"
           v-bind:key="project.id+'-'+sequence.id"
           :class="idx === editorCurrentTab ? 'editor-tab--current' : 'editor-tab'"
       >
         <fountain-editor :sequenceIdx="idx"></fountain-editor>
       </div>
      </div>
    </section>
  </div>
</template>

<script>
import FountainEditor from "@/components/FountainEditor";
import EditorTabSelector from "@/components/EditorTabSelector";
import Loader from "@/components/Loader";
import ApiService from "@/services/ApiService";
import Modal from "@/components/Modal";
import SidebarPanel from "@/components/SidebarPanel";
import ActorsTable from "@/components/ActorsTable";
import ScenesTable from "@/components/ScenesTable";
import VersionsTable from "@/components/VersionsTable";

export default {
  name: 'Editor',
  components: {
    FountainEditor,
    EditorTabSelector,
    Loader,
    Modal,
    SidebarPanel,
    ActorsTable,
    ScenesTable,
    VersionsTable
  },
  created() {
    let self = this;
    this.id = this.$route.params.projectId;
    this.apiService= new ApiService();

    this._keyListener = function(e) {
      if (e.key === "s" && (e.ctrlKey || e.metaKey)) {
        e.preventDefault(); // present "Save Page" from getting triggered.

        this.onSave();
      }
    };

    document.addEventListener('keydown', this._keyListener.bind(this));

    this.apiService.sendRequest('/project/' + this.id, 'GET').then(function (response){
      self.$store.commit('setCurrentProject', JSON.parse(response));
      self.loadSequences();
    });

    this.apiService.sendRequest('/project/' + this.id+'/versions', 'GET').then(function (response){
      self.$store.commit('setVersions', JSON.parse(response));
    });
  },
  beforeDestroy() {
    this.onSave();
    this.id = null;
    document.removeEventListener('keydown', this._keyListener);
  },
  computed: {
    user() {
      return this.$store.state.user;
    },
    project() {
      return this.$store.state.currentProject;
    },
    sequences() {
      return this.$store.state.sequences;
    },
    currentSequence() {
      return this.$store.state.sequences[this.$store.state.editorCurrentTab];
    },
    editorCurrentTab() {
      return this.$store.state.editorCurrentTab;
    },
  },
  data: function () {
    return {
      id: null,
      displayLoader: true,
      apiService: null,
      isSaving: false,
    }
  },
  methods: {
    loadSequences: function () {
      let self = this;

      this.apiService.sendRequest('/project/' + this.id + '/sequence', 'GET').then(function (response){
        self.$store.commit('setSequences', JSON.parse(response));
        self.displayLoader = false;
      });
    },
    onProjectNameChange: function () {
      this.$store.commit('setCurrentProject', this.project);
    },
    onSave: function () {
      this.isSaving = true;
      let self = this;

      let saved = 0;
      let saveTarget = self.sequences.length + 1;

      this.apiService.sendRequest(
          '/project/'+this.project.id,
          'PUT',
          JSON.stringify(this.project)
      ).then(function (response){
        saved++;
        if(saved === saveTarget) {
          self.isSaving = false;
        }
      });

      this.sequences.forEach((sequence, idx) => {
        this.apiService.sendRequest(
            '/sequence/'+sequence.id,
            'PUT',
            JSON.stringify(sequence)
        ).then(function (response){
          saved++;
          if(saved === saveTarget) {
            self.isSaving = false;
          }
        });
      });
    },
    onDeleteProject(){
      this.$root.$emit('modal-delete-project-confirm-show');
    },
    onConfirmDeleteProject(){
      let self = this;
      this.apiService.sendRequest(
          '/project/'+self.project.id,
          'DELETE',
      ).then(function (response){
        window.location = '/dashboard';
      });
    },
    onFreeze(){
      let self = this;

      let fountainText = '';
      this.sequences.forEach((sequence) => {
        fountainText += sequence.fountainText+'\r\n';
      })

      this.apiService.sendRequest(
          '/project/'+this.project.id+'/version',
          'POST',
          fountainText
      ).then(function (response){
        self.$store.commit('setVersions', JSON.parse(response));
      });
    }
  }
}
</script>

<style lang='scss' scoped='true'>
h1 {
  color: white;
  margin: 0;
}

[role=main] {
  display: flex;
  flex-direction: row;
}

.delete-project-confirm__content {
  i {
    margin-right: .2em;
  }
  button {
    margin-top: 2em;
    float: right;
  }
}
</style>