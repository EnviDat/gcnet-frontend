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
    baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURLTestdata: './testdata/',
    visible: false,
    initialDelay: 1500,
    fileValueMapping: {
      // only use one single file and parameter for the microCharts
      'temp': ['AirTC1'],
    },
    cardImgs: {},
  }),
  computed: {
    stations(){
      return this.$store.getters.overviewStations;
    }
  },
  beforeMount() {
    const imgs = require.context('@/assets/cards', false, /\.jpg$/);
    const imgCache = {};

    imgs.keys().forEach((key) => {
      imgCache[key] = imgs(key);
    });

    this.cardImgs = imgCache;
  },
  mounted(){
    let that = this;

    setTimeout(() => {
      that.visible = true;
      that = null;
    }, this.initialDelay);
  },
  beforeDestroy(){
    this.clearCharts();
  },
  methods: {
    clearCharts() {
      // am4core.unuseAllThemes();
      // console.log('disposeAllCharts via OverviewPage');
      // am4core.disposeAllCharts();
    },
    mapStationClick(stationUrl){
      const splits = stationUrl.split('/');

      if (splits.length > 0) {
        const stationName = splits[splits.length - 1];
        this.changeCurrentStation(stationName);
      }
    },
    changeCurrentStation(newStation){
      this.$router.push({ path: `/station/${newStation}` });
      this.$emit('detailClick', newStation);
    },
    getJSONUrls(station){
      const dataURLs = [], recentDataURLs = [];
      const keys = Object.keys(this.fileValueMapping);

      for (let i = 0; i < keys.length; i++) {
        const prefix = keys[i];
        const fileName = `${station.id}${prefix}.json`;
        const recentFileName = `${station.id}${prefix}_v.json`;
        const baseUrl = process.env.NODE_ENV === 'production' ? this.baseStationURL : this.baseStationURLTestdata;

        // add the timestamp to prevent server side caching
        // const url = `${baseUrl}${fileName}?t=${Date.now()}`;
        const url = `${baseUrl}${fileName}`;
        dataURLs.push({ fileType: prefix, url });

        // const recentUrl = `${baseUrl}${recentFileName}?t=${Date.now()}`;
        const recentUrl = `${baseUrl}${recentFileName}`;
        recentDataURLs.push({ fileType: prefix, url: recentUrl });
      }

      return {
        dataURLs,
        recentDataURLs,
      };
    },
    stationImg(alias){
      return this.cardImgs[`./${alias}.jpg`];
    },
  },
};
</script>

<style scoped>

</style>
