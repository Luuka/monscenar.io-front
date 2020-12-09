<template>
  <section class="editor">
    <div class="editor__toolbar">
      <button v-on:click="onBold" class="bold" title="Gras">B</button>
      <button v-on:click="onItalic" class="italic" title="Italique">I</button>
      <button v-on:click="onUnderline" class="underline" title="Souligner">U</button>
      <button v-on:click="onCenter" class="underline" title="Centrer">
        <i class="fas fa-align-center"></i>
      </button>
      <button v-on:click="onIntSceneStart" title="Créer une scène intérieure">INT.</button>
      <button v-on:click="onExtSceneStart" title="Créer une scène extérieure">EXT.</button>
      <button v-on:click="onTransition" title="Créer une transition">TO:</button>
    </div>
    <section class="editor__cols">
      <textarea
          ref="editor"
          class="col"
          v-on:input='onInput()'
          v-on:change='onInput()'
          v-model='fountainText'
          v-on:scroll="onTextareaScroll()"
      ></textarea>
      <div class="col preview script" ref="preview">
        <div v-html="fountainHtml.title_page" class="title-page"></div>
        <div v-html="fountainHtml.script" class="page"></div>
      </div>
    </section>
  </section>
</template>

<script>

import fountain from '../libs/fountain.min.js';
import ActorService from "@/services/ActorService";

