<template>
  <div class="preview">
    <loader v-if="displayLoader"></loader>
    <header class="topbar topbar__notab">
      <div class="topbar__left">
        <div class="topbar__left--top">
          <router-link :to="{ name: 'Editor', params: { projectId: id }}">
            <i class="fas fa-arrow-left"></i>
          </router-link>
          <div class="topbar__title">
            <h1>{{ project.name }}</h1>
          </div>
        </div>
      </div>
      <div class="topbar__right">

      </div>
    </header>
    <section role="main">
      <div class="script a4 dpi100" ref="preview">
        <div class="page title-page" v-if="fountainHtml.title_page !== ''" v-html="fountainHtml.title_page"></div>
      </div>
      <div class="page-hover">
        <table v-if="fountainHtml.script !== undefined">
          <tr v-for="(child, idx) of fountainHtml.script.children" :key="'note'+idx">
            <td v-html="child.outerHTML" v-on:click="onComment(idx)" :data-idx="idx" class="script a4 dpi100"></td>
            <td>
              <template v-if="comments[idx] != undefined">
                <comment v-for="(comment, commentIdx) of comments[idx]" :json="comment" :project-id="id" :version-id="version.id" :key="commentIdx"></comment>
              </template>
            </td>
          </tr>
        </table>
      </div>
    </section>

    <modal id="add-comment-modal">
      <div class="add-comment-modal__content">
        <div v-if="currentBlockIdx !== null">
          <span v-html="fountainHtml.script.children[currentBlockIdx].outerHTML"></span>
        </div>
        <div>
          <form action="" @submit="onCreateComment">
            <label for="username">Nom d'utilisateur publique</label>
            <input id="username" name="username" type="text" :value="user.username"><br>

            <label for="text">Commentaire</label>
            <textarea name="text" id="text" cols="30" rows="10" required></textarea><br>

            <input type="hidden" name="blockIndex" :value="currentBlockIdx">

            <button type="submit">Enregistrer</button>
          </form>
        </div>
      </div>
    </modal>
  </div>
</template>

<script>
import ApiService from "@/services/ApiService";
import Loader from "@/components/Loader";
import fountain from '../libs/fountain.min.js';
import Comment from "@/components/Comment";
import Modal from "@/components/Modal";

export default {
  name: 'Preview',
  components: {
    Loader,
    Comment,
    Modal
  },
  mounted() {
    let self = this;
    this.id = this.$route.params.projectId;
    this.versionNumber = this.$route.params.versionNumber
    this.apiService= new ApiService();

    this.apiService.sendRequest('/project/' + this.id + '/version/' + this.versionNumber, 'GET').then(function (response){
      self.version = JSON.parse(response);
      self.render(self.version.fountainText);
    });

    this.apiService.sendRequest('/project/' + this.id + '/version/' + this.versionNumber + '/comments', 'GET').then(function (response){
      self.comments = JSON.parse(response);
    });
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
      versionNumber: null,
      version: null,
      displayLoader: true,
      fountainHtml: '',
      tokens: [],
      comments: {},
      currentBlockIdx: null
    }
  },
  methods: {
    render(fountainText) {
      let self = this;

      fountain.parse(fountainText, true, function (result){
        if (result.html !== undefined) {
          self.tokens = result.tokens;

          let node = document.createElement('div');
          node.innerHTML = result.html.script;

          self.fountainHtml = {
            title_page: result.html.title_page,
            script: node
          };

          self.displayLoader = false;
        }
      });
    },
    onComment(idx) {
      this.currentBlockIdx = idx;
      this.$root.$emit('modal-add-comment-modal-show');
    },
    onCreateComment(e){
      let self = this;

      e.preventDefault();
      this.$root.$emit('modal-add-comment-modal-close');

      this.apiService.sendRequest(
          '/project/' + this.id + '/version/' + this.versionNumber + '/comment',
          'POST',
          JSON.stringify(this.serializeForm(e.target))
      ).then(function (response){
        let comment = JSON.parse(response);
        let block = self.comments[comment.blockIndex];
        if(block == undefined) {
          block = [];
        }

        block.push(comment);

        self.$set(self.comments,comment.blockIndex, block);
      });

      this.currentBlockIdx = null;
    },
    serializeForm(form) {
      var obj = {};
      var formData = new FormData(form);
      for (var key of formData.keys()) {
        obj[key] = formData.get(key);
      }
      return obj;
    }
  }
}
</script>

<style lang='scss' scoped='true'>

[role=main] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-start;
  padding-left: 1em;
}

.page {
  box-shadow: $shadow;
  margin: 1em auto;
  padding: 100px 100px 100px 100px;
}

.page.title-page {
  text-align: center;
  align-items: center;
}

.script.a4.dpi72 { width: 595px; } /* us letter - 72 dpi - 595px x 842px - margins: 1" 1" 1" 1.5" */
.script.a4.dpi100 { width: 827px; } /* us letter - 72 dpi - 827px x 1169px - margins: 1" 1" 1" 1.5" */
.script.a4.dpi150 {  width: 1250px; } /* us letter - 72 dpi - 1250px x 1754px - margins: 1" 1" 1" 1.5" */

.script.a4.dpi72 .page { min-height: 842px; }
.script.a4.dpi100 .page { min-height: 1169px; }
.script.a4.dpi150 .page { min-height: 1754px; }

i.fa-spinner {
  animation: rotating 2s linear infinite;
}

.page-hover {
  padding: 100px 0 100px 0;
  box-shadow: 0 10px 10px 2px rgba(0, 0, 0, 0.1);
  width: 100%;
}

.page-hover td:first-child {
  box-shadow: 0 10px 10px 2px rgba(0, 0, 0, 0.1);
  padding: 0 100px 0 100px;
  background: white;
}

.page-hover td:nth-child(2) {
  padding: 0 1em;
}

.page-hover td:hover:first-child {
  background: lightgray;
}

.page-hover table {
  border-collapse: collapse;
  width: 100%;
}

.page-hover tr {

}

.add-comment-modal__content {
  display: flex;

  & > div {
    width: 50%;
    margin: .2em;

    &:first-child {
      font-family: 'Courier Prime', monospace;
      font-size: 12pt;
      text-align: center;
    }
  }

  label {
    font-weight: bold;
  }

  input {
    margin-bottom: 1em;
    height: 1.2em;
    font-size: .8em;
    padding: .8em;
    border: .2rem solid $orange;
    border-radius: $radius;
    width: 100%;
  }

  button {
    background: white;
    border: .2rem solid $orange;
    border-radius: $radius;
    width: 100%;
  }

  textarea {
    border: .2rem solid $orange;
    border-radius: $radius;
    width: 100%;
  }
}
</style>