<template>
  <v-app class="application" :style="dynamicBackground()">

    <v-content app >
      <landing-page :currentStation="currentStation" 
                    :showHomeScreen="showHomeScreen"
                    v-on:anyClick="catchAnyClick"
                    v-on:mapViewClick="catchMapViewClick"
                    v-on:listViewClick="catchListViewClick"
                    v-on:updateDrawer="catchUpdateDrawer"
                    />
    </v-content>

      <the-navigation :mini="drawerIsMini"
                      :navItems="navItems"
                      v-on:homeClick="catchHomeClick"
                      v-on:drawerClick="catchDrawerClick">
        <template v-slot:map>        
          <stations-map v-on:mapClick="mapStationClick" />          
        </template>

        <template v-slot:list>        
          <stations-list v-on:listClick="listStationClick" />
        </template>

      </the-navigation >

  </v-app>
</template>

<script>
import TheNavigation from '@/components/TheNavigation';
import StationsMap from '@/components/StationsMap';
import StationsList from '@/components/StationsList';
import LandingPage from '@/components/Pages/LandingPage';

export default {
  name: 'App',
  components: {
    TheNavigation,
    StationsMap,
    StationsList,
    LandingPage,
  },
  beforeMount() {
      const imgs = require.context('./assets/', false, /\.jpg$/);
      // const imgs = require.context('./assets/', false, /\.png$/);
      const imgCache = {};

      imgs.keys().forEach((key) => {
        imgCache[key] = imgs(key);
      });

      this.appBGImages = imgCache;
  },
  methods: {
    catchHomeClick() {
      this.showHomeScreen = true;
    },
    catchAnyClick(){

      // this.$nextTick(() => {
      //   if (!this.drawerIsMini){
      //     this.drawerIsMini = true;
      //   }
      // });
        // this.drawerIsMini = !this.drawerIsMini;
    },
    catchDrawerClick(currentMini){
      this.$nextTick(() => {
        this.drawerIsMini = !currentMini;
        if (this.drawerIsMini) {
          this.resetNavigationChoice();
        }
      });

    },
    resetNavigationChoice(){
      this.navItems[0].active = false;
      this.navItems[1].active = false;
    },
    catchUpdateDrawer(currentMini) {
      this.drawerIsMini = currentMini;
    },
    catchMapViewClick() {
      if (this.drawerIsMini){
        this.drawerIsMini = false;
      }
      this.navItems[0].active = true;
    },
    catchListViewClick() {
      if (this.drawerIsMini){
        this.drawerIsMini = false;
      }
      this.navItems[1].active = true;
    },
    mapStationClick(stationUrl){
      this.showHomeScreen = false;
      // console.log('clicked on ' + stationUrl);

      const splits = stationUrl.split('/');
      if (splits.length > 0) {
        const stationName = splits[splits.length - 1];

        this.currentStation = this.getStation(stationName);
      }

    },
    listStationClick(stationName) {
      this.showHomeScreen = false;
      this.currentStation = this.getStation(stationName);
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
    dynamicBackground() {
      const imageKey = this.$store.getters.appBGImage;
      const bgImg = this.randomImg(this.appBGImages);
      let bgStyle = '';

      if (bgImg) {
        bgStyle = `background: linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%), url(${bgImg}) !important;`;

        bgStyle += `background-position: center top !important;
                    background-repeat: no-repeat !important;
                    background-size: cover !important; `;
      }

      return bgStyle;
    },
    randomImg(imgs) {
      const keys = Object.keys(imgs);
      let rnd = 0;

      if (keys.length > 0) {
        rnd = this.randomIntFromSeed(0, keys.length - 1, '27.03.19');
      }

      return imgs[keys[rnd]];
    },
  },
  data () {
    return {
      name: 'App',
      appBGImages: {},
      currentStation: null,
      showHomeScreen: true,
      drawerIsMini: true, // this.$vuetify.breakpoint.smAndDown ? true : false,
      navItems: [
        { title: 'Greenland Map', icon: 'map', active: false },
        { title: 'Station List', icon: 'list', active: false },
      ],
    }
  },
}
</script>

<style scoped>

  .card .subheading{
    /* font-family: 'Libre Baskerville', serif; */
    font-weight: 400;
    /* color: #555; */
    opacity: 0.75;
    line-height: 1.25em;
  }

  .imagezoom,
  .imagezoom img {
    transition: all .2s;
  }

  .imagezoom img:hover,
  .imagezoom img:focus {
    transform: scale(1.2);
  }

</style>
