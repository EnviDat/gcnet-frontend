<template>
  <v-container fluid
                pa-0
                fill-height >

    <v-layout v-if="currentStation"
              row wrap >

      <v-flex xs12
              mb-2        
              class="display-1"
              style="text-align: center;">
        {{ `Detailed charts of ${ currentStation.name }` }}
      </v-flex>


      <v-flex xs12 md6
              my-1
              offset-md3 >
        <station-control :stationImage="stationImg"
                          :stationPreloadImage="stationPreloadImage"
                          :paramList="paramList"
                          @paramClick="catchParamClick"/>
      </v-flex>

      <v-flex xs12
              my-2>
        <v-layout column >

          <v-flex v-for="(fileObject, index) in generateFileList"
                  :key="fileObject.fileName"
                  :ref="fileObject.fileName"
                  :class="$vuetify.breakpoint.mdAndDown ? 'my-1' : 'my-3'">

              <DetailChart :url="baseUrl + fileObject.fileName"
                          :stationName="currentStation.name"
                          :fileObject="fileObject"
                          :chartId="chartId(fileObject.fileName)"
                          :delay="index * 500"
                          :valueFieldMapping="valueFieldMapping"
                          :preload="fileObject.preload"
                          :showDisclaimer="fileObject.showDisclaimer"
                          />
          </v-flex>
        </v-layout>

      </v-flex>

    </v-layout>

    <v-layout v-if="!currentStation"
              row wrap >

      <v-flex xs12>
        <stations-list @listClick="catchListClick"/>
      </v-flex>
    </v-layout>


    <v-btn
      fab
      color="accent"
      bottom
      right
      fixed
      @click.native.stop="backToTop" >
      <v-icon style="margin-left: 22px !important;">arrow_upwards</v-icon>
    </v-btn>
  </v-container>

</template>

<script>
import DetailChart from "@/components/DetailChart";
import StationControl from "@/components/StationControl";
import StationsList from "@/components/Navigation/StationsList";
import * as am4core from "@amcharts/amcharts4/core";
am4core.options.queue = true;

