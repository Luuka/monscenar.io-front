<template>
  <div>
    <div class="sidebar-panel">
      <button class="sidebar-panel__button" :class="current === 'Actors' ? 'sidebar-panel__button--active' : ''" title="Acteurs" v-on:click="onToggle('Actors')">A</button>
      <div class="sidebar-panel__content" :class="current === 'Actors' ? 'sidebar-panel__content--active' : ''">
        <slot name="actors"></slot>
      </div>
    </div>
    <div class="sidebar-panel">
      <button class="sidebar-panel__button" :class="current === 'Scenes' ? 'sidebar-panel__button--active' : ''" title="Scènes" v-on:click="onToggle('Scenes')">S</button>
      <div class="sidebar-panel__content" :class="current === 'Scenes' ? 'sidebar-panel__content--active' : ''">
        <slot name="scenes"></slot>
      </div>
    </div>
    <div class="sidebar-panel">
      <button class="sidebar-panel__button" :class="current === 'Versions' ? 'sidebar-panel__button--active' : ''" title="Scènes" v-on:click="onToggle('Versions')">V</button>
      <div class="sidebar-panel__content" :class="current === 'Versions' ? 'sidebar-panel__content--active' : ''">
        <slot name="versions"></slot>
      </div>
    </div>
  </div>
</template>

<script>

export default {
  name: 'SidebarPanel',
  data: () => {
    return {
      current: null
    }
  },
  mounted: function() {


  },
  computed: {

  },
  methods: {
    onToggle(id) {
      if (this.current === id) {
        this.current = null;
      } else {
        this.current = id;
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.sidebar-panel {

  display: flex;
  flex-direction: column;
  align-items: center;

  &__button {
    background: white;
    border-radius: 100%;
    border: 3px solid $orange;
    width: 2.5em;
    height: 2.5em;
    margin: .3em 0;
    color: $orange;
    font-weight: bold;
    font-size: 1.2em;
    outline: 0;

    &--active {
      color: white;
      background: $orange;
    }
  }

  &__content {
    position: absolute;
    left: 5em;
    top: 0;
    width: 0;
    background: white;
    height: calc(100vh - 4em);
    transition: width 250ms ease;
    overflow-x: hidden;
    box-shadow: 12px 0px 12px 0px rgba(0, 0, 0, 0.1);

    &--active {
      width: 50vw;

      &:before {
        left: -10px;
        width: 10px;
        position: absolute;
        height: 100%;
        content: '';
        overflow: hidden;
      }
    }

  }
}


</style>