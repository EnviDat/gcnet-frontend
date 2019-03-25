<template>
  <v-app class="application" :style="dynamicBackground()">

    <v-content>
      <landing-page />
    </v-content>
  </v-app>
</template>

<script>
import LandingPage from './components/Pages/LandingPage';

export default {
  name: 'App',
  components: {
    LandingPage
  },
  methods: {
    dynamicBackground() {
      const imageKey = this.$store.getters.appBGImage;
      
      const bgImg = this.randomImg(this.appBGImages);
      // const bgImg = this.appBGImages[imageKey];

      // const bgImg = this.$store.getters.appBGImage;
      // console.log(imageKey + " bgImg " + bgImg);
      let bgStyle = '';

      if (bgImg) {
        // bgStyle = `background-image: url(${bgImg}) !important;`;
        bgStyle = `background: linear-gradient(to bottom, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.85) 100%), url(${bgImg}) !important;`;

        bgStyle += `background-position: center top !important;
                    background-repeat: no-repeat !important;
                    background-size: cover !important; `;

        // if (bgImg.includes('browsepage')) {
        //   // bgStyle = `background-image: url(${bgImg}) !important;`;
        //   bgStyle = `background: linear-gradient(to bottom, rgba(255,255,255,0.5) 0%, rgba(255,255,255,0.7) 100%), url(${bgImg}) !important;`;

        //   bgStyle += `background-position: center top !important;
        //               background-repeat: repeat !important; `;
        // }
      }

      return bgStyle;
    },
    randomImg(imgs) {
      const keys = Object.keys(imgs);
      let rnd = 0;

      if (keys.length > 0) {
        rnd = this.randomIntFromInterval(0, keys.length - 1);
      }

      return imgs[keys[rnd]];
    },
  },
  data () {
    return {
      name: 'App',
      appBGImages: {},
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
