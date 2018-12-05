
<template>
  <div id="app">

    <router-view v-if="userExists" @login="login" />
    <Login v-else @login="login"></Login>

  </div>
</template>

<script>
import Login from './components/Login.vue'
export default {
  name: 'App',
  data () {
    return {
      username: "",
    }
  },
  methods: {
    login(bool) {
      this.userExists = bool;
      this.$emit('userexists', bool);
    }
  },
  props: ['userExists'],
  components: {
    Login
  },
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

</style>
