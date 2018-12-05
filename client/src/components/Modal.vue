<template>
  <div>

      <transition name="modal">
        <div class="modal-mask">
          <div class="modal-wrapper">
            <div class="modal-container">

              <div class="modal-header">
                <slot name="header">
                  Add a location
                </slot>
              </div>

              <div class="modal-body">
                <slot name="body">
                  <label>Longitude: </label><input type="text" v-model="lon" placeholder="longitude" @change="checkValidation()">
                  <label>Latitude: </label><input type="text" v-model="lat" placeholder="latitude"  @change="checkValidation()">
                  <br>
                  <input type="file" class="custom-file-input" id="inputGroupFile02" :disabled="validated == 1" @change="inputHandler($event)">
                  <button @click="submitForm()">Upload Photo</button>
                </slot>
              </div>

              <div class="modal-footer">
                <slot name="footer">

                  <button :disabled="notReady == 1" v-if="lon != 0 && lat != 0" class="modal-default-button" @click="$emit('close')">
                    OK
                  </button>
                  <button :disabled="uploading == 1" v-if="lon != 0 && lat != 0" class="modal-default-button" @click="$emit('close')">
                    Back
                  </button>
                </slot>
              </div>
            </div>
          </div>
        </div>
      </transition>

  </div>
</template>
<script>
export default {
  name: "HomePage",

  data() {
    return {
      file: undefined,
      validated: false,
    };
  },
  props: ["lon", "lat", "username", "notReady", "uploading"],
  methods: {

    checkValidation() {
      if(this.lon != 0 && this.lat != 0) {
        this.validated = true;
      }
      else {
        this.validated = false;
      }
    },

    submitForm() {
      this.uploading = true;
      this.requestImage(this.file);

    },

    async requestImage(file) {
      let callback = this.sendReadySignal;
      console.log("Orange!");
      console.log(file);
      var req = new XMLHttpRequest();
      req.onreadystatechange = () => {
        if (req.readyState == 4 && req.status == 200) {
          this.processRequest(req.responseText, callback);
          console.log("BLUE: " + req.responseText);
        }
      };
      var request_url = "https://api.imgur.com/3/image";
      var api_key = "bf6ae890fb73e6b";
      req.open("POST", request_url, true); // true for asynchronous
      req.setRequestHeader("Authorization", "Client-ID " + api_key);
      req.send(file);
      console.log("White!");
    },

    processRequest(response_text, callback) {

      if (response_text == "Not found") {
        console.log("Imgur album not found.");
      } else {
        //Response is here
        var json = JSON.parse(response_text);
        let imageLink = json.data.link;
        console.log(imageLink);

        //update user schema with new photo sub doc by passing in url parameters
        let url =
          "https://pic-app-client.herokuapp.com/users/" +
          this.username +
          `?url=${imageLink}&lon=${this.lon}&lat=${this.lat}`;
        console.log(url);
        var xhr = new XMLHttpRequest();
        xhr.open("PUT", url, true);
        xhr.responseType = "text";
        console.log("Request about to onload");
        xhr.onload = () => {
          console.log("in onload for update image xmlhttpr");
          if (xhr.readyState === xhr.DONE) {
            if (xhr.status === 200) {
              console.log("trying to add marker to map after image upload");
              console.log("new content");
              /*  this.users = xhr.response;
                  let photo = this.users.photos[this.users.photos.length-1];
                  var el = document.createElement('div').classList.add('marker');
                  new mapboxgl.Marker(el).setLngLat([photo.coordinates.longitude, photo.coordinates.latitude]).setPopup(new mapboxgl.Popup({ offset: 25 }).setHTML(`<img src=${photo.url} alt="" height="84" width="84">`)).addTo(map); */
              //Emit event to reload map
              callback();
            }
          }
        };
        xhr.send(null);
      }
    },
    sendReadySignal() {
      console.log("Firing ready signals");
      this.notReady = false;
      this.uploading = false;
      this.$emit("addedmarker");
      this.$emit('test');
    },

    inputHandler(event) {
      //Handle image upload here
      this.file = event.target.files[0];
      console.log("File has been changed");

    }

  },
  mounted: function() {
    this.lati = this.lat;
    this.long = this.lon;
  }
};


</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.modal-mask {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, .5);
  display: table;
  transition: opacity .3s ease;
}

.modal-wrapper {
  display: table-cell;
  vertical-align: middle;
}

.modal-container {
  width: 300px;
  margin: 0px auto;
  padding: 20px 30px;
  background-color: #fff;
  border-radius: 2px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, .33);
  transition: all .3s ease;
  font-family: Helvetica, Arial, sans-serif;
}

.modal-header h3 {
  margin-top: 0;
  color: #42b983;
}

.modal-body {
  margin: 20px 0;
}

.modal-default-button {
  float: right;
}

/*
 * The following styles are auto-applied to elements with
 * transition="modal" when their visibility is toggled
 * by Vue.js.
 *
 * You can easily play with the modal transition by editing
 * these styles.
 */

.modal-enter {
  opacity: 0;
}

.modal-leave-active {
  opacity: 0;
}

.modal-enter .modal-container,
.modal-leave-active .modal-container {
  -webkit-transform: scale(1.1);
  transform: scale(1.1);
}
</style>
