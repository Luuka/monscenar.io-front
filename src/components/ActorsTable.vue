<template>
  <div class="actorTable__root">
    <table >
      <thead>
        <tr>
          <th>Nom</th>
          <th>Séquences</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(sequences, actor) of actors" :key="actor">
          <td>
            <strong>{{ actor }}</strong>
          </td>
          <td>
            <span v-for="sequence of sequences" :key='sequence' class="sequence-tag">{{ sequence }}</span>
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
  name: 'ActorsTable',
  data: () => {
    return {
      actorService: null,
      actors: [],
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
      let actorsList = {};

      sequences.forEach((sequence, idx) => {
        fountain.parse(sequence.fountainText, true, function (result) {
          if (result.html !== undefined) {
            let actors = self.actorService.parseTokens(result.tokens);

            actors.forEach((actor) => {
              if(actorsList[actor] === undefined) {
                actorsList[actor] = [];
              }
              let actorList = actorsList[actor];
              actorList.push(sequence.name);
              actorsList[actor] = actorList;
            });

          }
        });

      });

      this.actors = actorsList;
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

  .sequence-tag {
    display: inline-block;
    background: $orange;
    margin: .2em .2em;
    border-radius: $radius;
    padding: .2em;
    color: white;
  }

</style>