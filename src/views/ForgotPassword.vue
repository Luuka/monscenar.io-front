<template>
  <div class="login">
    <h1><router-link :to="{name: 'Home'}">MonScenar.io</router-link></h1>
    <div class="login-form">

      <div v-for="(error, key) of errors" v-bind:key="key" class="form-error">
        {{ error }}
      </div>

      <div v-for="(message, key) of messages" v-bind:key="key" class="form-info">
        {{ message }}
      </div>

      <p>
        Pour récupérer l'accès à votre compte, un email contenant un lien pour réinitialiser votre mot de passe vous sera envoyé.
      </p>

      <form action="" @submit="onSubmit">
        <label for="email">Adresse Email</label>
        <input type="email" id="email" name="email">

        <input type="submit" value="Envoyer le lien">
      </form>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ForgotPassword',
  components: {

  },
  mounted() {
    
  },
  data: function () {
    return {
      errors: [],
      messages: [],
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

      this.sendForgotPasswordRequest(json);

    },
    sendForgotPasswordRequest: function (json) {

      let self = this;

      fetch(process.env.VUE_APP_API_URL+'/forgot-password',
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
          self.messages.push("Le lien a été envoyé à votre adresse email");
        }
      });
    }
  }
}
</script>

<style lang='scss' scoped='true'>

</style>
