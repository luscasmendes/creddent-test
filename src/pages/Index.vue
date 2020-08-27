<template>
  <q-page>
    <GmapMap
      v-bind:center="center"
      v-bind:zoom="11"
      map-type-id="terrain"
      style="width: 100%; height: 50vh"
      >
      <GmapMarker
        v-bind:key="index"
        v-for="(m, index) in markers"
        v-bind:position="m.position"
        v-bind:clickable="true"
      />
    </GmapMap>

    <div class="q-pt-lg">
      <q-btn label="Remover filtro" @click="removeFilter" color="primary" v-if="filter.type !== '' || typeof filter.type !== 'undefined'"/>
      <p class="q-pt-md">Filtre por tamanho da clinica:</p>
      <q-btn-toggle
        @click="applyFilter"
        v-model="filter.type"
        toggle-color="primary"
        spread
        :options="[
          {label: 'Pequeno porte', value: 'sm'},
          {label: 'Médio porte', value: 'md'},
          {label: 'Grande porte', value: 'lg'}
        ]"
      />
    </div>
  </q-page>
</template>

<style>

</style>

<script>
export default {
  data () {
    return {
        center: {lat:-27.595022, lng:-48.553773},
        markers: [],
        filter: {}
    }
  },

  mounted () {
    this.loadMarkers()
  },

  methods: {
    applyFilter() {
      this.loadMarkers()
    },

    loadMarkers () {
      this.markers = []
      var clinicas = localStorage.getItem("CLINICAS")
      if (clinicas) {
        clinicas = JSON.parse(clinicas)
        clinicas.map(clinica => {
          if (this.filter.type === '' || typeof this.filter.type === 'undefined') {
            this.markers.push({ position: clinica.endereco.position })
          } else {
            if (clinica.type === this.filter.type) this.markers.push({ position: clinica.endereco.position })
          }
        })
      } else {
        this.markers.push({ position: {lat:-27.595022, lng:-48.552773} })
      }
    },

    removeFilter() {
      this.filter.type = ''
      this.loadMarkers()
    }
  }
}
</script>
