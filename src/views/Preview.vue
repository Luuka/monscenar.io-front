<template>
  <div class="preview">
    <loader v-if="displayLoader"></loader>
    <header class="topbar">
      <div class="topbar__left">
        <div class="topbar__left--top">
          <router-link :to="{ name: 'Editor', params: { projectId: project.id }}">
            <i class="fas fa-arrow-left"></i>
          </router-link>
          <div class="topbar__title">
            <h1>{{ project.name }}</h1>
          </div>
        </div>
      </div>
      <div class="topbar__right">
        <button v-on:click="onExport" class="topbar__button">
          <i class="fas fa-file-pdf" v-if="!exportInProgress"></i>
          <i class="fas fa-spinner" v-if="exportInProgress"></i>
          Exporter en PDF
        </button>
        <a id="target"></a>
      </div>
    </header>
    <section role="main">
      <div class="script a4 dpi100" ref="preview">
        <div class="page title-page" v-if="fountainHtml.title_page !== ''" v-html="fountainHtml.title_page"></div>
        <div class="page" v-html="fountainHtml.script"></div>
      </div>
    </section>
  </div>
</template>

<script>
import ApiService from "@/services/ApiService";
import Loader from "@/components/Loader";
import fountain from '../libs/fountain.min.js';
import html2pdf from 'html2pdf.js';

export default {
  name: 'Preview',
  components: {
    Loader
  },
  mounted() {
    let self = this;
    this.id = this.$route.params.projectId;
    this.apiService= new ApiService();

    this.apiService.sendRequest('/project/' + this.id, 'GET').then(function (response){
      self.$store.commit('setCurrentProject', JSON.parse(response));
      self.loadSequences();
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
      displayLoader: true,
      fountainHtml: '',
      tokens: [],
      exportInProgress: false
    }
  },
  methods: {
    loadSequences() {
      let self = this;

      this.apiService.sendRequest('/project/' + this.id + '/sequence', 'GET').then(function (response){
        self.$store.commit('setSequences', JSON.parse(response));
        self.displayLoader = false;
        self.render();
      });
    },
    render() {
      let self = this;
      let fountainText = '';
      this.sequences.forEach((sequence) => {
        fountainText += '\r\n\r\n' +sequence.fountainText;
      });

      fountain.parse(fountainText, true, function (result){
        if (result.html !== undefined) {
          console.log(result);

          self.fountainHtml = result.html;
          self.tokens = result.tokens;
        }
      });
    },
    onExport() {
      let self = this;

      let content = JSON.stringify({
        title: this.project.name,
        titlePage: this.fountainHtml.title_page,
        tokens: this.tokens
      });

      this.exportInProgress = true;
      this.apiService.sendBlobRequest('/export/pdf', 'POST', content).then((response) => {
        let el = document.getElementById("target");
        el.href = window.URL.createObjectURL(response);
        el.download = this.project.name+'.pdf';
        el.click();
        self.exportInProgress = false;
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
    cursor: pointer;

    i {
      margin-right: .2em;
    }
  }

  &__left {
    display: flex;
    height: 100%;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;

    h1 {
      color: white;
      margin: 0;
      font-size: 1.5em;
    }

    &--top {
      display: flex;
      flex-direction: row;
      justify-content: flex-start;
      align-items: center;
    }

    &--bottom {
      flex-grow: 1;
      display: flex;
      flex-direction: column;
      justify-content: flex-end;
    }

    i {
      font-size: 1.3em;
      margin-right: .3em;
    }
  }

  a {
    color: white;
  }
}

[role=main] {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
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
</style>