<template>
  <nav class="navbar navbar-inverse" id="nav">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">PicMap</a>
      </div>
      <ul class="nav navbar-nav navbar-right">
          <li><a >
              <div @click="emitEvent()">
                  <label><span class="glyphicon glyphicon-upload"></span> Choose file</label>
              </div>
          </a></li>
          <li><a href="#" @click="signOut()"><span class="glyphicon glyphicon-user"></span> Sign Out</a></li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  name: "HomePage",
  props: ["username"],
  data() {
    return {


      /**
       * The Auth2 parameters, as seen on
       * https://developers.google.com/identity/sign-in/web/reference#gapiauth2initparams.
       * As the very least, a valid client_id must present.
       * @type {Object}
       */

      googleSignInParams: {
        client_id:
          "728975308271-pk06eacp60cv1j16ngm0sft0a9gr1snj.apps.googleusercontent.com"
      }
    };
  },
  methods: {
    signOut() {
      console.log("ORANGE");
      this.$emit("logOut");
    },
    emitEvent() {
      console.log("attempting to emit popup");
      this.$emit('clickLabel');
    }


  }
};

components: {
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.g-signin-button {
  /* This is where you control how the button looks. Be creative! */
  display: inline-block;
  padding: 4px 8px;
  border-radius: 3px;
  background-color: #3c82f7;
  color: #fff;
  box-shadow: 0 3px 0 #0f69ff;
}
#nav {
  margin-bottom: 0px;
}
</style>
