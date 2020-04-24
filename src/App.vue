<template>
  <v-app class="application" :style="dynamicBackground()">

    <the-toolbar :navItems="navItems"
                  :version="version"
                  @navigationClick="catchNavigationClick">

    </the-toolbar>

    <v-content>
      <v-container fluid
                    :class="$vuetify.breakpoint.mdAndDown ? 'pa-1' : 'pa-4'"  
                    fill-height >
        <v-layout column >
          <v-flex mx-0 >

            <transition name="fade" mode="out-in">
              <router-view />
            </transition>

          </v-flex>

        </v-layout>
      </v-container>

    </v-content>
  </v-app>
</template>

<script>
import TheToolbar from '@/components/Navigation/TheToolbar';
import '@/../node_modules/skeleton-placeholder/dist/bone.min.css';

export default {
  name: 'App',
  components: {
    TheToolbar,
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
    catchNavigationClick(route) {
      this.$router.push({ path: route });
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
        { title: 'Stations', toolTip: 'Shows the Stations overview', icon: 'dashboard', active: true, route: '/' },
        // { title: 'Data', toolTip: 'Request data from different stations', icon: 'save_alt', active: true, route: 'request' },
        { title: 'About', toolTip: 'More information about the GC-Net Data Portal', icon: 'info', active: false , route: 'about'},
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
