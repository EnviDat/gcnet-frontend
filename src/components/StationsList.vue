<template>
  <v-container fluid grid-list-md pa-1>

    <v-layout row wrap>

      <v-flex my-1 xs12 sm5 md6
              v-for="station in $store.getters.stations"
              :key="station.name">

        <base-click-card :title="station.name"
                        v-on:clicked="listClick(station.name)"
                        :style="currentStationName === station.name ? `background-color: ${$vuetify.theme.primary}` : ''"
                        :img="randomImg(station.name)"
                        :randomImgPosition="true"
                        />

      </v-flex>

    </v-layout>
  </v-container>

</template>

<script>
import BaseClickCard from '@/components/BaseElements/BaseClickCard.vue';

export default {
  data: () => ({
    cardImgs: {},
    currentStationName: '',
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
    iframeScreenHeight() {
      return window.innerHeight - 100;
    },
    listClick(cardTitle) {
      this.currentStationName = cardTitle;
      this.$emit('listClick', cardTitle);
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
}

</script>

<style scoped>


</style>