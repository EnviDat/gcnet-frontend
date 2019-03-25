<template>
  <v-container fluid
                :class="$vuetify.breakpoint.smAndDown ? 'pa-1' : 'pa-2'">  

    <v-layout row wrap >
  
      <v-flex mt-2 xs12 md3>
    
          <v-layout column >
            <v-flex>
              <title-view />
              <control-panel-view v-on:homeClick="catchHomeClicked"/>
            </v-flex>

            <iframe v-if="isActiveControl($store.getters.mapViewPos)"
                    :style="`height: ${iframeScreenHeight()}px`"
                    ref="map_iframe"
                    class="flex mt-2 px-3 xs6"
                    src="https://www.wsl.ch/gcnet/map.php"
                    frameborder="0" >
            </iframe>

            <v-flex v-if="isActiveControl($store.getters.listViewPos)" >
              <v-container fluid grid-list-md px-1 py-2>

                <v-layout row wrap>
          
                  <v-flex my-1 xs6
                    v-for="station in $store.getters.stations"
                    :key="station.name">
          
                    <base-click-card :title="station.name"
                                  v-on:clicked="catchCategoryClicked(station.name)"
                                  :style="currentStationName === station.name ? `background-color: ${$vuetify.theme.primary}` : ''"
                                  :img="randomImg(station.name)"
                                  :randomImgPosition="true"
                                  />
          
                  </v-flex>

                </v-layout>
              </v-container>
            </v-flex>

          </v-layout>
    
      </v-flex>

      <!-- <v-progress-circular
        v-if="loadingStation"
        indeterminate
        color="primary"
        /> -->

      <!-- <iframe v-if="isActiveControl(1)"
              :style="`height: ${iframeScreenHeight()}px`"
              ref="map_iframe"
              class="flex mt-2 px-3 xs12 md9"
              src="https://www.wsl.ch/gcnet/map.php"
              frameborder="0" >
      </iframe> -->

      <iframe v-if="isActiveControl($store.getters.listViewPos)"
              :style="`height: ${iframeScreenHeight()}px`"
              ref="station_iframe"
              class="flex mt-2 px-3 xs12 md9"
              src=""
              frameborder="0" >
      </iframe>


    </v-layout>
  </v-container>
</template>

<script>
import vuex from 'vuex';
import { mapGetters } from 'vuex';
import BaseClickCard from '@/components/BaseElements/BaseClickCard.vue';
import ControlPanelView from '@/components/ControlPanelView.vue';
import TitleView from '@/components/TitleView.vue';

export default {
  components: {
    BaseClickCard,
    ControlPanelView,
    TitleView,
  },
  data () {
    return {
      buttonlText: 'SEARCH DATA',
      envidatTitle: 'EnviDat',
      envidatSlogan: 'Environmental Research Data<br/>at your Fingertips',
      envidatSubSlogan: 'The data is being provided by the many research units of the Swiss Federal Institute for Forest, Snow and Landscape WSL.',
      sloganButtonText: 'BROWSE DATA',
      baseStationURL: 'https://www.wsl.ch/gcnet/stations/',
      mapURL: 'https://www.wsl.ch/gcnet/map.php',
      loadingStation: false,
      currentStationName: '',
      cardImgs: {},
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
  mounted() {
    // alert('cards ' + this.$store.getters.categoryCards.length)

    // this.checkStations();
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
    UrlExists(url) {
        var http = new XMLHttpRequest();
        http.open('HEAD', url, false);
        http.send();
        // if (http.status != 404)
            return http.status != 404
        // else
            // window.location.reload();
    },
    catchHomeClicked() {
      // show title view
    },
    catchCategoryClicked(cardTitle) {
      // this.loadingStation = true;

      this.getStation(cardTitle);
    },
    getStation(stationName) {
      const stations = this.$store.getters.stations;
      let station = null;
      const keys = Object.keys(stations);

      for(let key of keys) {
        let val = stations[key];

        if (val.name === stationName){
          station = val;
          break;
        }
      };

      if (station){
        this.loadStation(station);
      }
    },
    loadStation(station) {

      this.currentStationName = station.name;

      this.$refs.station_iframe.onload = function(event){
        // this.loadingStation = false;
        console.log('loaded iframe ' + this + " content : " + this.contentDocument + " window : " + this.contentWindow);
      };

      const that = this;
      this.$refs.station_iframe.onerror = function(err){
        // this.loadingStation = false;
        console.log('error the iframe ' + err);
        that.$refs.station_iframe.src = null;
        this.currentStationName = '';
      };

      this.$refs.station_iframe.src = this.baseStationURL + station.alias;
    },
    iframeScreenHeight() {
      return window.innerHeight - 50;
    },
    randomImg(name) {
      const keys = Object.keys(this.cardImgs);
      let rnd = 0;

      if (keys.length > 0) {
        // rnd = this.randomIntFromInterval(0, keys.length - 1);
        rnd = this.randomIntFromSeed(0, keys.length - 1)
      }

      return this.cardImgs[keys[rnd]];
    },
  },

};
</script>

<style scoped>


  iframe html .wrap,
  iframe html .measurement-panel {
    padding: 0 !important;
  }

</style>
