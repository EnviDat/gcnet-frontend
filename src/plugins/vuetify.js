import Vue from 'vue';
import Vuetify from 'vuetify/lib';
import 'vuetify/src/stylus/app.styl';

// icons are imported in the App.vue via sass/scss
// Icons list: https://jossef.github.io/material-design-icons-iconfont/

Vue.use(Vuetify, {
  iconfont: 'mdi',
  theme: {
    // primary: '#29B6F6', // light-blue lighten-1
    primary: '#639BFF',
    // secondary: '#81D4FA', // light-blue lighten-3 
    secondary: '#77B5F8', // light-blue lighten-3 
    accent: '#FABC57', // cyan accent-1 
    highlight: '#B2DFDB', // teal lighten-4
    error: '#EE6363',
    errorHighlight: '#FF8A80', // red lighten-4
    info: '#2196F3',
    success: '#90D593',
    warning: '#FFC107',
  },
});
