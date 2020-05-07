<template>
    <v-toolbar
        app
        color="primary"
        tabs
        dense
        dark >

      <!-- <v-toolbar-side-icon @click="$emit('navigationClick', '/')" ><img style="width: 35px; height: 35px;" :src="gcNetlogo"></v-toolbar-side-icon> -->
      <div class="mt-1"><img style="width: 35px; height: 35px;" :src="gcNetlogo"></div>

      <div v-if="$vuetify.breakpoint.smAndUp"
            class="ml-3 headline"
            style="font-weight: 300 !important; width: 100px !important;">
        {{ gcNetHomeText }}
      </div>

      <!-- <div v-if="$vuetify.breakpoint.smAndUp"
            class="ml-3"
            >
        {{ version }}
      </div> -->

      <v-spacer></v-spacer>

      <v-tabs v-model="activeTab"
              color="primary"
              centered
              slider-color="white" >

        <v-tab v-for="(navItem, index) in navItems"
              :key="index"
              :href="navItem.route === 'request' ? 'http://cires1.colorado.edu/steffen/gcnet/order/admin/station.php' : ''"
              :target="navItem.route === 'request' ? '_blank' : ''"
              @click.stop="navItem.route === 'request' ? null : $emit('navigationClick', navItem.route)" >
          <v-tooltip
            bottom
            :disabled="$vuetify.breakpoint.xsOnly"
            lazy >
            
            <span>{{ navItem.toolTip }}</span>              

            <template v-slot:activator="{ on }">
              <v-btn v-on="on"
                      icon
                      @click="navItem.route === 'request' ? '' : $emit('navigationClick', navItem.route)">

                <v-icon>{{ navItem.icon }}</v-icon>

                <v-icon v-if="navItem.route === 'request'"
                        small
                        style="position: absolute; right: -10px; top: 20px; " >open_in_new</v-icon>
              </v-btn>
            </template>              
          </v-tooltip>

        </v-tab>
      </v-tabs>

      <div style="font-size: 9px !important;">{{ version }}</div>

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
  mounted(){
    this.$eventHub.$on('detailClick', (station) => {
      if (station){
        this.activeTab = null;
        // this.overwriteTab(-1);
      }
    });
  },
  beforeDestroy() {
    this.$eventHub.$off('detailClick');
  },  
  methods: {
    overwriteTab(newActive){
      this.activeTab = parseInt(newActive);
    },
  },
  data: () => ({
    gcNetlogo,
    gcNetHomeText: 'GC-Net',
    activeTab: 0,
  }),
}
</script>

<style>

  .gc_net_nav > div > div.v-list__tile{
    padding: 0 !important;
    padding-left: 4px !important;
  }

</style>
