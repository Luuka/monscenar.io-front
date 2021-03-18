<template>
  <div class="tab-bar" style="display: flex;flex-direction: row; flex-wrap: nowrap" v-on:mousewheel="onMouseWheel">
    <modal id="delete-sequence-confirm">
      <div class="delete-sequence-confirm__content">
        <i class="fas fa-exclamation-triangle text-red "></i>Supprimer la séquence est irréversible.

        <div>
          <button class="btn bg-red" v-on:click="onConfirmDeleteSequence()">Supprimer</button>
        </div>
      </div>
    </modal>

    <div class="button-tab" role="button"
         tabindex="0"
         v-for="(sequence, idx) of sequences"
         v-bind:key="idx"
         v-on:mouseup="select(idx)"
         :class="idx === editorCurrentTab ? 'active' : ''"
         v-on:drag="onDrag"
    >
      <input type="text" v-model="sequence.name" v-on:input="onTitleChange(idx)">
      <button class="delete-button" v-on:click="onDeleteSequence(sequence.id, idx)"><i class="fas fa-times"></i></button>
    </div>
    <button v-on:click="onCreateSequence" class="button-tab create-sequence" title="Ajouter une séquence">
      <i class="fas fa-plus"></i>
    </button>
  </div>
</template>

<script>
import ApiService from "@/services/ApiService";
import Modal from "@/components/Modal";

export default {
  name: 'EditorTabSelector',
  components: {
    Modal
  },
  mounted() {
    this.apiService = new ApiService();
  },
  computed: {
    sequences: function () {
      return this.$store.state.sequences;
    },
    project: function () {
      return this.$store.state.currentProject;
    },
    editorCurrentTab: function () {
      return this.$store.state.editorCurrentTab;
    }
  },
  data: function () {
    return {
      apiService: null,
      idToDelete: null,
      idxToDelete: null,
    }
  },
  methods: {
    select(idx) {
      this.$store.commit('setEditorCurrentTab', idx);
    },
    onTitleChange() {
      let sequences = this.sequences;
      this.$store.commit('setSequences', sequences);
    },
    onDrag(e) {
      e.dataTransfer.dropEffect = 'move';
    },
    onCreateSequence() {
      let self = this;

      console.log(this.sequences.length);

      let newSequence = {
        fountainText: '',
        name: 'Nouvelle séquence',
        orderIndex: this.sequences.length + 1
      };

      this.apiService.sendRequest(
          '/project/' + this.project.id + '/sequence/',
          'POST',
          JSON.stringify(newSequence)
      ).then(function (response) {
        self.sequences.push(JSON.parse(response));
      })
    },
    onDeleteSequence(id, idx) {
      this.$root.$emit('modal-delete-sequence-confirm-show');
      this.idToDelete = id;
      this.idxToDelete = idx;
    },
    onConfirmDeleteSequence() {
      let self = this;
      this.apiService.sendRequest(
          '/sequence/' + self.idToDelete,
          'DELETE',
      ).then(function () {
        self.sequences.splice(self.idxToDelete, 1);
        self.$root.$emit('modal-delete-sequence-confirm-close');
      });

      let newIdx = self.idxToDelete === 0 ? 0 : self.idxToDelete-1;
      self.select(newIdx);
    },
    onMouseWheel(e) {
      if(e.deltaY > 0) {
        if(this.editorCurrentTab < this.sequences.length-1){
          this.$store.commit('setEditorCurrentTab', this.editorCurrentTab+1);
        }
      } else {
        if(this.editorCurrentTab > 0) {
          this.$store.commit('setEditorCurrentTab', this.editorCurrentTab-1);
        }
      }
    }
  }
}
</script>

<style lang='scss' scoped='true'>

.tab-bar {
  max-width: 70vw;
}

.button-tab {
  display: flex;
  flex-direction: row;
  width: 8em;
  overflow: hidden;
  padding: .6em;
  box-sizing: border-box;
  margin: 0 .5em;
  border-radius: $radius $radius 0 0;
  outline: 0;
  text-overflow: ellipsis;
  color: white;
  background: $darkorange;
  font-size: 10px;
  font-weight: 600;
  margin-right: 0;
  list-style: none;
  border: 1px solid transparent;
  transition: $transition;

  .delete-button {
    display: none;
    background: transparent;
    border: none;
  }

  &.create-sequence {
    width: 4em;
    justify-content: center;
    align-items: center;
  }

  input {
    outline: none;
    background: $darkorange;
    border: none;
    transition: $transition;
    color: white;
  }

  &.active {
    border: 1px solid white;
    border-bottom: 1px solid transparent;
    background: white;
    color: $darkorange;
    width: auto;
    min-width: 100px;

    position: relative;

    .delete-button {
      display: block;
      position: absolute;
      right: 0;
      background: white;
    }

    input {
      outline: none;
      background: white;
      border: none;
      color: black;
    }
  }

  &:hover {
    border: 1px solid white;
    border-bottom: 1px solid transparent;
  }
}

.delete-sequence-confirm__content {
  i {
    margin-right: .2em;
  }
  button {
    margin-top: 2em;
    float: right;
  }
}
</style>