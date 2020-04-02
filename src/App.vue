<template>
  <v-app class="application" :style="dynamicBackground()">

    <v-content app >
      <landing-page v-if="!showOverview && !currentStation"
                    :showHomeScreen="showHomeScreen"
                    v-on:anyClick="catchAnyClick"
                    v-on:mapViewClick="catchMapViewClick"
                    v-on:listViewClick="catchListViewClick"
                    v-on:updateDrawer="catchUpdateDrawer"
                    />

      <stations-detail-page v-if="!showOverview && currentStation" :currentStation="currentStation" />

      <stations-overview-page v-if="showOverview" />

    </v-content>

<!--    <v-content app >-->
<!--      <landing-page :currentStation="currentStation" -->
<!--                    :showHomeScreen="showHomeScreen"-->
<!--                    :showOverview="showOverview"-->
<!--                    v-on:anyClick="catchAnyClick"-->
<!--                    v-on:mapViewClick="catchMapViewClick"-->
<!--                    v-on:listViewClick="catchListViewClick"-->
<!--                    v-on:updateDrawer="catchUpdateDrawer"-->
<!--                    />-->
<!--    </v-content>-->

      <the-navigation :mini="drawerIsMini"
                      :navItems="navItems"
                      :version="version"
                      v-on:homeClick="catchHomeClick"
                      v-on:drawerClick="catchDrawerClick"
                      v-on:stationOverviewClick="catchStationOverviewClick">

        <template v-slot:map>        
          <stations-map :currentStation="currentStation"
                        v-on:mapClick="mapStationClick" />          
        </template>

        <template v-slot:list>        
          <stations-list :currentStation="currentStation"
                          v-on:listClick="listStationClick" />
        </template>

      </the-navigation >

  </v-app>
</template>

<script>
import TheNavigation from '@/components/TheNavigation';
import StationsMap from '@/components/StationsMap';
import StationsList from '@/components/StationsList';
import LandingPage from '@/components/Pages/LandingPage';
import StationsOverviewPage from '@/components/Pages/StationsOverviewPage';
import '@/../node_modules/skeleton-placeholder/dist/bone.min.css';
import StationsDetailPage from "./components/Pages/StationsDetailPage";


export default {
  name: 'App',
  components: {
    TheNavigation,
    StationsMap,
    StationsList,
    LandingPage,
    StationsOverviewPage,
    StationsDetailPage,
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
      this.showOverview = false;
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
    catchStationOverviewClick(){
      this.showHomeScreen = false;
      this.showOverview = true;
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
    catchOverviewClick() {
      this.showHomeScreen = false;
      this.showOverview = true;
    },    
    mapStationClick(stationUrl){
      this.showHomeScreen = false;
      this.showOverview = false;
      // console.log('clicked on ' + stationUrl);

      const splits = stationUrl.split('/');
      if (splits.length > 0) {
        const stationName = splits[splits.length - 1];

        this.currentStation = this.getStation(stationName);
      }

    },
    listStationClick(stationName) {
      this.showHomeScreen = false;
      this.showOverview = false;

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
      }

      return station;
    },
    dynamicBackground() {
      // const imageKey = this.$store.getters.appBGImage;
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
      showOverview: false,
      version: process.env.VUE_APP_VERSION,
      drawerIsMini: true, // this.$vuetify.breakpoint.smAndDown ? true : false,
      navItems: [
        { title: 'Greenland Map', icon: 'map', active: false },
        { title: 'Station List', icon: 'list', active: false },
        { title: 'Stations Overview', icon: 'dashboard', active: false },
      ],
    }
  },
}
</script>

<style lang="scss">
  /* Icons list: https://jossef.github.io/material-design-icons-iconfont/ */
  $material-design-icons-font-directory-path: '~material-design-icons-iconfont/dist/fonts/';

  @import '~material-design-icons-iconfont/src/material-design-icons.scss';
</style>

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
