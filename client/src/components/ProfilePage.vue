<template>
<div>
  <CustomNav :username="username" @logout="logOut" contextName="profile"></CustomNav>
  <h1>{{this.username}}</h1>
  <div id="photoList" >
    <img v-for="(photo,index) in photos" :key="index" :src="photo.url" style="width: 200px; height: 200px; margin: 5px; border: solid black 3px" />
  </div>
</div>

</template>

<script>
import CustomNav from './CustomNav.vue'
  export default {
    name: 'login',
    data: function() {
      return {
       params : "",
       username: "",
       photos: []

      }
    },
    props: ['username', 'userExists'],
    components: {
      CustomNav
    },
    methods: {

       logOut () {
        this.$emit('login', false);
       },




      getUserById: function (userId) {
        console.log("userid:", userId);
        //update user schema with new photo sub doc by passing in url parameters
        let url = "https://pic-app-client.herokuapp.com/users/" + userId;
        console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open("GET", url, true);
        xhr.responseType = 'json';
        console.log("Request about to onload");
        xhr.onload = () => {
          console.log("in onload for update image xmlhttpr");
          if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
              console.log(xhr);
              console.log("response", )
              let response = xhr.response[0];
              console.log("response", response);
              console.log();
              this.username = response.username;

              response.photos.forEach(photo => {
                console.log(photo);
                this.photos.push(photo);

              });

              console.log("photos", this.photos);


            }
          }
        };
        xhr.send(null);



      }

    },
    created: function() {
      console.log("this.params:", this.params);
      this.params =  this.$route.params.username;
      this.getUserById(this.params);
    },
    watch: {
      '$route': function (username) {
        //console.log("In watched for param: ", username);
        this.params = username;
        console.log(username);
        this.getUserById(this.params);

      }
    },
    beforeRouteUpdate (to, from, next) {
      if(to.params) {
          const userId = to.params.username;
          console.log(userId);
          //console.log("BeforeRouteUpdate:", to.params.username);
          this.params = userId;
          next();

      }
    },
  }
</script>

<style scoped>
  h1 {
    color: white;
  }

</style>
