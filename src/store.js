import Vue from 'vue'
import Vuex from 'vuex'
import stations from './stations';
import photoCredits from './photoCredits';

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    stations,
    appBGImage: './app_bg.jpg',
    mapViewPos: 0,
    listViewPos: 1,
    controls: [0],
    photoCredits,
  },
  getters: {
    stations: (state) => state.stations,
    appBGImage: (state) => state.appBGImage,
    mapViewPos: (state) => state.mapViewPos,
    listViewPos: (state) => state.listViewPos,
    controls: (state) => state.controls,
    photoCredits: (state) => state.photoCredits,
  },
  mutations: {
  },
  actions: {

  }
})
