<template>
  <div class="actorTable__root">
    <table >
      <thead>
        <tr>
          <th>Nom</th>
        </tr>
      </thead>
      <tbody v-for="(actorSequence, idx) in actorSequences" :key="idx">
        <tr>
          <td colspan="2" class="table-title">{{ actorSequence.name }}</td>
        </tr>
        <tr v-for="(actor, actorIdx) of actorSequence.actors" :key="actorIdx">
          <td>
            {{ actor }}
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
  data: () => {
    return {
      actorService: null,
      actorSequences: [],
      unsubscribe: null,
    }
  },
  created: function () {
    let self = this;
    this.actorService = new ActorService();
    this.unsubscribe = this.$store.subscribe((mutation, state) => {
      if (mutation.type === 'setSequences' || mutation.type === 'setSequence') {
        self.paint(Object.values(self.$store.state.sequences));
      }
    });
  },
  computed: {

  },
  methods: {
    paint(sequences) {
      let self = this;
      this.actorSequences = [];
      sequences.forEach((sequence, idx) => {
        let actorSequence = null;
        fountain.parse(sequence.fountainText, true, function (result) {
          if (result.html !== undefined) {
            let actors = self.actorService.parseTokens(result.tokens);
            actorSequence = ({'name': sequence.name, 'actors': actors});
          }
        });
        self.actorSequences.push(actorSequence);
      });
    }
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