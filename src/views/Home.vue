<template>
  <div class="login">
    <h1>MonScenar.io</h1>
    <div class="login-form">

      <div v-for="(error, key) of errors" v-bind:key="key" class="form-error">
        {{ error }}
      </div>

      <form action="" @submit="onSubmit">
        <label for="username">Nom d'utilisateur</label>
        <input type="text" id="username" name="username">

        <label for="password">Mot de passe</label>
        <input type="password" id="password" name="password">

        <router-link :to="{name: 'Register'}">
          Créer un compte
        </router-link>
        <router-link :to="{name: 'ForgotPassword'}">
          Mot de passe oublié ?
        </router-link>
        <input type="submit" value="Se connecter">
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Home',
  components: {

  },
  mounted() {
    
  },
  data: function () {
    return {
      errors: []
    }
  },
  methods: {
    onSubmit: function (e) {
      e.preventDefault();

      this.errors = [];

      let formData = new FormData(e.target);
      var object = {};
      formData.forEach((value, key) => object[key] = value);
      var json = JSON.stringify(object);

      this.sendLoginRequest(json);

    },
    sendLoginRequest: function (json) {

      let self = this;

      fetch(process.env.VUE_APP_API_URL+'/login',
        {
          method: "POST",
          headers: new Headers({'content-type': 'application/json'}),
          body: json
        }
      )
      .then(function(response) {
        return response.text();
      })
      .then(function(response) {
        let loginResponse = JSON.parse(response);

        if(loginResponse.status === 200) {
          self.$store.commit('setUser', loginResponse.user);
          self.$store.commit('setAuthToken', loginResponse.token);
          self.$router.push('dashboard');

        } else {
          self.errors.push(loginResponse.message);
        }
      });
    }
  }
}
</script>

<style lang='scss' scoped='true'>

</style>
