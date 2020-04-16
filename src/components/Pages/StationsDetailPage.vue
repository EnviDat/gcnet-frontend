<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.mdAndDown ? 'px-1 py-1' : 'px-4 py-4'" >


    <v-layout row wrap >

          <v-flex>
<!--      <v-flex xs12 mx-4>-->
<!--         <v-flex mx-xs-1 mx-sm-1 mx-md-1 mx-lg-4 mx-xl-4  >-->

          <v-layout column >

            <v-flex  v-for="fileObject in generateFileList" :key="fileObject.fileName">
                <DetailChart :url="baseStationURL + fileObject.fileName" :fileObject="fileObject"
                             :chartdivID="fileObject.fileName"
                             :class="$vuetify.breakpoint.mdAndDown ? 'mb-1' : 'mb-4'"/>
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
        { fileName: 'temp.json', chartTitle: 'Air Temperatures Historical Data', numberFormat: '##  °C', dateFormatTime: false},
        { fileName: 'temp_v.json', chartTitle: 'Air Temperatures Recent Days', numberFormat: '##  °C', dateFormatTime: true},
        { fileName: 'rh.json', chartTitle: 'Relative Humidity Historical Data', numberFormat: '##  %', dateFormatTime: false},
        { fileName: 'rh_v.json', chartTitle: 'Relative Humidity Recent Days', numberFormat: '##  %', dateFormatTime: true},
        { fileName: 'rad.json', chartTitle: 'Radiation Historical Data', numberFormat: '###  W/m²', dateFormatTime: false},
        { fileName: 'rad_v.json', chartTitle: 'Radiation Recent Days', numberFormat: '###  W/m²', dateFormatTime: true},
        { fileName: 'sheight.json', chartTitle: 'Snow Heights Historical Data', numberFormat: '#.#  m', dateFormatTime: false},
        { fileName: 'sheight_v.json', chartTitle: 'Snow Heights Recent Days', numberFormat: '#.#  m', dateFormatTime: true},
        { fileName: 'ws.json', chartTitle: 'Wind Speed Historical Data', numberFormat: '###  m/s', dateFormatTime: false},
        { fileName: 'ws_v.json', chartTitle: 'Wind Speed Recent Days', numberFormat: '###  m/s', dateFormatTime: true},
        { fileName: 'wd.json', chartTitle: 'Wind Direction Historical Data', numberFormat: '###  °', dateFormatTime: false},
        { fileName: 'wd_v.json', chartTitle: 'Wind Direction Recent Days', numberFormat: '###  °', dateFormatTime: true},
        { fileName: 'press.json', chartTitle: 'Air Pressure Historical Data', numberFormat: '###  mbar', dateFormatTime: false},
        { fileName: 'press_v.json', chartTitle: 'Air Pressure Recent Days', numberFormat: '###  mbar', dateFormatTime: true},
        { fileName: 'battvolt.json', chartTitle: 'Battery Voltage Historical Data', numberFormat: '## V', dateFormatTime: false},
        { fileName: 'battvolt_v.json', chartTitle: 'Battery Voltage Recent Days', numberFormat: '## V', dateFormatTime: true},
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
                  dateFormatTime: this.fileObjects[i].dateFormatTime,
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