<template>
  <section class="editor">
    <textarea
        ref="editor"
        class="col"
        v-on:input='onInput()'
        v-model='fountainText'
        v-on:scroll="onTextareaScroll()"
    >
    </textarea>
    <div class="col preview" ref="preview">

      <div class="pageTitle" v-if="headers !== null">
        <div class="centerTitle">
          <h1 class='center' v-if="headers['Title']" v-html="headers['Title'].join('<br>')"></h1>

          <h3 class='center' v-if="headers['Credit']" v-html="headers['Credit'].join('<br>')"></h3>
          <h3 class='center' v-if="headers['Author']" v-html="headers['Author'].join('<br>')"></h3>
          <h3 class='center' v-if="headers['Source']" v-html="headers['Source'].join('<br>')"></h3>

          <br><br>
          <h4 class='center' v-if="headers['Contact']">Contact</h4>
          <div class="center" v-if="headers['Contact']" v-html="headers['Contact'].join('<br>')"></div>
        </div>
      </div>

      <hr class="pagebreak">

      <div v-for="(block, idx) of jsonFountain.blocks" :key="idx" class="block">
        <div class='block-col' v-if="idx < jsonFountain.blocks.length-1 && jsonFountain.blocks[idx+1].isDual">
          <div>
        <span v-for="(element, elementIdx) of block.elements" :key="elementIdx">
<pre
    v-if="element.type !== 'PAGEBREAK'"
    :class="getClassFromType(element.type) + ' ' + elementFormat(element.text)"
    v-html="$options.filters.format(element.text)"
></pre>
        <hr class="pagebreak" v-if="element.type === 'PAGEBREAK'"/>
        </span>
          </div>

          <div>
        <span v-for="(element, elementIdx) of jsonFountain.blocks[idx+1].elements" :key="elementIdx">
  <pre
      v-if="element.type !== 'PAGEBREAK'"
      :class="getClassFromType(element.type) + ' ' + elementFormat(element.text)"
      v-html="$options.filters.format(element.text)"
  ></pre>
          <hr class="pagebreak" v-if="element.type === 'PAGEBREAK'"/>
        </span>
          </div>
        </div>

        <template v-if="idx < jsonFountain.blocks.length-1 && !jsonFountain.blocks[idx+1].isDual && !jsonFountain.blocks[idx].isDual">
        <span v-for="(element, elementIdx) of block.elements" :key="elementIdx">
<pre
    v-if="element.type !== 'PAGEBREAK'"
    :class="getClassFromType(element.type) + ' ' + elementFormat(element.text)"
    v-html="$options.filters.format(element.text)"
></pre>
      <hr class="pagebreak" v-if="element.type === 'PAGEBREAK'"/>
    </span>
        </template>
      </div>
    </div>
  </section>
</template>

<script>

import { Fountain, FountainBlock, FountainElement } from '../libs/Fountain.js';

export default {
  name: 'fountainEditor',
  props: {
  },
  data: () => {
    return {
      fountainParser: new Fountain(),
      fountainText: '',
      scrollPreview: false,
      scrollEditor: false,
      headers: null,
    }
  },
  mounted: function() {

  },
  computed: {
    jsonFountain: function(){
      return this.fountainParser.toJSON();
    }
  },
  methods: {
    onInput: async function() {
      this.fountainParser.parse(this.fountainText);
      this.headers = {...this.fountainParser.headers};
    },
    onTextareaScroll: function(){
      this.scrollEditor = true;
      if(!this.scrollPreview){

        let height = this.$refs.editor.scrollHeight
        let scroll = this.$refs.editor.scrollTop
        let clientHeight = this.$refs.editor.clientHeight

        this.$refs.preview.scrollTop = (scroll*this.$refs.preview.scrollHeight/height)*1.25
      }
      this.scrollEditor = false;
    },
    getClassFromType: function(type){
      switch(type) {
        case FountainElement.TYPE_TRANSITION:
          return 'transition'
        case FountainElement.TYPE_SCENE_HEADING:
          return 'scene-heading'
        case FountainElement.TYPE_CHARACTER:
          return 'character'
        case FountainElement.TYPE_PARENTHETICAL:
          return 'parenthetical'
        case FountainElement.TYPE_DIALOGUE:
          return 'dialogue'
        case FountainElement.TYPE_DUAL_DIALOGUE:
          return 'dual-dialogue'
        case FountainElement.TYPE_PAGEBREAK:
          return 'pagebreak'
      }

      return 'text';
    },
    elementFormat: function(text) {

      const centerRegex = RegExp(/>(.*)</gim);

      if(centerRegex.test(text)){
        return 'center';
      }

      return '';
    }

  },
  filters: {
    format: function(text){
      const htmlText = text
          .replace(/={3}=*/gim, '<hr class="pagebreak"/>')
          .replace(/>(.*)</gim, '$1')
          .replace(/>(.*)/gim, '$1')
          .replace(/\^(.*)/gim, '$1')
          .replace(/\.{1}(.*)/gim, '$1')
          .replace(/\*\*(.*)\*\*/gim, '<b>$1</b>')
          .replace(/\*(.*)\*/gim, '<i>$1</i>')
          .replace(/_(.*)_/gim, '<span style="text-decoration:underline">$1</span>')
      return htmlText.trim()
    }
  }
}
</script>

<style scoped>
.pageTitle {

  display: flex;
  flex-direction: column;
  justify-content:center;
  align-items:center;
}

.pageTitle h4 {
  margin:0;
}

.editor {
  display: flex;
  flex-direction: row;
  max-height: 90vh;
}

.col {
  width: 50vw;
  height: 90vh;
  overflow-y: scroll;
  font-size: 12pt;
  border: none;
  resize: none;
  outline: none;
}

textarea {
  font-family: 'Courier Prime', monospace;
  font-size: 12pt;
}

.preview {
  font-family: 'Courier Prime', monospace;
  padding: 0 2rem;
}

.block {
  margin: 1.5rem 0;
  padding: .2rem;
}

.block-col {
  display: flex;
  flex-direction: row;
  justify-content: space-around;
  align-items: center;
}

.block-col > div {
  width: 50%;
}

.block:hover {
  background: #EFEFEF;
}

.block pre {
  font-family: 'Courier Prime', monospace;
  font-size: 12pt;
  padding:0;
  margin:0;

  max-width: 100%;
  white-space: pre-wrap;
}

.transition {
  text-align: right;
}

.scene-heading {
  font-weight: bold;
}

.character {
  text-align: center;
}

.dialogue {
  text-align: center;
}

.parenthetical {
  text-align: center;
  position: relative;
  left: -1rem;
}

.center {
  text-align: center;
}

.underline {
  text-decoration: underline;
}
</style>