<template>
  <div id="q-app">
    <router-view />
  </div>
</template>
<script>
import Vue from 'vue'
import * as VueGoogleMaps from 'vue2-google-maps'

Vue.use(VueGoogleMaps, {
  load: {
    key: 'AIzaSyATRSwykGGyBz_msXoFR1OmSUa_IaH4Hms',
  }
})

export default {
  name: 'App'
}
</script>
