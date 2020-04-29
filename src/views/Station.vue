<template>
  <v-container fluid
                pa-0
                grid-list-lg
                fill-height >


    <v-layout row wrap >

      <v-flex xs12
              class="display-1"
              style="text-align: center;">
        {{ `Detailed charts of ${ currentStation.name }` }}
      </v-flex>


      <v-flex xs6
              offset-xs4 >
        <station-control :stationImage="stationImg"
                          :paramList="paramList"
                          @paramClick="catchParamClick"/>
      </v-flex>

      <v-flex xs12>
        <v-layout column >

          <v-flex v-for="(fileObject, index) in generateFileList"
                  :key="fileObject.fileName"
                  :ref="fileObject.fileName">
              <DetailChart :url="baseUrl + fileObject.fileName"
                          :stationName="currentStation.name"
                          :fileObject="fileObject"
                          :chartId="chartId(fileObject.fileName)"
                          :delay="index * 500"
                          :valueFieldMapping="valueFieldMapping"
                          :class="$vuetify.breakpoint.mdAndDown ? 'mb-1' : 'mb-4'"/>
          </v-flex>
        </v-layout>

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
import * as am4core from "@amcharts/amcharts4/core";
am4core.options.queue = true;

export default {
  name: 'Station',
  props: {
  },
  components: {
    DetailChart,
    StationControl,
  },
  beforeMount() {
    const imgs = require.context('@/assets/stations', false, /\.jpg$/);
    const imgCache = {};

    imgs.keys().forEach((key) => {
      imgCache[key] = imgs(key);
    });

    this.stationImgs = imgCache;
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
    expand: false,
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
    stationImgs: {},
  }),
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
    stationImg(){
      return this.currentStation ? this.stationImgs[`./${this.currentStation.alias}.jpg`] : '';
    },
  },
};
</script>

<style scoped>

</style>