export default {
  name: 'Station',
  props: {
  },
  components: {
    DetailChart,
    StationControl,
    StationsList,
  },
  mounted() {
  },
  beforeDestroy(){
    am4core.unuseAllThemes();
    // console.log('disposeAllCharts via DetailPage');
    // am4core.disposeAllCharts();
  },
  watch: {
    currentStation() {
      if (this.currentStation){
        let imgs = require.context('@/assets/stations/', false, /\.jpg$/);
        let imgCache = {};

        imgs.keys().forEach((key) => {
          imgCache[key] = imgs(key);
        });

        this.stationImg = imgCache[`./${this.currentStation.alias}.jpg`];

        imgs = require.context('@/assets/cards', false, /\.jpg$/);
        imgCache = {};

        imgs.keys().forEach((key) => {
          imgCache[key] = imgs(key);
        });

        this.stationPreloadImage = imgCache[`./${this.currentStation.alias}.jpg`];
      }

      window.scrollTo(0, 0);
    },
  },
  methods: {
    stationRouteId(){
      return this.$route.params.id;
    },
    chartId(fileName){
      return `${this.stationId}_${fileName}`;
    },
    catchParamClick(fileName){
      let scrollToChart = null;

      for (let i = 0; i < this.fileObjects.length; i++) {
        const obj = this.fileObjects[i];

        if (obj.fileName.includes(fileName)){
          scrollToChart = obj.fileName;
          break;
        }        
      }

      if (scrollToChart){
        const scrollToKey = `${this.currentStation.id}${scrollToChart}`

        if (this.$refs && this.$refs[scrollToKey] && this.$refs[scrollToKey].length >= 1){
          const scrollToDOM = this.$refs[scrollToKey][0];
          const scrollY = scrollToDOM.offsetTop;
          window.scrollTo(0, scrollY);
        }
      }
    },
    backToTop(){
      window.scrollTo(0, 0);
    },
    catchListClick(stationToFind){
      const stationClicked = this.getStation(stationToFind);

      if (stationClicked){
        this.$router.push({ path: `/station/${stationClicked.alias}` });
      }

    },
    getStation(stationToFind){
      if (stationToFind) {
        const stations = this.$store.getters.stations;

        for (let i = 0; i < stations.length; i++) {
          const station = stations[i];

          if (station.id === stationToFind || station.alias === stationToFind || station.name === stationToFind){
            return station;
          }
        }
      }

      return null;
    }
  },
  computed: {
    generateFileList() {
      let fileList = [];

      if (!this.currentStation){
        // handle empty case, just return the empty list
        return fileList;
      }

      for (let i = 0; i < this.fileObjects.length; i++) {
        const fileObj = this.fileObjects[i];

        const fileObjectTemplate = {
          fileName: this.currentStation.id + fileObj.fileName,
          chartTitle: fileObj.chartTitle,
          numberFormat: fileObj.numberFormat,
          dateFormatTime: fileObj.dateFormatTime,
          preload: fileObj.preload,
          showDisclaimer: fileObj.showDisclaimer,
        }
        
        fileList.push(fileObjectTemplate);
      }

      return fileList;
    },
    paramList(){
      // just pick the first param name of the each list
      const params = [];
      const keys = Object.keys(this.valueFieldMapping);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        params.push({ fileName: key, paramName: this.valueFieldMapping[key][0].titleString });
      }

      return params;
    },
    currentStation(){
      const stationToFind = this.stationRouteId();
      return this.getStation(stationToFind);
    },
    baseUrl(){
      return process.env.NODE_ENV === 'production' ? this.baseStationURL : this.baseStationURLTestdata;
    },
    stationId(){
      return `${this.currentStation.id}_${this.currentStation.alias ? this.currentStation.alias : this.currentStation.name}`;
    },
  },
  data: () => ({
    baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURLTestdata: './testdata/',
    loadingStation: false,
    stationImg: null,
    stationPreloadImage: null,
    expand: false,
    fileObjects: [
      { fileName: 'temp_v.json', chartTitle: 'Air Temperatures Recent Days', numberFormat: '##  °C', dateFormatTime: true, preload: true, showDisclaimer: false },
      { fileName: 'temp.json', chartTitle: 'Air Temperatures Historical Data', numberFormat: '##  °C', dateFormatTime: false, preload: false, showDisclaimer: true },
      { fileName: 'wd_v.json', chartTitle: 'Wind Direction Recent Days', numberFormat: '###  °', dateFormatTime: true, preload: true, showDisclaimer: false },
      { fileName: 'wd.json', chartTitle: 'Wind Direction Historical Data', numberFormat: '###  °', dateFormatTime: false, preload: false, showDisclaimer: true },
      { fileName: 'ws_v.json', chartTitle: 'Wind Speed Recent Days', numberFormat: '###  m/s', dateFormatTime: true, preload: true, showDisclaimer: false },
      { fileName: 'ws.json', chartTitle: 'Wind Speed Historical Data', numberFormat: '###  m/s', dateFormatTime: false, preload: false, showDisclaimer: true },
      { fileName: 'rh_v.json', chartTitle: 'Relative Humidity Recent Days', numberFormat: '##  %', dateFormatTime: true, preload: true, showDisclaimer: false },
      { fileName: 'rh.json', chartTitle: 'Relative Humidity Historical Data', numberFormat: '##  %', dateFormatTime: false, preload: false, showDisclaimer: true },
      { fileName: 'rad_v.json', chartTitle: 'Radiation Recent Days', numberFormat: '###  W/m²', dateFormatTime: true, preload: true, showDisclaimer: false },
      { fileName: 'rad.json', chartTitle: 'Radiation Historical Data', numberFormat: '###  W/m²', dateFormatTime: false, preload: false, showDisclaimer: true },
      { fileName: 'sheight_v.json', chartTitle: 'Snow Heights Recent Days', numberFormat: '#.#  m', dateFormatTime: true, preload: true, showDisclaimer: false },
      { fileName: 'sheight.json', chartTitle: 'Snow Heights Historical Data', numberFormat: '#.#  m', dateFormatTime: false, preload: false, showDisclaimer: true },
      { fileName: 'press_v.json', chartTitle: 'Air Pressure Recent Days', numberFormat: '###  mbar', dateFormatTime: true, preload: true, showDisclaimer: false },
      { fileName: 'press.json', chartTitle: 'Air Pressure Historical Data', numberFormat: '###  mbar', dateFormatTime: false, preload: false, showDisclaimer: true },
      { fileName: 'battvolt_v.json', chartTitle: 'Battery Voltage Recent Days', numberFormat: '## V', dateFormatTime: true, preload: true, showDisclaimer: false },
      { fileName: 'battvolt.json', chartTitle: 'Battery Voltage Historical Data', numberFormat: '## V', dateFormatTime: false, preload: false, showDisclaimer: true },
    ],
    valueFieldMapping: {
      'temp': [
        {
            parameter: 'AirTC1',
            color: '#D26200',
            titleString: 'Thermocouple 1',
        },
        {
            parameter: 'AirTC2',
            color: '#0EAACD',
            titleString: 'Thermocouple 2',
        },
      ],
      'rh': [
          {   parameter: 'RH1',
              color: '#1DAFD7',
              titleString: 'Relative humidity 1',
          },
          {
              parameter: 'RH2',
              color: '#393DA3',
              titleString: 'Relative humidity 2',
          },
      ],
      'rad': [
          {
              parameter: 'NetRad',
              color: '#1C5197',
              titleString: 'Net radiation',
          },
          {
              parameter: 'SWin',
              color: '#E79F32',
              titleString: 'Short-wave incoming',
          },
          {
              parameter: 'SWout',
              color: '#9A6008',
              titleString: 'Short-wave outgoing',
          }
      ],
      'sheight': [
          {
              parameter: 'Sheight1',
              color: '#679DE2',
              titleString: 'Snow height 1',
          },
          {
              parameter: 'Sheight2',
              color: '#3375CD',
              titleString: 'Snow height 2',
          }
      ],
      'ws': [
        {   parameter: 'WS1',
            color: '#046401',
            titleString: 'Wind-speed 1',
        },
        {
            parameter: 'WS2',
            color: '#5ED352',
            titleString: 'Wind-speed 2',
        }
      ],
      'wd': [
          {
              parameter: 'WD1',
              color: '#046401',
              titleString: 'Wind-direction 1',
          },
          {
              parameter: 'WD2',
              color: '#2FCE32',
              titleString: 'Wind-direction 2',
          }
      ],
      'press': [
          {
              parameter: 'press',
              color: '#FF01FF',
              titleString: 'Atmospheric pressure',
          }
      ],
      'battvolt': [
        {
            parameter: 'BattVolt',
            color: '#27AE61',
            titleString: 'Battery voltage',
        }
      ],
    },
    // stationImgs: {},
  }),
};
</script>

<style scoped>

</style>