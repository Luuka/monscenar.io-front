<template>
  <div class="modal-wrapper">
    <section class="modal" v-if="isOpen === true">
      <div class="close" v-on:click="closeModal()"><i class="fas fa-times"></i></div>
      <div class="content">
        <slot></slot>
      </div>
    </section>
    <section class="overlay" v-if="isOpen === true" v-on:click="closeModal()"></section>
  </div>
</template>

<script>
export default {
  name: 'Modal',
  props: {
    id: null
  },
  data: function () {
    return {
      isOpen: false
    }
  },
  mounted() {
    let self = this;
    this.$root.$on('modal-'+this.id+'-show', function (){
      self.openModal();
    });

    this.$root.$on('modal-'+this.id+'-close', function (){
      self.closeModal();
    });
  },
  computed: {
  },
  created() {
  },
  methods: {
    openModal: function() {
      this.closeModal();
      this.isOpen = true;
    },
    closeModal: function() {
      this.isOpen = false;
    }
  }
}
</script>

<style lang="scss" scoped>
.modal {
  position: absolute;
  width:50%;
  left: 25%;
  top: 25%;
  background: white;
  border: .2rem solid $orange;
  z-index: 9999;
  border-radius: $radius;
  padding: 1em;
}

.close {
  width: 2rem;
  height: 2rem;
  line-height: 2rem;
  color: white;
  position: absolute;
  right: -1rem;
  top:-1rem;
  border: .2rem solid $orange;
  background: white;
  font-family:'manrope bold', sans-serif;
  color: $orange;
  font-size:1rem;
  border-radius: 100%;
  cursor: pointer;
  text-align: center;
}

.close i {
  position: relative;
  top: -.1rem;
}

.overlay {
  position:fixed;
  width:100%;
  height:100%;
  top: 0;
  left: 0;
  background: rgba(255,255,255,.7);
  z-index:99;
}

.content ul {
  list-style: none;
}

@media screen and (max-width: 900px) {
  .modal {
    width:90%;
    left: 5%;
  }
}

</style>