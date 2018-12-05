<template>
  <div class="map">

    <div v-if="isLoggedIn">
      <CustomNav v-if="isLoggedIn" :username="username" contextName="home" @clickLabel="showModal = true" @logout="logOut"></CustomNav>
      <Modal v-if="showModal" :username="username" :lon="lon" :lat="lat" @addedmarker="addedMarker" @close="hideModal"></Modal>
      <mapbox
        access-token="pk.eyJ1IjoiZHlsYW5hbHZhcmV6MSIsImEiOiJjam4wbjhhdnkxYjVkM3Fyb2luYjhqenZwIn0.XxYiYeuAkCkeBheh1_hYFA"
        :map-options="{
        style: 'mapbox://styles/mapbox/dark-v9',
        center: [-96, 37.8],
        zoom: 3 }"
        @map-init="mapLoaded"
        @map-click="mapClicked"
        @map-zoomend="resetStyle"
        ref="map">
      </mapbox>
    </div>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'
import CustomNav from './CustomNav.vue'
import Login from './Login.vue'
import Modal from './Modal.vue'
export default {
  name: 'HomePage',
  data () {
    return {
      username: "",
      isLoggedIn: false,
      users: [],
      lon: undefined,
      lat: undefined,
      map: undefined,
      params: "",
      showModal: false
    }
  },
  components: {
    Mapbox, CustomNav, Login, Modal
  },
  props: ['userExists'],
  methods: {
    logOut () {

      this.$emit('login', false);
      this.isLoggedIn = false;
    },
    test() {
      console.log("You added a marker");
    },
    hideModal() {
      this.showModal = false;
    },
	setUser(name) {
    this.username = name;
    this.isLoggedIn = true;
		console.log("username", this.username);
  },
  getUserLocation(map) {
    console.log("In getting user location");
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
          console.log("position:", position.coords);
          this.lon = position.coords.longitude;
          this.lat = position.coords.latitude;
          map.flyTo({
              center: [
                  position.coords.longitude, position.coords.latitude
                  ],
              zoom: 11,
              bearing: 0,

              // These options control the flight curve, making it move
              // slowly and zoom out almost completely before starting
              // to pan.
              speed: 1, // make the flying slow
              curve: 1,
          });
        });
     }
  },
    //Asynch fetch to get users from database
    async loadmap (map) {
      //clear map before drawing all markers


      //open xmlhttp request
      var xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://pic-app-client.herokuapp.com/users/' + this.username, true);
      xhr.responseType = 'json';
      xhr.onload = function () {
          if (xhr.readyState === xhr.DONE) {
              if (xhr.status === 200) {

                  let response = xhr.response;//get user data
                  console.log("xhr", response);
                    response[0].photos.forEach(photo => {
					    // loop all photos for one user
                        console.log(photo.url);

                        var el = document.createElement('div').classList.add('marker');

                        // make a marker for each feature and add to the map

                        new mapboxgl.Marker(el).setLngLat([photo.coordinates.longitude, photo.coordinates.latitude]).setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<img src=${photo.url} alt="" height="84" width="84">`)).addTo(map);
                    });


              }
          }
      };
      await xhr.send(null);

    },

    login() {
      console.log("This is a security flaw!")
      this.isLoggedIn = true;
    },

    addedMarker() {

      console.log("heard the addedMarker event from nav, passing it to root so that child (map) can hear it");
      this.loadmap(this.map);
    },

    //Actual event that triggers on map load
    mapLoaded (map) {
      this.getUserLocation(map);
      this.map = map;
      //Don't do anything on map load since ajax request is too slow
      this.loadmap(map);
      console.log("Map: ")
      console.log(map);
      },
    //called on zoom event the map
    resetStyle() {

    },

    //map click triggers, get location
    mapClicked(map, e) {
      //alert(e.lngLat.toArray());
      this.lon= e.lngLat.toArray()[0];
      this.lat= e.lngLat.toArray()[1];
      var parent = document.getElementById('mapboxgl-canvas-container');
      console.log(this.lon + ", " + this.lat);
      document.getElementsByClassName('markerTemp').forEach((elem)=> {
        elem.parentNode.removeChild(elem);
      });

      var el = document.createElement('div').classList.add('markerTemp');

      // make a marker for temporary mouse click

      new mapboxgl.Marker(el).setLngLat([this.lon, this.lat]).addTo(map);
    },

    // The xmlhttp request to host the image on imgur
    async requestImage (file) {
      var req = new XMLHttpRequest();
      req.onreadystatechange = function() {
        if (req.readyState == 4 && req.status == 200) {
          processRequest(req.responseText);
        }
      }
      var request_url = 'https://api.imgur.com/3/image';
      var api_key = 'bf6ae890fb73e6b';
      req.open("POST", request_url, true); // true for asynchronous
      req.setRequestHeader('Authorization', 'Client-ID ' + api_key);
      req.send(file);
    },

    //xmlhttp response
    processRequest (response_text) {
      if (response_text == "Not found") {
        console.log("Imgur album not found.")
      }
      else {
        //Response is here
        var json = JSON.parse(response_text);
        console.log(json)
        imageLink = json.data.link;
        console.log(imageLink)
        // Here we probably would want to update the user with the new image, then reload the map

        //Make express api call to update user by adding an image

        //Reload/Repopulate the map with new info

      }
    }


  },
  created: function() {
      console.log("this.params:", this.params);
      this.params =  this.$route.params.username;
      this.setUser(this.params);
    },
    watch: {
      '$route': function (username) {
        //console.log("In watched for param: ", username);
        this.params = username;
        console.log(username);
        this.setUser(this.params);

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

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

img {
  width: 100px;
  height: 100px;
  border-style: dotted;
}

a {
  color: #42b983;
}

#map {
  width: 100%;
  height: 100%;
}

.marker {
  background-image: url('https://raw.githubusercontent.com/RandyOram/RandyOram.github.io/master/PicApp/mapbox-icon.png');
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}

.markerTemp {
  background-image: url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRWvsMICo99YY4etMekY3q91PxSD1dQMd5cMDdvmCCc7vcfYiq9');
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}




</style>
