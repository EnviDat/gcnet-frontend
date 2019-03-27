<template>
  <div
        :style="`height: ${iframeScreenHeight()}px; overflow: hidden;`"
        class="pa-1"
        id="map_svg"
        ref="map_svg"
        v-html="mapHTML">

  </div>
</template>

<script>
import mapHTML from '@/map_html.html';

export default {
  data: () => ({
    mapHTML,
  }),
  mounted() {

    const that = this;
    const links = this.$el.querySelectorAll('#map_svg svg > g > g > a');

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
      return window.innerHeight - 100;
    },
    mapClick(stationURL) {
      this.$emit('mapClick', stationURL);
    },
  },
}

</script>

<style scoped>


</style>