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
  .login {
    background: #F6F6F6;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url('../assets/LoginBackground.svg');
    background-position: center;
    background-size: contain;
    background-repeat: no-repeat;
  }

  h1 {
    color: $darkblue;
    font-size: 3rem;
  }

  .login-form {
    width: 20em;
    background: white;
    padding: 2em;
    text-align: left;
    border-radius: $radius;
    box-shadow: $shadow;

    form {
      display: flex;
      flex-direction: column;
    }

    label {
      font-weight: bold;
      font-size: 1.2em;
      margin-bottom: .1rem;
    }

    input {
      margin-bottom: 2em;
      height: 2.2em;
      font-size: 1.3em;
      padding-left: .4em;
      border: .2rem solid $orange;
      border-radius: $radius;
      box-shadow: $shadow;

      &[type=submit] {
        height: 3em;
        color: $orange;
        margin-top: 1em;
        margin-bottom: 0;
        background: white;
        font-size: 1rem;
        font-weight: bold;
      }
    }
  }
</style>
