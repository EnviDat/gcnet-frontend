<template>
  <v-app class="application" :style="dynamicBackground()">

    <the-toolbar :navItems="navItems"
                  :version="version"
                  @navigationClick="catchNavigationClick">

    </the-toolbar>

    <!-- <div
      id="scrolling-techniques"
      class="scroll-y"
      style="max-height: 600px;"
    >
      <v-content app >
        <landing-page v-if="!currentStation"
                      :showHomeScreen="showHomeScreen"
                      :showOverview="showOverview"
                      @anyClick="catchAnyClick"
                      @mapViewClick="catchMapViewClick"
                      @listViewClick="catchListViewClick"
                      @updateDrawer="catchUpdateDrawer"
                      @overviewClick="catchOverviewClick"
                      @detailClick="listStationClick"
                      />


        <stations-detail-page v-if="!showOverview && currentStation"
                              :currentStation="currentStation" />
      </v-content>
    </div>     -->

    <v-content app >
      <landing-page v-if="!currentStation"
                    :showHomeScreen="showHomeScreen"
                    :showOverview="showOverview"
                    @anyClick="catchAnyClick"
                    @mapViewClick="catchMapViewClick"
                    @listViewClick="catchListViewClick"
                    @updateDrawer="catchUpdateDrawer"
                    @overviewClick="catchOverviewClick"
                    @detailClick="listStationClick"
                    />


      <stations-detail-page v-if="!showOverview && currentStation"
                            :currentStation="currentStation"
                            @mapClick="mapStationClick" />
    </v-content>

  </v-app>
</template>

<script>
import TheToolbar from '@/components/Navigation/TheToolbar';
import LandingPage from '@/components/Pages/LandingPage';
import '@/../node_modules/skeleton-placeholder/dist/bone.min.css';
import StationsDetailPage from "./components/Pages/StationsDetailPage";

export default {
  name: 'App',
  components: {
    TheToolbar,
    LandingPage,
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
    catchNavigationClick(pageName) {
      console.log('naviagte to ' + pageName);      
    },
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
    catchOverviewClick() {
      // click from the landingPage is a toggle
      this.showOverview = !this.showOverview;
    },
    catchNavigationOverviewClick() {
      // click from the navigation is no toggle
      this.showOverview = true;
      this.currentStation = null;
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
      this.showOverview = false;

      const splits = stationUrl.split('/');
      if (splits.length > 0) {
        const stationName = splits[splits.length - 1];
        this.changeCurrentStation(stationName);
      }
    },
    changeCurrentStation(newStation){
      this.currentStation = null;
      // console.log('currentStation ' + this.currentStation);
      this.$nextTick(() => {
        this.currentStation = this.getStation(newStation);
        // console.log('changed current station to ' + this.currentStation.name);
      });
      // console.log('currentStation after ' + this.currentStation);
    },
    listStationClick(stationName) {
      this.showHomeScreen = false;
      this.showOverview = false;

      window.scrollTo(0, 0);

      this.changeCurrentStation(stationName);
    },
    getStation(stationName) {
      const stations = this.$store.getters.stations;
      let station = null;
      const keys = Object.keys(stations);

      for(let key of keys) {
        let val = stations[key];

        if (val.name === stationName || val.alias === stationName || val.id === stationName){
          station = val;
          break;
        }
      }

      return station;
    },
    dynamicBackground() {
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
      showOverview: true,
      version: process.env.VUE_APP_VERSION,
      navItems: [
        { title: 'Stations', toolTip: 'Shows the Stations overview', icon: 'dashboard', active: true, pageName: 'overview' },
        { title: 'Data', toolTip: 'Request data from different stations', icon: 'save_alt', active: true, pageName: 'request' },
        { title: 'About', toolTip: 'More information about the GC-Net Data Portal', icon: 'info', active: false , pageName: 'about'},
      ],
    }
  },
}
</script>

<style lang="scss">
  /* Icons list: https://jossef.github.io/material-design-icons-iconfont/ */
  $material-design-icons-font-directory-path: '~material-design-icons-iconfont/dist/fonts/';

  //@import '~material-design-icons-iconfont/src/material-design-icons.scss';
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
