<template>
  <v-container fluid
                grid-list-lg
                pa-0
                fill-height >

    <v-layout v-if="currentStation"
              row wrap >

      <v-flex xs12 md3>
        <stations-map :height="'60vh'"
                      :currentStation="currentStation"
                      @mapClick="mapStationClick" />
      </v-flex>

      <v-flex xs12 md8 >
        <station-control :stationName="currentStation.name"
                          :stationImage="stationImg"
                          :stationPreloadImage="stationPreloadImage"
                          :paramList="paramList"
                          @paramClick="catchParamClick"
                          @localTimeClick="catchLocalTimeClick" />
      </v-flex>

      <v-flex xs12 >
        <v-layout column >

          <v-flex v-for="fileObject in generateFileList"
                  :key="fileObject.fileName"
                  :ref="chartId(fileObject.fileName)"
                  >

              <DetailChart :url="getDetailChartUrl(currentStation)"
                          :stationName="currentStation.name"
                          :fileObject="fileObject"
                          :chartId="chartId(fileObject.fileName)"
                          :valueFieldMapping="valueFieldMapping"
                          :preload="fileObject.preload"
                          :showDisclaimer="fileObject.showDisclaimer"
                          :convertLocalTime="convertLocalTime"
                          :key="fileObject.fileName + reRenderKey"
                          :showRecentData="fileObject.showRecentData"
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
import StationsMap from '@/components/StationsMap';
import DetailChart from '@/components/DetailChart';
import StationControl from '@/components/StationControl';
import StationsList from '@/components/Navigation/StationsList';
// import * as am4core from "@amcharts/amcharts4/core";
// am4core.options.queue = true;

