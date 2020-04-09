<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.mdAndDown ? 'px-1 py-1' : 'px-4 py-4'" >


    <v-layout row wrap >

          <v-flex>

          <v-layout column >

<!--            <v-flex  v-for="fileObject in generateFileList" :key="fileObject.fileName">-->
<!--              <ZoomChart :url1="baseStationURL + fileObject.fileName1" :fileObject="fileObject"-->
<!--                :chartdivID="fileObject.fileName"-->

                 <v-flex  v-for="fileObject in generateFileList" :key="fileObject.dataParameter">
                   <ZoomChart :url1="baseStationURL + fileObject.fileName1"
                              :url2="baseStationURL + fileObject.fileName2" :fileObject="fileObject"
                                :chartdivID="fileObject.dataParameter"
                             :class="$vuetify.breakpoint.mdAndDown ? 'mb-1' : 'mb-4'"/>

<!--                <DetailChart :url="baseStationURL + fileObject.fileName" :fileObject="fileObject"-->
<!--                             :chartdivID="fileObject.fileName"-->
<!--                             :class="$vuetify.breakpoint.mdAndDown ? 'mb-1' : 'mb-4'"/>-->
            </v-flex>


          </v-layout>

      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>

// import DetailChart from "../DetailChart";
import ZoomChart from "../ZoomChart";


export default {
  props: {
    currentStation: Object,
  },
  components: {
   // DetailChart,
   ZoomChart
  },
  data: () => ({
    // baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURL: './testdata/',
    loadingStation: false,
    fileObjects: [
        { fileName1: 'temp.json', fileName2: 'temp_v.json', chartTitle: 'Air temperatures', numberFormat: '##  °C', dateFormatTime: false, dataParameter: 'temp'},
       // { fileName: 'temp_v.json', chartTitle: 'Air temperatures', numberFormat: '##  °C', dateFormatTime: true, dataParameter: 'temp'},
        { fileName1: 'rh.json', fileName2: 'rh_v.json', chartTitle: 'Relative humidity', numberFormat: '##  %', dateFormatTime: false, dataParameter: 'rh'},
      //  { fileName: 'rh_v.json', chartTitle: 'Relative humidity', numberFormat: '##  %', dateFormatTime: true, dataParameter: 'rh'},
        // { fileName: 'rad.json', chartTitle: 'Radiation', numberFormat: '###  W/m²', dateFormatTime: false},
        // { fileName: 'rad_v.json', chartTitle: 'Radiation', numberFormat: '###  W/m²', dateFormatTime: true},
        // { fileName: 'sheight.json', chartTitle: 'Snow heights', numberFormat: '#.#  m', dateFormatTime: false},
        // { fileName: 'sheight_v.json', chartTitle: 'Snow heights', numberFormat: '#.#  m', dateFormatTime: true},
        // { fileName: 'ws.json', chartTitle: 'Wind speed', numberFormat: '###  m/s', dateFormatTime: false},
        // { fileName: 'ws_v.json', chartTitle: 'Wind speed', numberFormat: '###  m/s', dateFormatTime: true},
        // { fileName: 'wd.json', chartTitle: 'Wind direction', numberFormat: '###  °', dateFormatTime: false},
        // { fileName: 'wd_v.json', chartTitle: 'Wind direction', numberFormat: '###  °', dateFormatTime: true},
        // { fileName: 'press.json', chartTitle: 'Air pressure', numberFormat: '###  mbar', dateFormatTime: false},
        // { fileName: 'press_v.json', chartTitle: 'Air pressure', numberFormat: '###  mbar', dateFormatTime: true},
        // { fileName: 'battvolt.json', chartTitle: 'Battery voltage', numberFormat: '## V', dateFormatTime: false},
        // { fileName: 'battvolt_v.json', chartTitle: 'Battery voltage', numberFormat: '## V', dateFormatTime: true},
],
  }),
  computed: {

      generateFileList() {
          let fileList = [];

          if (!this.currentStation){
            // handle empty case, just return the empty list
            return fileList;
          }

          for (let i = 0; i < this.fileObjects.length; i++) {
              let fileObjectTemplate = {
                  // fileName: this.currentStation.id + this.fileObjects[i].fileName,
                  fileName1: this.currentStation.id + this.fileObjects[i].fileName1,
                  fileName2: this.currentStation.id + this.fileObjects[i].fileName2,
                  chartTitle: this.fileObjects[i].chartTitle,
                  numberFormat: this.fileObjects[i].numberFormat,
                  dateFormatTime: this.fileObjects[i].dateFormatTime,
                  dataParameter: this.fileObjects[i].dataParameter,
              };
              fileList.push(fileObjectTemplate);
          }

          return fileList
        }
      },
};
</script>

<style scoped>

</style>