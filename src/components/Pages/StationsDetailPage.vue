<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.mdAndDown ? 'px-1 py-1' : 'px-4 py-4'" >


    <v-layout row wrap >

      <v-flex>
        <v-layout column >

          <v-flex  v-for="(fileObject, index) in generateFileList" :key="fileObject.fileName">
              <DetailChart :url="baseUrl + fileObject.fileName"
                          :stationName="currentStation.name"
                          :fileObject="fileObject"
                          :chartId="chartId(fileObject.fileName)"
                          :delay="index * 500"
                          :class="$vuetify.breakpoint.mdAndDown ? 'mb-1' : 'mb-4'"/>
          </v-flex>
        </v-layout>

      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
import DetailChart from "../DetailChart";
import * as am4core from "@amcharts/amcharts4/core";

export default {
  props: {
    currentStation: Object,
  },
  components: {
    DetailChart,
   // DetailChartTest
  },
  beforeDestroy(){
    am4core.unuseAllThemes();
    am4core.disposeAllCharts();
  },
  data: () => ({
    baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURLTestdata: './testdata/',
    loadingStation: false,
    fileObjects: [
      { fileName: 'temp_v.json', chartTitle: 'Air Temperatures Recent Days', numberFormat: '##  °C', dateFormatTime: true },
      { fileName: 'temp.json', chartTitle: 'Air Temperatures Historical Data', numberFormat: '##  °C', dateFormatTime: false },
      { fileName: 'rh_v.json', chartTitle: 'Relative Humidity Recent Days', numberFormat: '##  %', dateFormatTime: true },
      { fileName: 'rh.json', chartTitle: 'Relative Humidity Historical Data', numberFormat: '##  %', dateFormatTime: false },
      { fileName: 'rad_v.json', chartTitle: 'Radiation Recent Days', numberFormat: '###  W/m²', dateFormatTime: true },
      { fileName: 'rad.json', chartTitle: 'Radiation Historical Data', numberFormat: '###  W/m²', dateFormatTime: false },
      { fileName: 'sheight_v.json', chartTitle: 'Snow Heights Recent Days', numberFormat: '#.#  m', dateFormatTime: true },
      { fileName: 'sheight.json', chartTitle: 'Snow Heights Historical Data', numberFormat: '#.#  m', dateFormatTime: false },
      { fileName: 'ws_v.json', chartTitle: 'Wind Speed Recent Days', numberFormat: '###  m/s', dateFormatTime: true },
      { fileName: 'ws.json', chartTitle: 'Wind Speed Historical Data', numberFormat: '###  m/s', dateFormatTime: false },
      { fileName: 'wd_v.json', chartTitle: 'Wind Direction Recent Days', numberFormat: '###  °', dateFormatTime: true },
      { fileName: 'wd.json', chartTitle: 'Wind Direction Historical Data', numberFormat: '###  °', dateFormatTime: false },
      { fileName: 'press_v.json', chartTitle: 'Air Pressure Recent Days', numberFormat: '###  mbar', dateFormatTime: true },
      { fileName: 'press.json', chartTitle: 'Air Pressure Historical Data', numberFormat: '###  mbar', dateFormatTime: false },
      { fileName: 'battvolt_v.json', chartTitle: 'Battery Voltage Recent Days', numberFormat: '## V', dateFormatTime: true },
      { fileName: 'battvolt.json', chartTitle: 'Battery Voltage Historical Data', numberFormat: '## V', dateFormatTime: false },
    ],
  }),
  computed: {
    baseUrl(){
      return process.env.NODE_ENV === 'production' ? this.baseStationURL : this.baseStationURLTestdata;
    },
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

      return fileList;
    },
    stationId(){
      return `${this.currentStation.id}_${this.currentStation.alias ? this.currentStation.alias : this.currentStation.name}`;
    },
  },
  methods: {
    chartId(fileName){
      return `${this.stationId}_${fileName}`;
    },
  },
};
</script>

<style scoped>

</style>