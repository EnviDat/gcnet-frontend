<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.smAndDown ? 'px-3 py-1' : 'px-2 py-1'"
                @click="anyClick">  

    <v-layout row wrap >

      <!-- <v-flex xs12
              py-3 >
        
        <chart :station="stations[0]" :JSONUrls="getJSONUrls(stations[0])" :fileValueMapping="fileValueMapping" />

      </v-flex> -->

      <v-flex v-for="station in stations"
              :key="`${station.id}_${station.alias}`"
              xs12
              py-3 >
        
        <mirco-chart :station="station" :JSONUrls="getJSONUrls(station)" :fileValueMapping="fileValueMapping" />

      </v-flex>

      <!-- <v-flex v-for="station in stations"
              :key="`${station.id}_${station.alias}`"
              xs12
              py-3 >
        
        {{ getJSONUrls(station) }}

      </v-flex> -->

    </v-layout>
  </v-container>
</template>

<script>
// import Chart from '@/components/Chart.vue';
import MircoChart from '@/components/MircoChart.vue';

export default {
  props: {
  },
  components: {
    // Chart,
    MircoChart,
  },
  data: () => ({
    baseStationURL: 'https://www.wsl.ch/gcnet/data/',
    baseStationURLTestdata: './testdata/',
    loadingStation: false,
    fileValueMapping: {
      'temp': ['AirT1'],
      // 'press': ['press'],
      // 'wd': ['WD1', 'WD2'],
      // 'ws': ['WS1', 'WS2'],
      // 'battvolt': ['battvolt'],
    },
  }),
  computed: {
    stations(){
      return this.$store.getters.stations;
    }
  },
  methods: {
    loadStation() {
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

        // add the timestamp to prevent server side caching
        const url = process.env.NODE_ENV === 'production' ? `${this.baseurl}${fileName}?t=${Date.now()}` : `./testdata/${fileName}`;
        dataURLs.push({ fileType: prefix, url });

        const recentUrl = process.env.NODE_ENV === 'production' ? `${this.baseurl}${recentFileName}?t=${Date.now()}` : `./testdata/${recentFileName}`;
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
