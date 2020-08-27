<template>
    <q-page>
        <q-form @submit="onSubmit" class="q-pa-md">
            <h4>Adicione uma nova clinica</h4>
            <q-input v-model="clinica.name" label="Nome da clinica" />

            <p class="q-pt-md">Qual o tamanho da clinica?</p>
            <div class="row q-mt-xs">
                <div class="col">
                    <q-btn-toggle
                    v-model="clinica.type"
                    toggle-color="primary"
                    spread
                    :options="[
                        {label: 'Pequeno porte', value: 'sm'},
                        {label: 'Médio porte', value: 'md'},
                        {label: 'Grande porte', value: 'lg'}
                    ]"
                />
                </div>
            </div>

            <q-input class="q-pt-lg q-pb-sm" bottom-slots v-model="clinica.cep" @change="consultaCep" label="Insira um CEP">
                <template v-slot:prepend>
                    <q-icon name="place" />
                </template>
            </q-input>

            <p v-if="cepError === true" class="text-negative">Insira um CEP válido</p>

            <div class="q-gutter-lg row q-mb-lg">
                <div class="col">
                    <q-input v-model="clinica.location" label="Endereço" readonly  />
                </div>
                <q-input v-model="clinica.location_number" label="Número" @change="onChangeStreetNumber" />
            </div>

            <GmapMap
            v-bind:center="center"
            v-bind:zoom="13"
            map-type-id="terrain"
            style="width: 100%; height: 300px"
            >
            <GmapMarker
                v-bind:key="index"
                v-for="(m, index) in markers"
                v-bind:position="m.position"
                v-bind:clickable="true"
            />
            </GmapMap>

            <p v-if="submitError === true" class="text-negative q-mt-md">Preencha todos os campos necessários</p>
            <p v-if="submitSuccess" class="text-white bg-positive q-pa-md q-mt-md">Clinica adicionada com sucesso!</p>

            <div class="row q-mt-lg">
                <q-btn label="Salvar" type="submit" color="primary"/>
            </div>
        </q-form>

    </q-page>
</template>


<script>

export default {
  data () {
    return {
        cepError: null,
        submitError: false,
        submitSuccess: null,
        clinica: {
            location: '...',
        },

        center: {lat:-27.595022, lng:-48.552773},
        markers: [{ position: {lat:-27.595022, lng:-48.552773} }]
    }
  },

  methods: {
      consultaCep: function() {
          this.$axios.get(`https://viacep.com.br/ws/${this.clinica.cep}/json/`)
            .then(response => {
                if (response.status === 200) this.udpateClinica(response.data)
            }).catch(error => {
                this.cepError = true
                this.clinica.location = "..."
                this.clinica.location_number = ''
            })
      },
      onSubmit: function() {
          if (this.cepError === true || this.cepError === null) return this.submitError = true
          if (typeof this.clinica.name === 'undefined' || this.clinica.name.length <= 0) return this.submitError = true
          if (typeof this.clinica.type === 'undefined' || this.clinica.type.length <= 0) return this.submitError = true
          if (typeof this.clinica.location_number === 'undefined' || this.clinica.location_number.length <= 0) return this.submitError = true

          let clinicas = localStorage.getItem("CLINICAS")
          if (!clinicas) return localStorage.setItem("CLINICAS", "[" + JSON.stringify(this.clinica) + "]")
          else {
              clinicas = JSON.parse(clinicas)
              clinicas.push(this.clinica)
              localStorage.setItem("CLINICAS", JSON.stringify(clinicas))
          }

          this.submitError = false
          this.submitSuccess = true
          this.clinica = {
            location: '...'
          }
      },
      udpateClinica: function(location) {
          this.cepError = false
          this.clinica.endereco = { ...location }
          this.clinica.location = `${location.uf} - ${location.localidade} - ${location.bairro}, ${location.logradouro}`
          console.log(this.clinica.endereco)
      },
      onChangeStreetNumber: function() {
        this.$axios.get(`https://api.tomtom.com/search/2/geocode/${this.clinica.endereco.uf} ${this.clinica.endereco.bairro} ${this.clinica.endereco.logradouro} ${this.clinica.location_number}.json?countrySet=BR&key=OUDQc6LJtt7waPIQnT1CY9syUaKS8CvI`)
            .then(response => {
                this.center.lat = response.data.results[0].position.lat
                this.center.lng = response.data.results[0].position.lon

                this.markers[0].position = this.center
                this.clinica.endereco.position = this.center
            })
      }
  }
}
</script>