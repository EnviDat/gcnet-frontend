<template>
  <v-container fluid
                fill-height
                grid-list-md
                pa-0 >

    <v-layout row wrap >

      <v-flex xs12 offset-md4>
        <p v-html="homeInfos.smallInfo"></p>
      </v-flex>

      <v-flex xs12 sm3>
        <stations-map @mapClick="mapStationClick" />
      </v-flex>

      <v-flex v-if="!visible"
              xs12 sm9>
        <v-layout row wrap justify-center>
          <v-flex shrink
                  class="title">
            Loading MicroCharts...
          </v-flex>
        </v-layout>
      </v-flex>

      <v-flex v-if="visible"
              xs12 sm9 >
        <v-layout row wrap>

          <!-- <v-flex xs12 md4 lg3>
            <micro-chart :station="stations[0]"
                          :JSONUrls="getJSONUrls(stations[0])"
                          :fileValueMapping="fileValueMapping"
                          @detailClick="(stationID) => { changeCurrentStation(stationID); }" />
          </v-flex> -->

          <v-flex v-for="(station, index) in stations"
                  :key="`${station.id}_${station.alias}`"
                  xs12 md4 lg3>
            <micro-chart :station="station"
                          :image="stationImg(station.alias)"
                          :JSONUrls="getJSONUrls(station)"
                          :fileValueMapping="fileValueMapping"
                          :delay="index * 100"
                          @detailClick="(stationID) => { changeCurrentStation(stationID); }" />
          </v-flex>
          
        </v-layout>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import homeInfos from '@/homeInfos';
import StationsMap from '@/components/StationsMap';
import MicroChart from '@/components/MicroChart.vue';
import { addStartEndDateUrl } from '@/chartData/charts';
// import * as am4core from "@amcharts/amcharts4/core";
// am4core.options.queue = true;

export default {
  name: 'StationOverviewPage',
  props: {
  },
  components: {
    MicroChart,
    StationsMap,
  },
  data: () => ({
    homeInfos,
    baseStationURL: 'https://www.envidat.ch/data-api/gcnet/json',
    baseStationURLTestdata: 'https://www.envidat.ch/data-api/gcnet/json',
    visible: false,
    initialDelay: 1500,
    fileValueMapping: {
      // only use one single file and parameter for the microCharts
      temp: ['airtemp1'],
    },
    cardImgs: {},
  }),
  computed: {
    stations() {
      return this.$store.getters.overviewStations;
    },
  },
  beforeMount() {
    const imgs = require.context('@/assets/cards', false, /\.jpg$/);
    const imgCache = {};

    imgs.keys().forEach((key) => {
      imgCache[key] = imgs(key);
    });

    this.cardImgs = imgCache;
  },
  mounted() {
    let that = this;

    setTimeout(() => {
      that.visible = true;
      that = null;
    }, this.initialDelay);
  },
  beforeDestroy() {
    this.clearCharts();
  },
  methods: {
    clearCharts() {
      // am4core.unuseAllThemes();
      // console.log('disposeAllCharts via OverviewPage');
      // am4core.disposeAllCharts();
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
    getJSONUrls(station) {
      const dataURLs = []; const 
      recentDataURLs = [];
      const keys = Object.keys(this.fileValueMapping);

      // 1.5 months for the recent data, 2 years for historical
      const recentDayRange = 45;
      const historicalDayRange = 730;
      const baseUrl = process.env.NODE_ENV === 'production' ? this.baseStationURL : this.baseStationURLTestdata;

      for (let i = 0; i < keys.length; i++) {
        const prefix = keys[i];
        const parameter = this.fileValueMapping[prefix];
        // const fileName = `${station.id}${prefix}.json`;
        // const recentFileName = `${station.id}${prefix}_v.json`;

        // add the timestamp to prevent server side caching
        // const url = `${baseUrl}${fileName}?t=${Date.now()}`;
        // https://www.envidat.ch/data-api/gcnet/json/swisscamp/windspeed1,windspeed2/2019-08-06T12:00:00/2021-08-05T14:00:00+02:00/
        let url = `${baseUrl}/${station.aliasApi}/${parameter}/`;
        url = addStartEndDateUrl(url, historicalDayRange);

        dataURLs.push({ fileType: prefix, url });

        // const recentUrl = `${baseUrl}${recentFileName}?t=${Date.now()}`;
        // https://www.envidat.ch/data-api/gcnet/json/swisscamp_10m_tower/airtemp1/2022-09-13T06:15:41/2022-09-27T08:15:41/
        // const recentUrl = `${baseUrl}${recentFileName}`;
        let recentUrl = `${baseUrl}/${station.aliasApi}/${parameter}/`;
        recentUrl = addStartEndDateUrl(recentUrl, recentDayRange);

        recentDataURLs.push({ fileType: prefix, url: recentUrl });
      }

      return {
        dataURLs,
        recentDataURLs,
      };
    },
    stationImg(alias) {
      return this.cardImgs[`./${alias}.jpg`];
    },
  },
};
</script>

<style scoped>

</style>
