import Vue from 'vue'
import Vuetify from 'vuetify/lib'
import 'vuetify/src/stylus/app.styl'

Vue.use(Vuetify, {
  iconfont: 'md',
  theme: {
    primary: '#29B6F6', // light-blue lighten-1
    secondary: '#81D4FA', // light-blue lighten-3 
    accent: '#84FFFF', // cyan accent-1 
    highlight: '#B2DFDB', // teal lighten-4
    error: '#FF5252',
    errorHighlight: '#FF8A80', // red lighten-4
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FFC107',
  },
})
