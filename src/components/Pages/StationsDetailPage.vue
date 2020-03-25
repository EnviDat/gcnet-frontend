<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.smAndDown ? 'px-3 py-1' : 'px-2 py-1'"
                @click="anyClick">  

    <v-layout row wrap >
  
      <v-flex xs12 mx-5
              v-if="!showHomeScreen && showOverview" >

          <v-layout column >
            <v-flex py-3 >
              
              <chart :station="$store.getters.stations[0]" :delay="0" />
            </v-flex>
          </v-layout>

      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import Chart from '@/components/Chart.vue';

export default {
  props: {
    currentStation: Object,
  },
  components: {
    Chart,
  },
  data: () => ({
    baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    loadingStation: false,
    detailChartURLs: ['0temp.json', '0temp_v.json'],
  }),
  watch: {
    // currentStation: function updateStation() {
    //   if (this.currentStation) {
    //     this.loadStation(this.baseStationURL + this.currentStation.alias);
    //   }
    // },
  },
  methods: {
    loadStation() {
    },
  },

};
</script>

<style scoped>

</style>
