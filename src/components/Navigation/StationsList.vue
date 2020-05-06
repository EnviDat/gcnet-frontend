<template>
  <v-container fluid grid-list-md pa-1>

    <v-layout row wrap>

      <!-- Domi: For single line only the "xs12" css-class is needed  -->
      <v-flex xs6 md3 lg2
              my-1
              v-for="station in $store.getters.stations"
              :key="station.name"
              v-show="station.active" >

        <base-click-card :title="station.name"
                        v-on:clicked="station.alias ? listClick(station.name) : ''"
                        :style="backgroundColor(station)"
                        :img="stationImg(station.alias)"
                        :disabled="!station.alias"
                        />
                        <!-- Domi: remove randomImg and added Station Img
                          :randomImgPosition="true"
                          :img="randomImg(station.elevation + station.alias)"
                          -->

      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
import BaseClickCard from '@/components/BaseElements/BaseClickCard.vue';

export default {
  props: {
    currentStation: Object,
  },
  data: () => ({
    cardImgs: {},
  }),
  components: {
    BaseClickCard,
  },
  beforeMount() {
    const imgs = require.context('@/assets/cards', false, /\.jpg$/);
    const imgCache = {};

    imgs.keys().forEach((key) => {
      imgCache[key] = imgs(key);
    });

    this.cardImgs = imgCache;
  },
  methods: {
    backgroundColor(station){
      let style = 'background-color: ';

      if (this.currentStation && this.currentStation.name === station.name) {
        style += `${this.$vuetify.theme.primary};`;
      } else if (!station.alias){
        style += `${this.$vuetify.theme.errorHighlight};`;
      }

      return style;
    },
    iframeScreenHeight() {
      return window.innerHeight - 100;
    },
    listClick(cardTitle) {
      this.$emit('listClick', cardTitle);
    },
    stationImg(alias){
      // Domi: used alias as key for the station file name
      return this.cardImgs[`./${alias}.jpg`];
    },
    randomImg(name) {
      const keys = Object.keys(this.cardImgs);
      let rnd = 0;

      if (keys.length > 0) {
        // rnd = this.randomIntFromInterval(0, keys.length - 1);
        rnd = this.randomIntFromSeed(0, keys.length - 1, name);
      }

      return this.cardImgs[keys[rnd]];
    },
  },
}

</script>

<style scoped>


</style>