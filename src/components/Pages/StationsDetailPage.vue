<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.smAndDown ? 'px-3 py-1' : 'px-2 py-1'" >


    <v-layout row wrap >

      <v-flex xs12 mx-5>


          <v-layout column >

            <v-flex >
                <DetailChart url="./testdata/0temp_v.json"/>
            </v-flex>

            <v-flex>
                <DetailChartTest url="./testdata/0press_v.json"/>
            </v-flex>


<!--            <v-flex  v-for="file in generateFileList" :key="file">-->
<!--                <DetailChart :url="file"/>-->
<!--            </v-flex>-->
<!--              -->
<!--            <v-flex  v-for="file in generateFileList" :key="file">-->
<!--                <DetailChartTest :url="file"/>-->
<!--            </v-flex>-->

          </v-layout>

      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
//import Chart from '@/components/Chart.vue';
import DetailChart from "../DetailChart";
import DetailChartTest from "../DetailChartTest";

export default {
  props: {
    currentStation: Object,
  },
  components: {
    DetailChart,
    DetailChartTest
  },
  data: () => ({
    // baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURL: './testdata/',
    loadingStation: false,
    // fileNames: ['battvolt.json', 'battvolt_v.json', 'press.json', 'press_v.json', 'rad.json', 'rad_v.json', 'rh.json', 'rh_v.json', 'sheight.json', 'sheight_v.json',
    // 'stemp.json', 'stemp_v.json', 'temp.json', 'temp_v.json', 'wd.json', 'wd_v.json', 'ws.json', 'ws_v.json']
    // fileNames: ['battvolt_v.json', 'press_v.json', 'rad_v.json', 'rh_v.json', 'sheight_v.json',
    // 'stemp_v.json', 'temp_v.json', 'wd_v.json', 'ws_v.json']
    fileNames: ['temp_v.json', 'press_v.json']
    //fileNames: ['temp_v.json']
   // fileNames: ['press_v.json', 'rad_v.json']
  }),
  watch: {
    // currentStation: function updateStation() {
    //   if (this.currentStation) {
    //     this.loadStation(this.baseStationURL + this.currentStation.alias);
    //   }
    // },
  },
  computed: {
    // loadStation() {
    // },
    generateFileList() {
      let fileList = []
      for (let i = 0; i < this.fileNames.length; i++) {
        fileList.push(this.baseStationURL + this.currentStation.id + this.fileNames[i])
      }
      return fileList
    }
  },

};
</script>

<style scoped>

</style>