<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.smAndDown ? 'px-3 py-1' : 'px-2 py-1'" >


    <v-layout row wrap >

      <v-flex xs12 mx-5>


          <v-layout column >

            <v-flex  v-for="fileObject in generateFileList" :key="fileObject.fileName">
                <DetailChart :url="baseStationURL + fileObject.fileName" :fileObject="fileObject"
                             :chartdivID="fileObject.fileName" />
            </v-flex>

<!--            <v-flex  v-for="file in generateFileList" :key="file">-->
<!--              <DetailChart :url="baseStationURL + file" :chartdivID="file" />-->
<!--            </v-flex>-->

          </v-layout>

      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>

import DetailChart from "../DetailChart";


export default {
  props: {
    currentStation: Object,
  },
  components: {
    DetailChart,
   // DetailChartTest
  },
  data: () => ({
    // baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURL: './testdata/',
    loadingStation: false,
    // fileNames: ['temp.json', 'temp_v.json',  'rh.json', 'rh_v.json', 'rad.json', 'rad_v.json',  'sheight.json', 'sheight_v.json',
    //     'ws.json', 'ws_v.json', 'wd.json', 'wd_v.json', 'press.json', 'press_v.json', 'battvolt.json', 'battvolt_v.json', ]
    // fileNames: ['temp_v.json', 'rh_v.json', 'rad_v.json', 'sheight_v.json', 'ws_v.json', 'wd_v.json', 'press_v.json',
    //     'battvolt_v.json'],
    //fileNames: ['temp_v.json', 'press_v.json']
  // fileNames: ['temp.json', 'temp_v.json']
   // fileNames: ['press_v.json', 'rad_v.json']
//     fileObjects: [
//         { fileName: 'temp_v.json', chartTitle: 'Air temperatures', numberFormat: '##  °C'},
//         { fileName: 'rh_v.json', chartTitle: 'Relative humidity', numberFormat: '##  %'},
//         { fileName: 'rad_v.json', chartTitle: 'Radiation', numberFormat: '###  W/m²'},
//         { fileName: 'sheight_v.json', chartTitle: 'Snow heights', numberFormat: '#.#  m'},
//         { fileName: 'ws_v.json', chartTitle: 'Wind speed', numberFormat: '###  m/s'},
//         { fileName: 'wd_v.json', chartTitle: 'Wind direction', numberFormat: '###  °'},
//         { fileName: 'press_v.json', chartTitle: 'Air pressure', numberFormat: '###  mbar'},
//         { fileName: 'battvolt_v.json', chartTitle: 'Battery voltage', numberFormat: '## V'},
// ],
      fileObjects: [
        { fileName: 'temp.json', chartTitle: 'Air temperatures', numberFormat: '##  °C'},
        { fileName: 'temp_v.json', chartTitle: 'Air temperatures', numberFormat: '##  °C'},
        { fileName: 'rh.json', chartTitle: 'Relative humidity', numberFormat: '##  %'},
        { fileName: 'rh_v.json', chartTitle: 'Relative humidity', numberFormat: '##  %'},
        { fileName: 'rad.json', chartTitle: 'Radiation', numberFormat: '###  W/m²'},
        { fileName: 'rad_v.json', chartTitle: 'Radiation', numberFormat: '###  W/m²'},
        { fileName: 'sheight.json', chartTitle: 'Snow heights', numberFormat: '#.#  m'},
        { fileName: 'sheight_v.json', chartTitle: 'Snow heights', numberFormat: '#.#  m'},
        { fileName: 'ws.json', chartTitle: 'Wind speed', numberFormat: '###  m/s'},
        { fileName: 'ws_v.json', chartTitle: 'Wind speed', numberFormat: '###  m/s'},
        { fileName: 'wd.json', chartTitle: 'Wind direction', numberFormat: '###  °'},
        { fileName: 'wd_v.json', chartTitle: 'Wind direction', numberFormat: '###  °'},
        { fileName: 'press.json', chartTitle: 'Air pressure', numberFormat: '###  mbar'},
        { fileName: 'press_v.json', chartTitle: 'Air pressure', numberFormat: '###  mbar'},
        { fileName: 'battvolt.json', chartTitle: 'Battery voltage', numberFormat: '## V'},
        { fileName: 'battvolt_v.json', chartTitle: 'Battery voltage', numberFormat: '## V'},
],
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
          let fileList = [];

          if (!this.currentStation){
            // handle empty case, just return the empty list
            return fileList;
          }

          for (let i = 0; i < this.fileObjects.length; i++) {
              let fileObjectTemplate = {
                  fileName: this.currentStation.id + this.fileObjects[i].fileName,
                  chartTitle: this.fileObjects[i].chartTitle,
                  numberFormat: this.fileObjects[i].numberFormat,
              }
              fileList.push(fileObjectTemplate);
          }

          return fileList
        }
      },
};
</script>

<style scoped>

</style>