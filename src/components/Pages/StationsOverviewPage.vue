<template>
  <v-container fluid
                fill-height
                grid-list-md
                pa-2
                @click="anyClick">  

    <v-layout row wrap >

      <v-flex xs12 >
        <v-layout row wrap>

          <!-- <v-flex xs2>
            <micro-chart :station="stations[0]"
                          :JSONUrls="getJSONUrls(stations[0])"
                          :fileValueMapping="fileValueMapping"
                          @detailClick="(stationID) => { $emit('detailClick', stationID); }" />
          </v-flex> -->

          <v-flex v-for="(station, index) in stations"
                  :key="`${station.id}_${station.alias}`"
                  xs2>
            <micro-chart :station="station"
                          :JSONUrls="getJSONUrls(station)"
                          :fileValueMapping="fileValueMapping"
                          :delay="index * 500"
                          @detailClick="(stationID) => { $emit('detailClick', stationID); }" />
          </v-flex>
          
        </v-layout>
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import MicroChart from '@/components/MicroChart.vue';
import * as am4core from "@amcharts/amcharts4/core";
am4core.options.queue = true;

export default {
  name: 'StationOverviewPage',
  props: {
  },
  components: {
    MicroChart,
  },
  data: () => ({
    showMoreInfos: false,
    showMoreInfosText: 'More Information',
    baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURLTestdata: './testdata/',
    fileValueMapping: {
      // only use one single file and parameter for the microCharts
      'temp': ['AirT1'],
    },
  }),
  computed: {
    stations(){
      return this.$store.getters.stations;
    }
  },
  beforeDestroy(){
    this.clearCharts();
  },
  methods: {
    clearCharts() {
      am4core.unuseAllThemes();
      // console.log('disposeAllCharts via OverviewPage');
      // am4core.disposeAllCharts();
    },
    anyClick(){
      this.$emit('anyClick');
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
  },
};
</script>

<style scoped>

</style>
