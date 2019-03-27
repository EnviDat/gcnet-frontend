<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.smAndDown ? 'pa-1' : 'pa-2'"
                @click="anyClick">  

    <v-layout row wrap >
  
      <v-flex xs12 offset-xs6
          v-if="loadingStation"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          
          />
      </v-flex>

      <v-flex xs12
              v-show="!loadingStation && !showHomeScreen"
                >

        <iframe :style="`height: 100%; width: 100%;`"
                ref="station_iframe"
                src=""
                frameborder="0" >
        </iframe>
      </v-flex>

      <v-flex xs12 md9 offset-md3 px-5 
              v-show="showHomeScreen" >

        <v-layout column>
          <v-flex>
            <title-view :title="homeInfos.title"
                        :slogan="homeInfos.startText"
                        />
          </v-flex>
          <v-flex pt-5>
            <p v-html="homeInfos.homeText"></p>
          </v-flex>
        </v-layout>


      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import vuex from 'vuex';
// import { mapGetters } from 'vuex';
import BaseClickCard from '@/components/BaseElements/BaseClickCard.vue';
import ControlPanelView from '@/components/ControlPanelView.vue';
import TitleView from '@/components/TitleView.vue';
import homeInfos from '@/homeInfos';
// import mapHTML from '@/map_html.html';
// import StationsMap from '@/components/StationsMap';

export default {
  props: {
    currentStation: Object,
    showHomeScreen: Boolean,
  },
  components: {
    BaseClickCard,
    ControlPanelView,
    TitleView,
    // StationsMap,
  },
  data: () => ({
    baseStationURL: 'https://www.wsl.ch/gcnet/stations/',
    loadingStation: false,
    currentStationName: '',
    homeInfos,
    // mapHTML,
  }),
  watch: {
    currentStation: function updateStation() {
      if (this.currentStation) {
        this.loadStation(this.currentStation);
      }
    },
  },
  methods: {
    isActiveControl(number) {
      return this.$store.getters.controls.includes(number);
    },
    checkStations() {
      const stations = this.$store.getters.stations;

      for (let index in stations) {
        const station = stations[index];
        
        station.urlValid = this.UrlExists(this.baseStationURL + station.alias);
      }
    },
    // UrlExists(url) {
    //     var http = new XMLHttpRequest();
    //     http.open('HEAD', url, false);
    //     http.send();
    //     // if (http.status != 404)
    //         return http.status != 404
    //     // else
    //         // window.location.reload();
    // },
    // catchHomeClick() {
    //   this.showHomeScreen = true;
    // },
    // catchListClick: function catchListClick() {
    //   this.$store.state.controls = [this.$store.getters.listViewPos];
    // },
    // catchMapClick: function catchMapClick() {
    //   this.$store.state.controls = [this.$store.getters.mapViewPos];
    // },
    // catchCategoryClicked(cardTitle) {
    //   const station = this.getStation(cardTitle);

    //   if (station){
    //     this.showHomeScreen = false;
    //     this.loadStation(station);
    //   }
    // },
    anyClick(){
      this.$emit('anyClick');
    },
    loadStation(station) {
      this.loadingStation = true;

      this.currentStationName = station.name;

      const that = this;
      this.$refs.station_iframe.onload = function(event){
        that.loadingStation = false;
        // console.log('loaded iframe ' + this + " content : " + this.contentDocument + " window : " + this.contentWindow);
      };

      this.$refs.station_iframe.onerror = function(err){
        // this.loadingStation = false;
        // console.log('error the iframe ' + err);
        that.$refs.station_iframe.src = null;
        this.currentStationName = '';
      };

      this.$refs.station_iframe.src = this.baseStationURL + station.alias;
    },
    iframeScreenHeight() {
      return window.innerHeight - 150;
    },
    // randomImg(name) {
    //   const keys = Object.keys(this.cardImgs);
    //   let rnd = 0;

    //   if (keys.length > 0) {
    //     // rnd = this.randomIntFromInterval(0, keys.length - 1);
    //     rnd = this.randomIntFromSeed(0, keys.length - 1)
    //   }

    //   return this.cardImgs[keys[rnd]];
    // },
  },

};
</script>

<style scoped>


  iframe html .wrap,
  iframe html .measurement-panel {
    padding: 0 !important;
  }

</style>
