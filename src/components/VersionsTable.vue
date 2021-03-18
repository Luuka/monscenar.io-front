<template>
  <div class="actorTable__root">
    <table >
      <thead>
        <tr>
          <th>Nom</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(version, versionIdx) of versions" :key="versionIdx">
          <td>
            Version {{ version.versionNumber }}
          </td>
          <td>
            <router-link :to="{name: 'VersionPreview', params: { projectId: project.id, versionNumber: version.versionNumber }}">
              Lire la version
            </router-link>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import ActorService from "@/services/ActorService";
import fountain from '../libs/fountain.min.js';

export default {
  name: 'ScenesTable',
  props: ['project'],
  data: () => {
    return {
      versions: [],
      unsubscribe: null,
    }
  },
  created: function () {
    let self = this;
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setVersions') {
        self.versions = self.$store.state.versions;
      }
    });
  },
  computed: {

  },
  methods: {
  },
}
</script>

<style lang="scss" scoped>
  .actorTable__root{
    width: 50vw;
    padding: 1em;
  }

  .table-title {
    font-size: 1.2em;
    font-weight: bold;
    padding-top: 1em;
  }

  table, tr, td {
    border-collapse: collapse;
  }

  table {
    width: 100%;
    margin-top: 2em;
  }

  tbody td {
    border-top: 1px solid lightgray;
  }

  th {
    text-align: left;
  }

</style>