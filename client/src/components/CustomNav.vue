<template>
  <nav class="navbar navbar-inverse" id="nav">
    <div class="container-fluid">
      <div class="navbar-header">
        <a class="navbar-brand" href="#">PicMap</a>
      </div>
      <ul class="nav navbar-nav navbar-right">
          <li v-if="contextName == 'home'"><a>
              <div @click="goToProfile">
                  <label><span class="glyphicon glyphicon-user"></span> Profile</label>
              </div>
          </a></li>
          <li v-if="contextName == 'profile'"><a>
              <div @click="goToMap">
                  <label><span class="glyphicon glyphicon-map-marker"></span> Map</label>
              </div>
          </a></li>
          <li v-if="contextName == 'home'"><a >
              <div @click="emitEvent">
                  <label><span class="glyphicon glyphicon-upload"></span> Choose file</label>
              </div>
          </a></li>
          <li><a href="#" @click="signOut"><label><span class="glyphicon glyphicon-log-out"></span> Sign Out</label></a></li>
      </ul>
    </div>
  </nav>
</template>
<script>
export default {
  name: "HomePage",
  props: ["username", "contextName"],
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
    goToProfile() {
      console.log("going to ", this.contextName)
      this.$router.push({ path: `/profile/${this.username}`});
    },
    goToMap() {
      console.log("going to ", this.contextName)
      this.$emit('zoomTo');
      this.$router.push({ path: `/home/${this.username}`});
    },
    signOut() {
      console.log("ORANGE");
      this.$emit('logout');
      this.$router.push({ path: `/`});
    },
    emitEvent() {
      console.log("attempting to emit popup");
      this.$emit('clickLabel');
    }


  },
  mounted: function() {
    console.log("username:", this.username);
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
