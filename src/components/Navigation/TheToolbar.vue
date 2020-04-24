<template>
    <v-toolbar
        app
        color="primary"
        tabs
        dense
        dark >

      <v-toolbar-side-icon><img style="width: 35px; height: 35px;" :src="gcNetlogo"></v-toolbar-side-icon>

      <!-- <v-toolbar-title class="headline" style="font-weight: 300 !important;">
        {{ gcNetHomeText }} 
      </v-toolbar-title> -->
      <div class="ml-3 headline" style="font-weight: 300 !important; width: 200px !important;">{{ gcNetHomeText }} </div>

      <v-spacer></v-spacer>

      <!-- <v-toolbar-items centered> -->
        
        <v-tabs v-model="activeTab"
                color="primary"
                centered
                slider-color="white" >

          <v-tab v-for="(navItem, index) in navItems"
                :key="index"
                :href="`#tab-${index}`" >
            <!-- {{ navItem.title }} -->

            <v-btn icon @click="$emit('navigationClick', navItem.route)">
              <v-icon>{{ navItem.icon }}</v-icon>
            </v-btn>

          </v-tab>
        </v-tabs>
      <!-- </v-toolbar-items> -->

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
    gcNetlogo,
    gcNetHomeText: 'GC-Net',
    activeTab: null,
  }),
}
</script>

<style>

  .gc_net_nav > div > div.v-list__tile{
    padding: 0 !important;
    padding-left: 4px !important;
  }

</style>
