<template>
  <v-container fluid
                :class="$vuetify.breakpoint.smAndDown ? 'pa-1' : 'pa-2'">  

    <v-layout row wrap >
  
      <v-flex mt-2 xs12 md3>
    
          <v-layout column >
            <v-flex>
              <title-view />
              <control-panel-view :label="controlsLabel"
                                  v-on:homeClick="catchHomeClicked"/>
            </v-flex>

            <v-flex mt-2 px-0 xs6 
                    v-if="isActiveControl($store.getters.mapViewPos)"
                    :style="`overflow: hidden;`"
                    id="map_svg"
                    ref="map_svg"
                    v-html="mapHTML"
                                    >
            </v-flex>

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

      <v-progress-circular
        v-if="loadingStation"
        indeterminate
        color="primary"
        style="margin: auto;"
        />

      <!-- <iframe v-if="isActiveControl(1)"
              :style="`height: ${iframeScreenHeight()}px`"
              ref="map_svg"
              class="flex mt-2 px-3 xs12 md9"
              src="https://www.wsl.ch/gcnet/map.php"
              frameborder="0" >
      </iframe> -->

      <iframe v-show="!loadingStation"
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
import mapHTML from '@/map_html.html';

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
      controlsLabel: 'Select stations on Greenland via Map or List:',
      cardImgs: {},
      mapHTML,
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

    const that = this;
    const links = this.$el.querySelectorAll('#map_svg svg > g > g > a');
    
    links.forEach(el => {
      const url = el.getAttribute('xlink:href');
      if (url) {
        // el.addEventListener('click', that.stationClick(url));
        el.onclick = function (){
          that.stationClick(url);
        }
        el.removeAttribute('xlink:href');
      }
      el.removeAttribute('target');
    });
  },
  methods: {
    stationClick(stationUrl){
      // console.log('clicked on ' + stationUrl);

      const splits = stationUrl.split('/');
      if (splits.length > 0) {
        const stationName = splits[splits.length - 1];

        const station = this.getStation(stationName);

        if (station){
          this.loadStation(station);
        }
      }

    },
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
      const station = this.getStation(cardTitle);

      if (station){
        this.loadStation(station);
      }
    },
    getStation(stationName) {
      const stations = this.$store.getters.stations;
      let station = null;
      const keys = Object.keys(stations);

      for(let key of keys) {
        let val = stations[key];

        if (val.name === stationName || val.alias === stationName){
          station = val;
          break;
        }
      };

      return station;
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
