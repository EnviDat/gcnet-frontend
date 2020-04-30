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
          <v-flex >

            <transition name="fade" mode="out-in">
              <router-view @detailClick="catchDetailClick" />
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
      const routeCompare = route === "/" ? route : `/${route}`;

      if (this.$route.path !== routeCompare) {
        this.$router.push({ path: route });
      }
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
      version: process.env.VUE_APP_VERSION,
      navItems: [
        { title: 'Overview', toolTip: 'Shows the stations overview', icon: 'dashboard', active: true, route: '/' },
        { title: 'Stations', toolTip: 'Shows a list of stations overview', icon: 'view_list', active: true, route: '/station' },
        { title: 'Data', toolTip: 'Request data from different stations', icon: 'save_alt', active: true, route: 'request' },
        { title: 'About', toolTip: 'More information about the GC-Net Data Portal', icon: 'info', active: false , route: 'about'},
      ],
    };
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
