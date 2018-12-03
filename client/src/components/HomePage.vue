<template>
  <div class="map">
    
    <div v-if="isLoggedIn">
      <CustomNav v-if="isLoggedIn" :lon="lon" :lat="lat" :username="username" @addedmarker="addedMarker" @logOut="logOut"></CustomNav>
    
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
    <Login v-else @isLoggedIn="login" @username="setUser"></Login>
  </div>
</template>

<script>
import Mapbox from 'mapbox-gl-vue'
import CustomNav from './CustomNav.vue'
import Login from './Login.vue'
export default {
  name: 'HomePage',
  data () {
    return {
      username: "",
      isLoggedIn: false,
      users: [],
      lon: undefined,
      lat: undefined,
      map: undefined
    }
  },
  components: {
    Mapbox, CustomNav, Login
  },
  methods: {
    logOut () {
      /* Maybe back-end stuff */
      console.log("Hello?");
      this.isLoggedIn = false;
    },
	setUser(name) {
		this.username = name;
		console.log("username", this.username);
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
                        new mapboxgl.Marker(el).setLngfLat([photo.coordinates.longitude, photo.coordinates.latitude]).setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<img src=${photo.url} alt="" height="200" width="200">`)).addTo(map);
                        //<div v-bind:style="el"></div>
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
      this.map = map;
      //Don't do anything on map load since ajax request is too slow
      this.loadmap(map);
      console.log("Map: ")
      console.log(map);
      },
    //reset the map
    resetStyle() {
      console.log("zoom event finished, we need to reset the style as it gets messed up");
      console.log(this.map);
    },
	
    //map click triggers, get location
    mapClicked(map, e) {
      //alert(e.lngLat.toArray());
      this.lon= e.lngLat.toArray()[0];
      this.lat= e.lngLat.toArray()[1];
      console.log(this.lon + ", " + this.lat);
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


  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>

data: {
 el: {
 }
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




</style>
