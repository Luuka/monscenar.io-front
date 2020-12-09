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

        <button v-on:click="onDeleteProject" class="topbar__button">
          <i class="fas fa-trash"></i> Supprimer
        </button>
      </div>
    </header>
    <section role="main">
      <aside class="sidebar">
        <div></div>
        <div class="user-menu">
          <img src="../assets/UserProfile.svg" alt="">
          <i class="fas fa-caret-down"></i>
          <div class="user-menu__dropdown">
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

export default {
  name: 'Editor',
  components: {
    FountainEditor,
    EditorTabSelector,
    Loader,
    Modal
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
    }
  }
}
</script>

<style lang='scss' scoped='true'>
.topbar {
  background: $orange;
  height: 4em;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 0 1em;


  &__button {
    background: $darkorange;
    border: none;
    outline: none;
    padding: .5em;
    color: white;
    border-radius: $radius;
    text-decoration: none;
    font-size: 13px;
    margin: 0 .2em;
    cursor: pointer;
    border: 1px solid transparent;
    transition: $transition;

    &:hover {
      border: 1px solid white;
    }

    i {
      margin-right: .2em;
    }
  }

  &__left {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;

    &--top {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
      margin-top: .1em;
    }

    &--bottom {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    i {
      font-size: 1.1em;
      margin-right: .3em;
    }
  }

  a {
    color: white;
  }

  .topbar__title input {
    background: $orange;
    border: 2px solid $orange;
    font-size: 1.3em;
    color: white;
    font-weight: bold;
    border-radius: $radius;

    &:focus {
      outline: none;
      border: 2px solid white;
    }
  }
}

h1 {
  color: white;
  margin: 0;
}

[role=main] {
  display: flex;
  flex-direction: row;
}

.sidebar {
  width: 5em;
  height: calc(100vh - 4em);
  background: white;
  box-shadow: $shadow;
  position: relative;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.user-menu {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  position: relative;

  &__name {
    font-weight: bold;
    color: white;
    font-size: 1.2em;
    margin-left: .2em;
  }

  a {
    text-decoration: none;
    color: black;
  }

  img {
    width: 80%;
  }

  i {
    color: white;
    margin-left: .5em;
  }

  &:hover &__dropdown {
    display: block;
  }

  &__dropdown {
    position: absolute;
    display: none;
    left: 100%;
    right: 0;
    background: white;
    box-shadow: $shadow;
    padding: .3em 1em;
    width: calc(101% + 2em);
    box-sizing: content-box;

    ul, li {
      list-style: none;
      margin: 0;
      padding: 0;
    }
  }
}

.editor-tabs {
  width: calc(100vw - 5em);
}

.editor-tab {
  display: none;
  &--current {
    display: block;
  }
}

i.fa-spinner {
  animation: rotating 2s linear infinite;
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