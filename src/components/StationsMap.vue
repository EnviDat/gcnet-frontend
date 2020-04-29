<template>
  <v-card>
    
          <!-- :style="`height: ${iframeScreenHeight()}px; height: 75vh; overflow: auto;`" -->
    <div
          :style="`height: ${iframeScreenHeight()}px; height: 80vh; overflow: hidden;`"
          class="pa-1"
          id="map_svg"
          ref="map_svg"
          v-html="mapHTML">

    </div>
  </v-card>
</template>

<script>
import mapHTML from '@/map_html.html';

export default {
  props: {
    currentStation: Object,
  },
  data: () => ({
    mapHTML,
  }),
  mounted() {

    const that = this;
    const links = this.$el.querySelectorAll('#map_svg svg > g > g > a');

    if (this.$vuetify.breakpoint.smAndDown){
      const mainSVG = this.$el.querySelector('#map_svg svg');

      if (this.$vuetify.breakpoint.sm){
        mainSVG.setAttribute('style', 'height: 80% !important;');
      } else {
        // mainSVG.setAttribute('style', 'height: 120% !important;');
      }
    }

    links.forEach(el => {
      const url = el.getAttribute('xlink:href');
      if (url) {
        // el.addEventListener('click', that.stationClick(url));
        el.onclick = function (){
          that.mapClick(url);
        }
        el.removeAttribute('xlink:href');
      }
      el.removeAttribute('target');
    });
  },
  methods: {
    iframeScreenHeight() {
      return window.innerHeight - 150;
    },
    mapClick(stationURL) {
      this.$emit('mapClick', stationURL);
    },
  },
}

</script>

<style scoped>


</style>