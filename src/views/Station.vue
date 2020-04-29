<template>
  <v-container fluid
                pa-0
                fill-height >


    <v-layout row wrap >

      <v-flex xs12
              pb-3
              class="display-1"
              style="text-align: center;">
        {{ `Detailed charts of ${currentStation.name}` }}
      </v-flex>

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
import DetailChart from "@/components/DetailChart";
import * as am4core from "@amcharts/amcharts4/core";
am4core.options.queue = true;

export default {
  name: 'Station',
  props: {
  },
  components: {
    DetailChart,
  },
  mounted() {
    window.scrollTo(0, 0);
  },
  beforeDestroy(){
    am4core.unuseAllThemes();
    // console.log('disposeAllCharts via DetailPage');
    // am4core.disposeAllCharts();
  },
  data: () => ({
    baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURLTestdata: './testdata/',
    loadingStation: false,
    fileObjects: [
      { fileName: 'temp_v.json', chartTitle: 'Air Temperatures Recent Days', numberFormat: '##  °C', dateFormatTime: true },
      { fileName: 'temp.json', chartTitle: 'Air Temperatures Historical Data', numberFormat: '##  °C', dateFormatTime: false },
      { fileName: 'wd_v.json', chartTitle: 'Wind Direction Recent Days', numberFormat: '###  °', dateFormatTime: true },
      { fileName: 'wd.json', chartTitle: 'Wind Direction Historical Data', numberFormat: '###  °', dateFormatTime: false },
      { fileName: 'ws_v.json', chartTitle: 'Wind Speed Recent Days', numberFormat: '###  m/s', dateFormatTime: true },
      { fileName: 'ws.json', chartTitle: 'Wind Speed Historical Data', numberFormat: '###  m/s', dateFormatTime: false },
      { fileName: 'rh_v.json', chartTitle: 'Relative Humidity Recent Days', numberFormat: '##  %', dateFormatTime: true },
      { fileName: 'rh.json', chartTitle: 'Relative Humidity Historical Data', numberFormat: '##  %', dateFormatTime: false },
      { fileName: 'rad_v.json', chartTitle: 'Radiation Recent Days', numberFormat: '###  W/m²', dateFormatTime: true },
      { fileName: 'rad.json', chartTitle: 'Radiation Historical Data', numberFormat: '###  W/m²', dateFormatTime: false },
      { fileName: 'sheight_v.json', chartTitle: 'Snow Heights Recent Days', numberFormat: '#.#  m', dateFormatTime: true },
      { fileName: 'sheight.json', chartTitle: 'Snow Heights Historical Data', numberFormat: '#.#  m', dateFormatTime: false },
      { fileName: 'press_v.json', chartTitle: 'Air Pressure Recent Days', numberFormat: '###  mbar', dateFormatTime: true },
      { fileName: 'press.json', chartTitle: 'Air Pressure Historical Data', numberFormat: '###  mbar', dateFormatTime: false },
      { fileName: 'battvolt_v.json', chartTitle: 'Battery Voltage Recent Days', numberFormat: '## V', dateFormatTime: true },
      { fileName: 'battvolt.json', chartTitle: 'Battery Voltage Historical Data', numberFormat: '## V', dateFormatTime: false },
    ],
  }),
  methods: {
    stationRouteId(){
      return this.$route.params.id;
    },
    chartId(fileName){
      return `${this.stationId}_${fileName}`;
    },
  },
  computed: {
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
    currentStation(){
      const stations = this.$store.getters.stations;
      const stationToFind = this.stationRouteId();

      for (let i = 0; i < stations.length; i++) {
        const station = stations[i];

        if (station.id === stationToFind || station.alias === stationToFind || station.name === stationToFind){
          return station;
        }
      }

      return null;
    },
    baseUrl(){
      return process.env.NODE_ENV === 'production' ? this.baseStationURL : this.baseStationURLTestdata;
    },
    stationId(){
      return `${this.currentStation.id}_${this.currentStation.alias ? this.currentStation.alias : this.currentStation.name}`;
    },
  },
};
</script>

<style scoped>

</style>