export default {
  name: 'Station',
  props: {
  },
  components: {
    DetailChart,
    StationControl,
    StationsList,
    StationsMap,
  },
  created() {
    this.reRenderKey = new Date().toUTCString();
  },
  mounted() {
    const stationToFind = this.stationRouteId();
    this.currentStation = this.getStation(stationToFind);
  },
  beforeDestroy() {
    // am4core.unuseAllThemes();
    // console.log('disposeAllCharts via DetailPage');
    // am4core.disposeAllCharts();
  },
  watch: {
    $route(to) {
      const stationToFind = to.params.id;
      this.currentStation = this.getStation(stationToFind);
    },
    currentStation() {
      if (this.currentStation) {
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
    getDetailChartUrl(station) {
      return `${this.baseUrl}/${station.aliasApi}/`;
    },
    mapStationClick(stationUrl) {
      const splits = stationUrl.split('/');

      if (splits.length > 0) {
        const stationName = splits[splits.length - 1];
        this.changeCurrentStation(stationName);
      }
    },
    changeCurrentStation(newStation) {
      this.$router.push({ path: `/station/${newStation}` });
      this.$emit('detailClick', newStation);
    },
    stationRouteId() {
      return this.$route.params.id;
    },
    chartId(fileName) {
      return `${this.stationId}_${fileName}`;
    },
    catchParamClick(fileName) {
      let scrollToChart = '';

      for (let i = 0; i < this.fileObjects.length; i++) {
        const obj = this.fileObjects[i];

        if (obj.fileName.includes(fileName)) {
          scrollToChart = this.chartId(obj.fileName);
          break;
        }        
      }

      if (scrollToChart) {
        if (this.$refs && this.$refs[scrollToChart] && this.$refs[scrollToChart].length >= 1) {
          const scrollToDOM = this.$refs[scrollToChart][0];
          const scrollY = scrollToDOM.offsetTop;
          window.scrollTo(0, scrollY);
        }
      }
    },
    catchLocalTimeClick(convertLocalTime) {
      this.convertLocalTime = convertLocalTime;
      this.reRenderKey = new Date().toUTCString();
    },
    backToTop() {
      window.scrollTo(0, 0);
    },
    catchListClick(stationToFind) {
      const stationClicked = this.getStation(stationToFind);

      if (stationClicked) {
        this.$router.push({ path: `/station/${stationClicked.alias}` });
      }

    },
    getStation(stationToFind) {
      if (stationToFind) {
        const stations = this.$store.getters.stations;

        for (let i = 0; i < stations.length; i++) {
          const station = stations[i];

          if (station.id === stationToFind || station.alias === stationToFind || station.name === stationToFind) {
            return station;
          }
        }
      }

      return null;
    },
  },
  computed: {
    generateFileList() {
      const fileList = [];

      if (!this.currentStation) {
        // handle empty case, just return the empty list
        return fileList;
      }

      for (let i = 0; i < this.fileObjects.length; i++) {
        const fileObj = this.fileObjects[i];

        const fileObjectTemplate = {
          fileName: this.currentStation.id + fileObj.fileName,
          ...fileObj,
        };
        
        fileList.push(fileObjectTemplate);
      }

      return fileList;
    },
    paramList() {
      // just pick the first param name of the each list
      const params = [];
      const keys = Object.keys(this.valueFieldMapping);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        params.push({ fileName: key, paramName: this.valueFieldMapping[key][0].titleString });
      }

      return params;
    },
    baseUrl() {
      return process.env.NODE_ENV === 'production' ? this.baseStationURL : this.baseStationURLTestdata;
    },
    stationId() {
      return `${this.currentStation.id}_${this.currentStation.alias ? this.currentStation.alias : this.currentStation.name}`;
    },
  },
  data: () => ({
    baseStationURL: 'https://www.envidat.ch/data-api/gcnet/json',
    baseStationURLTestdata: 'https://www.envidat.ch/data-api/gcnet/json',
    loadingStation: false,
    stationImg: null,
    stationPreloadImage: null,
    currentStation: null,
    expand: false,
    convertLocalTime: false,
    reRenderKey: null,
    fileObjects: [
      {
       fileName: 'temp_v.json', chartTitle: 'Air Temperatures Recent Days', numberFormat: '##  °C', dateFormatTime: true, preload: true, showDisclaimer: false, showRecentData: true,
      },
      {
       fileName: 'temp.json', chartTitle: 'Air Temperatures Historical Data', numberFormat: '##  °C', dateFormatTime: false, preload: true, showDisclaimer: false, showRecentData: false,
      },
      {
       fileName: 'ws_v.json', chartTitle: 'Wind Speed Recent Days', numberFormat: '###  m/s', dateFormatTime: true, preload: true, showDisclaimer: false, showRecentData: true,
      },
      {
       fileName: 'ws.json', chartTitle: 'Wind Speed Historical Data', numberFormat: '###  m/s', dateFormatTime: false, preload: true, showDisclaimer: false, showRecentData: false,
      },
      {
       fileName: 'wd_v.json', chartTitle: 'Wind Direction Recent Days', numberFormat: '###  °', dateFormatTime: true, preload: true, showDisclaimer: false, showRecentData: true,
      },
      {
       fileName: 'wd.json', chartTitle: 'Wind Direction Historical Data', numberFormat: '###  °', dateFormatTime: false, preload: true, showDisclaimer: false, showRecentData: false,
      },
      {
       fileName: 'rh_v.json', chartTitle: 'Relative Humidity Recent Days', numberFormat: '##  %', dateFormatTime: true, preload: true, showDisclaimer: false, seriesNumberFormat: '#.', showRecentData: true,
      },
      {
       fileName: 'rh.json', chartTitle: 'Relative Humidity Historical Data', numberFormat: '##  %', dateFormatTime: false, preload: true, showDisclaimer: false, seriesNumberFormat: '#.', showRecentData: false,
      },
      {
       fileName: 'rad_v.json', chartTitle: 'Radiation Recent Days', numberFormat: '###  W/m²', dateFormatTime: true, preload: true, showDisclaimer: false, showRecentData: true,
      },
      {
       fileName: 'rad.json', chartTitle: 'Radiation Historical Data', numberFormat: '###  W/m²', dateFormatTime: false, preload: true, showDisclaimer: false, showRecentData: false,
      },
      {
       fileName: 'sheight_v.json', chartTitle: 'Snow Heights Recent Days', numberFormat: '#.##  m', dateFormatTime: true, preload: true, showDisclaimer: false, seriesNumberFormat: '#.00', showRecentData: true,
      },
      {
       fileName: 'sheight.json', chartTitle: 'Snow Heights Historical Data', numberFormat: '#.##  m', dateFormatTime: false, preload: true, showDisclaimer: false, showRecentData: false,
      },
      {
       fileName: 'press_v.json', chartTitle: 'Air Pressure Recent Days', numberFormat: '###  mbar', dateFormatTime: true, preload: true, showDisclaimer: false, showRecentData: true,
      },
      {
       fileName: 'press.json', chartTitle: 'Air Pressure Historical Data', numberFormat: '###  mbar', dateFormatTime: false, preload: true, showDisclaimer: false, showRecentData: false,
      },
      {
       fileName: 'battvolt_v.json', chartTitle: 'Battery Voltage Recent Days', numberFormat: '## V', dateFormatTime: true, preload: true, showDisclaimer: false,
      },
      {
       fileName: 'battvolt.json', chartTitle: 'Battery Voltage Historical Data', numberFormat: '## V', dateFormatTime: false, preload: true, showDisclaimer: false, showRecentData: false,
      },
    ],
    valueFieldMapping: {
      temp: [
        {
            parameter: 'airtemp1',
            color: '#D48E00',
            negativeColor: '#00CED4',
            titleString: 'Thermocouple 1',
            precision: 1,
        },
        {
            parameter: 'airtemp2',
            color: '#D26200',
            negativeColor: '#07AACD',
            titleString: 'Thermocouple 2',
            precision: 1,
        },
      ],
      ws: [
        {
            parameter: 'windspeed1',
            color: '#046401',
            titleString: 'Wind-speed 1',
            precision: 1,
        },
        {
            parameter: 'windspeed2',
            color: '#5ED352',
            titleString: 'Wind-speed 2',
            precision: 1,
        },
      ],
      wd: [
        {
          parameter: 'winddir1',
          color: '#046401',
          titleString: 'Wind-direction 1',
          precision: 1,
        },
        {
          parameter: 'winddir2',
          color: '#2FCE32',
          titleString: 'Wind-direction 2',
          precision: 1,
        },
      ],
      rh: [
        {
            parameter: 'rh1',
            color: '#1DAFD7',
            titleString: 'Relative humidity 1',
        },
        {
            parameter: 'rh2',
            color: '#393DA3',
            titleString: 'Relative humidity 2',
        },
      ],
      rad: [
        {
          parameter: 'swin',
          color: '#E79F32',
          titleString: 'Short-wave incoming',
          precision: 1,
        },
        {
          parameter: 'swout',
          color: '#9A6008',
          titleString: 'Short-wave outgoing',
          precision: 1,
        },
        {
          parameter: 'netrad',
          color: '#1C5197',
          titleString: 'Net radiation',
          precision: 1,
        },
      ],
      sheight: [
        {
          parameter: 'sh1',
          color: '#679DE2',
          titleString: 'Snow height 1',
          precision: 2,
        },
        {
          parameter: 'sh2',
          color: '#3375CD',
          titleString: 'Snow height 2',
          precision: 2,
        },
      ],
      press: [
        {
          parameter: 'pressure',
          color: '#FF01FF',
          titleString: 'Atmospheric pressure',
          precision: 1,
        },
      ],
      battvolt: [
        {
          parameter: 'battvolt',
          color: '#27AE61',
          titleString: 'Battery voltage',
          precision: 1,
        },
      ],
    },
  }),
};
</script>

<style scoped>

</style>
