<template>
    <v-toolbar
        app
        dense
        color="primary"
        dark >

      <v-toolbar-side-icon><img style="width: 35px; height: 35px;" :src="gcNetlogo"></v-toolbar-side-icon>

      <v-toolbar-title class="headline" style="font-weight: 300 !important;">{{ gcNetHomeText }} </v-toolbar-title>

      <v-spacer></v-spacer>

      <v-btn icon>
        <v-icon>search</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>favorite</v-icon>
      </v-btn>

      <v-btn icon>
        <v-icon>more_vert</v-icon>
      </v-btn>
    </v-toolbar>
</template>


<script>
import gcNetlogo from '@/assets/gc_net_logo.png';

export default {
  props: {
    navItems: Array,
    version: String,
  },
  computed: {
  },
  methods: {
    catchDrawerClick(){
      this.$emit('drawerClick', this.drawerIsMini);
    },
    catchHomeClick(){
      this.$emit('homeClick');
    },
    catchStationOverviewClick(){
      this.$emit('stationOverviewClick');
    },
  },
  data: () => ({
    drawer: true,
    drawerIsMini: true,
    right: null,
    gcNetlogo,
    gcNetHomeText: 'GC-Net Data Portal'
  }),
}
</script>

<style>

  .gc_net_nav > div > div.v-list__tile{
    padding: 0 !important;
    padding-left: 4px !important;
  }

</style>
