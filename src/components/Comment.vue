<template>
  <div class="comment">
    <header v-on:click="toggle">
      <strong>{{ json.username }}</strong>
      <div>
        <span>{{ json.createdAt }}</span>
        <button class="btn" v-on:click="onDelete">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </header>
    <section v-if="open" class="comment__content">
      <textarea v-model="json.text" cols="30" rows="2" placeholder="Entrez un commentaire"></textarea>
    </section>
  </div>
</template>

<script>
import ApiService from "@/services/ApiService";

export default {
  name: "comment",
  props: ['json', 'projectId', 'versionId'],
  data: function () {
    return {
      apiService: new ApiService(),
      open: false,
      text: ''
    }
  },
  mounted() {
    let date = new Date(this.json.createdAt.timestamp * 1000);
    this.json.createdAt = date.getDate() + '/' + (date.getMonth() + 1) + '/' + date.getFullYear() + ' ' + date.getHours() + ':' + date.getMinutes();
  },
  methods: {
    toggle(){
      this.open = !this.open;
    },
    onDelete(e){
      let self = this;
      e.stopPropagation();
      this.apiService.sendRequest('/project/' + this.projectId + '/version/' + this.versionId + '/comment/'+this.json.id, 'DELETE').then(() => {
        self.$destroy();
        self.$el.parentNode.removeChild(this.$el);
      });
    }
  }
}

</script>

<style lang="scss" scoped>
  .comment {
    border: 1px solid $orange;
    overflow: hidden;
    width: 100%;
    border-radius: 4px;
    margin-top: 10px;

    &__content {
      padding: .2em;
    }
  }

  header {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    background: $orange;
    color: white;
    padding: .4em;

    .btn {
      margin-left: .4em;
    }
  }

  textarea {
    border: 0;
    width: 100%;
  }
</style>