export default {
  name: 'fountainEditor',
  props: ['sequenceIdx'],
  data: () => {
    return {
      fountainText: '',
      fountainHtml: '',
      scrollPreview: false,
      scrollEditor: false
    }
  },
  mounted: function() {
    let self = this;
    this.fountainText = this.sequence.fountainText;

    if(this.fountainText !== '') {
      fountain.parse(this.fountainText, true, function (result){
        if (result.html !== undefined) {
          self.fountainHtml = result.html;
        }
      });
    }

  },
  computed: {
    sequence: function () {
      return this.$store.state.sequences[this.sequenceIdx];
    },
  },
  methods: {
    onInput: function() {
      let self = this
      if(this.fountainText !== '') {
        fountain.parse(this.fountainText, true, function (result){
          if (result.html !== undefined) {
            self.fountainHtml = result.html;

            let actorService = new ActorService();
            let actors = actorService.parseTokens(result.tokens);
            console.log(actors);
          }
        });
      } else {
        self.fountainHtml = '';
      }

      this.sequence.fountainText = self.fountainText;

      this.$store.commit('setSequence', {
        idx:this.sequenceIdx,
        sequence: this.sequence
      });
    },
    onUnderline() {
      let textarea = this.$refs.editor;
      let selectionStart = textarea.selectionStart;
      let selectionEnd = textarea.selectionEnd;

      if(selectionEnd-selectionStart > 0) {
        this.applyTextStyle('_');
      } else {
        let start = this.$refs.editor.selectionStart;

        this.insertTextAtSelection('__\r\n');

        this.$refs.editor.focus();
        this.$refs.editor.selectionEnd = start+1;
      }
    },
    onCenter() {
      let textarea = this.$refs.editor;
      let selectionStart = textarea.selectionStart;
      let selectionEnd = textarea.selectionEnd;

      if(selectionEnd-selectionStart > 0) {
        this.applyTextStyle('>', '<');
      } else {
        let start = this.$refs.editor.selectionStart;

        this.insertTextAtSelection('><\r\n');

        this.$refs.editor.focus();
        this.$refs.editor.selectionEnd = start+1;
      }
    },
    onItalic() {
      let textarea = this.$refs.editor;
      let selectionStart = textarea.selectionStart;
      let selectionEnd = textarea.selectionEnd;

      if(selectionEnd-selectionStart > 0) {
        this.applyTextStyle('*');
      } else {
        let start = this.$refs.editor.selectionStart;

        this.insertTextAtSelection('**\r\n');

        this.$refs.editor.focus();
        this.$refs.editor.selectionEnd = start+1;
      }
    },
    onBold() {
      let textarea = this.$refs.editor;
      let selectionStart = textarea.selectionStart;
      let selectionEnd = textarea.selectionEnd;

      if(selectionEnd-selectionStart > 0) {
        this.applyTextStyle('**');
      } else {
        let start = this.$refs.editor.selectionStart;

        this.insertTextAtSelection('****\r\n');

        this.$refs.editor.focus();
        this.$refs.editor.selectionEnd = start+2;
      }
    },
    onIntSceneStart() {
      this.insertTextAtSelection('\r\n\r\nINT. \r\n\r\n');
      this.triggerEditorChange();
    },
    onExtSceneStart() {
      this.insertTextAtSelection('\r\n\r\nEXT. \r\n\r\n');
      this.triggerEditorChange();
    },
    onTransition() {
      this.insertTextAtSelection('\r\n\r\nTRANSITION TO: \r\n\r\n');
      this.triggerEditorChange();
    },
    insertTextAtSelection(text) {
      let textarea = this.$refs.editor;

      let start = textarea.selectionStart === 0 ? 0 : textarea.selectionStart - 1;

      let before = textarea.value.slice(0, start);
      let after = textarea.value.slice(textarea.selectionStart, textarea.value.length);

      this.$refs.editor.value = [before, text , after].join('');
    },
    applyTextStyle(tag, endTag = null){

      endTag = endTag == null ? tag : endTag;

      let textarea = this.$refs.editor;
      let selectionStart = textarea.selectionStart;
      let selectionEnd = textarea.selectionEnd;

      let before = textarea.value.slice(0, selectionStart);
      let middle = textarea.value.slice(selectionStart, selectionEnd);
      let after = textarea.value.slice(selectionEnd, textarea.value.length);

      this.$refs.editor.value = [before, tag, middle, endTag, after].join('');
      this.triggerEditorChange();
    },
    triggerEditorChange(){
      let event = new Event('input');
      this.$refs.editor.dispatchEvent(event);
    },
    onTextareaScroll(){
      this.scrollEditor = true;
      if(!this.scrollPreview){
        let scrollHeight = this.$refs.editor.scrollHeight
        let scroll = this.$refs.editor.scrollTop

        let textareaScroll = (scroll)/scrollHeight*100;

        let preview = this.$refs.preview;
        let previewScrollHeight = preview.scrollHeight

        this.$refs.preview.scrollTop = (textareaScroll * (previewScrollHeight) / 100);
      }
      this.scrollEditor = false;
    }
  },
}
</script>

<style lang="scss" scoped>
.title-page {
  text-align: center;
}

.editor {
  display: flex;
  flex-direction: column;
  height: calc(100vh - 6.5em);

  &__cols {
    display: flex;
    flex-direction: row;
  }

  &__toolbar {
    display: flex;
    flex-direction: row;
    justify-content: flex-start ;
    box-shadow: 0 2px 3px 1px rgba(0, 0, 0, 0.1);
    position: relative;
    padding: .2em 1em;

    button {
      margin: 0 .2em;
      background: $darkorange;
      border-radius: $radius;
      color: white;
      border: none;
      outline: 0;
      padding: .3em .5em;
      transition: $transition;

      &:hover {
        background: $orange;
      }

      &.bold {
        font-weight: bold;
      }

      &.italic {
        font-style: italic;
      }

      &.underline {
        text-decoration: underline;
      }
    }
  }
}

.col {
  width: 50vw;
  height: calc(100vh - 6.5em);
  overflow-y: scroll;
  font-size: 12pt;
  border: none;
  resize: none;
  outline: none;
}

textarea {
  font-family: 'Courier Prime', monospace;
  font-size: 10pt;
  padding: .5em;
}

.preview {
  font-family: 'Courier Prime', monospace;
  font-size: 12pt;
  padding: 0 2rem;
}
</style>