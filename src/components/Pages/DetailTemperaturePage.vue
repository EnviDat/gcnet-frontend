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
                <DetailChartTemperature />
<!--                <DetailChart />-->
<!--              <chart :station="$store.getters.stations[0]" :delay="0" />-->
            </v-flex>
          </v-layout>

      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
//import Chart from '@/components/Chart.vue';
//import DetailChart from "../DetailChart";
import DetailChartTemperature from "../DetailChartTemperature";

export default {
  props: {
    currentStation: Object,
  },
  components: {
    DetailChartTemperature
  },
  data: () => ({
    baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    loadingStation: false,
    fileNames: ['battvolt.json', 'battvolt_v.json', 'press.json', 'press_v.json', 'rad.json', 'rad_v.json', 'rh.json', 'rh_v.json', 'sheight.json', 'sheight_v.json',
    'stemp.json', 'stemp_v.json', 'temp.json', 'temp_v.json', 'wd.json', 'wd_v.json', 'ws.json', 'ws_v.json']

  }),
  watch: {
    // currentStation: function updateStation() {
    //   if (this.currentStation) {
    //     this.loadStation(this.baseStationURL + this.currentStation.alias);
    //   }
    // },
  },
  methods: {
    // loadStation() {
    // },
    generateFileList() {
      this.fileList = []
      for (let i = 0; i < this.fileNames.length; i++) {
        this.fileList.push(this.currentStation.id + this.fileNames[i])
      }
      return this.FileList
    }
  },

};
</script>

<style scoped>

</style>