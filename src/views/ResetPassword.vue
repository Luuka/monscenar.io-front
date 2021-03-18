<template>
  <div class="login">
    <h1>MonScenar.io</h1>
    <div class="login-form">

      <div v-for="(error, key) of errors" v-bind:key="key" class="form-error">
        {{ error }}
      </div>

      <form action="" @submit="onSubmit">
        <label for="email">Adresse email</label>
        <input type="email" id="email" name="email">

        <label for="password">Nouveau mot de passe</label>
        <input type="password" id="password" name="password" minlength="8" v-model="password">

        <label for="passwordRepeat">Répétez le mot de passe</label>
        <input type="password" id="passwordRepeat" name="passwordRepeat" minlength="8" v-model="passwordRepeat">

        <input type="hidden" name="token" v-model="token">

        <input type="submit" value="Enregistrer">
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
  components: {

  },
  mounted() {
    this.token = this.$route.query.token;
  },
  data: function () {
    return {
      errors: [],
      token: null,
      password: null,
      passwordRepeat: null
    }
  },
  methods: {
    onSubmit: function (e) {
      e.preventDefault();

      if(this.password !== this.passwordRepeat) {
        this.errors = [
            'Les deux mots de passes doivent être identiques'
        ]
      } else {
        this.errors = [];

        let formData = new FormData(e.target);
        var object = {};
        formData.forEach((value, key) => object[key] = value);
        var json = JSON.stringify(object);

        this.sendResetPasswordRequest(json);
      }
    },
    sendResetPasswordRequest: function (json) {

      let self = this;

      fetch(process.env.VUE_APP_API_URL+'/reset-password',
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
        let forgotResponse = JSON.parse(response);

        if(forgotResponse.status === 200) {
          window.location = '/';
        }
      });
    }
  }
}
</script>

<style lang='scss' scoped='true'>

</style>
