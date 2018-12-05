<template>
  <div class="map">

    <div v-if="isLoggedIn">
      <CustomNav v-if="isLoggedIn" :username="username" contextName="home" @clickLabel="labelClick" @logout="logOut"></CustomNav>
      <Modal :notReady="notReady" :uploading="uploading" v-if="showModal" :username="username" :lon="lon" :lat="lat" @addedmarker="addedMarker" @close="hideModal"></Modal>
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
      showModal: false,
      notReady: true,
      uploading: false,
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
    labelClick() {
      this.showModal = true;
      this.notReady = true;
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
      //var parent = document.getElementById('mapboxgl-canvas-container');


      if(this.marker) {
        this.marker.remove();
      }

      /*
      document.getElementsByClassName('markerTemp').forEach((elem)=> {
        elem.parentNode.removeChild(elem);
      });
 */
      var el = document.createElement('div').classList.add('marker');
      console.log("el", el);
      let url = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyCAYAAAAeP4ixAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAPxSURBVGhD7Zo7aBRhFIV/3w9UbCIiitpGBVHMc2NE8QFCOsEYIZ0QsBEVUyiojXaKAQ2xFwux0Co+UGPnCwtDEJuIKEQwiPgkOuN3h6vI5O7mn9mZzQY8cMiyc88593/sPHbj/sNA0OqWBy2uE/YFBTfA32E4qhyO3iu4Xl53Bk1umcqqA+FGNyvY7PbR3EP4K2xxoQ+19j4DaxcPtas8Quem0UwHfB1vMinxkNVqF0+1rwwIXg3vWU2VQzzvBI1upcbkC8J2wlGrkSyI9we26naNywcs/37402ogS5IxJltNY7OFGDNb3h/mcikTxsq0aXw2CAtuI4P4YgXmScmEG7SN8sCpcT5mL62gSpDswaDBzdN20oMlPm0FTMSogYLrCZrdsYjyuuCGrFoPntR20iFsdUtleQ3jUpSLXL1ajAP7vpHjDwxdUVL/mdPyErVIDgZxwjIuRgLPcFGbrvKikBrqz8b1pUgvx1WeHIiHLVOL1F5QmTcYeI/lZZHaVypLBrbAOsvQIiFDbMOZKvWGaJgA7xMJObUq9QeiLsvMIrWpL15yw2l5miy4AyrzBzN10TSLkbqvzOwClSWGaJmI75Z3nNT1qMwfNHjdMosT80cqSQ2yHlvecZJ1TSX+wPy2ZRYndTdUkhp43LS842Qgt1TiD+8V4dZbJalBg3ct7zilJ5X4A/PLllmcmA+rJDXw8Ho4o6dLKvEH5kctM4vcgqxRWWLwnL/W8rTIGe6wyvzB6JstM4vU9qosMZiwPsvTIhPWoDJ/BLvcHEK87rMYyBiztUml3kBXL1rLM86ol1o3W6XJQMhVy9QitW+4JqxS6YSQ2khjeFlkIFdUmhzMcptlWoyEjdDcNpUXBXU74HvLoxip363y5JClpLF3lnEpoumHe2GNWsnq1uh7/ZamFBnE27K/+5KHIsvclzT+TWgd8yUDOaLtpAd7eTFGn6yASjDKpgdtpzxgdsoKqRDLe8z9F0GdW8RgRoyQXCmZQZNbqG1kA0wPWmF5ks9Wl8Znh3CPm4HxMyswD5L1VDI1PltgXs/K5P5to2TAOo3NBwzmvBWeJck4p3H5gVPhXGZr0GogC+L9QjI0Ll+ETW49gT+sRsph5Im3xlQGBHfHG8mA3WpfOehZbMBoJhUjr7zOUhOBrbACJrqLtSge4qW2k4Ow2W1hNlP/ihVp8VC7yQXNHLKa9KFo1aY6QEPeT5N/yHZK/9SXF/SXredWw0X4RDQqry5E/8Lh8RwuNVKrsupE9HNEwX20BhCRY1Kj5dUNtthWOO7KL+/JMS2bGqDhDrbQ39OyvJb39PDUAs130XwQMY+HpEqC1ZB7spzvoZz7DTTxbtnacn/5AAAAAElFTkSuQmCC"
      //el.style.backgroundImage = 'url(' + url + ')';
      // el.style.backgroundImage = 'url(https://image.freepik.com/free-icon/map-marker_318-49860.jpg)';
       /* el.style.width =  '50px';
       el.style.height = '50px'; */

      // make a marker for temporary mouse click

      let marker = new mapboxgl.Marker(el).setLngLat([this.lon, this.lat]).setPopup(new mapboxgl.Popup({ offset: 25 })).addTo(map);
      this.marker = marker;
      console.log("marker", this.marker);
      //this.marker._element.style.backgroundImage = 'url(' + url + ')';
      this.marker._color = '#FF0000';
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
  background-image: url("https://image.freepik.com/free-icon/map-marker_318-49860.jpg");
  background-size: cover;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  cursor: pointer;
}




</style>
