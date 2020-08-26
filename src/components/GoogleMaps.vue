<template>
    <div id="google-maps">
        <GmapMap
        v-bind:center="center"
        v-bind:zoom="7"
        map-type-id="terrain"
        style="width: 500px; height: 300px"
        >
        <GmapMarker
            v-bind:key="index"
            v-for="(m, index) in markers"
            v-bind:position="m.position"
            v-bind:clickable="true"
        />
        </GmapMap>
    </div>
</template>

<script>
export default {
    name: 'GoogleMaps',

    data () {
        return {
            center: {lat:10, lng:10},
            markers: [{
                position: {lat:10, lng:10}
            }, {
                position: {lat:11, lng:11}
            }]
        }
    }
}
</script>