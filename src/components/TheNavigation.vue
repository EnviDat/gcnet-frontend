<template>
  <v-navigation-drawer
    class="gc_net_navigation"
    absolute
    permanent
    app
    :width="open"
  >

    <v-toolbar flat class="transparent">
      <v-list class="pa-0 gc_net_nav" :dense="$vuetify.breakpoint.smAndDown">
        <v-list-tile avatar :class="$vuetify.breakpoint.mdAndUp ? '' : 'px-0'"
                      @click.stop="catchHomeClick"
        >
          <v-list-tile-avatar :class="$vuetify.breakpoint.mdAndUp ? '' : 'px-0'" >
            <img :src="gcNetlogo">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ gcNetHomeText }}</v-list-tile-title>
            <p class="mb-0" style="font-size: 9px;" >{{ version }}</p>
          </v-list-tile-content>

        </v-list-tile>
      </v-list>
    </v-toolbar>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-group
        :prepend-icon="navItems[0].icon"
        v-model="navItems[0].active"
      >

        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>{{ navItems[0].title }}</v-list-tile-title>
          </v-list-tile>

        </template>
        <v-list-tile-content>
          <slot name="map">
            
          </slot>
        </v-list-tile-content>

      </v-list-group>

      <v-list-group
        :prepend-icon="navItems[1].icon"
        v-model="navItems[1].active"
      >

        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>{{ navItems[1].title }}</v-list-tile-title>
          </v-list-tile>

        </template>
        <v-list-tile-content>
          <slot name="list">
            
          </slot>
        </v-list-tile-content>
        
      </v-list-group>

      <!-- Domi: StationOverview list tile with click, icon and title -->
      <v-list-tile avatar :class="$vuetify.breakpoint.mdAndUp ? '' : 'px-0'"
                    @click.stop="catchStationOverviewClick"
      >
        <v-list-tile-action class="v-list__group__header__prepend-icon">
          <v-icon >{{ navItems[2].icon }}</v-icon>
        </v-list-tile-action>        

        <v-list-tile-content>
          <v-list-tile-title>{{ navItems[2].title }}</v-list-tile-title>
        </v-list-tile-content>

      </v-list-tile>

    </v-list>

  </v-navigation-drawer>
</template>


<script>
import gcNetlogo from '@/assets/gc_net_logo.png';

export default {
  props: {
    mini: Boolean,
    navItems: Array,
    version: String,
  },
  watch: {
    mini: function overwrite(){
      this.drawerIsMini = this.mini;
      this.$emit('updateDrawer', this.drawerIsMini);
      // this.drawerIsMini = this.mini;
    },
    navItems: function updateDrawer(){
      this.drawerIsMini = this.mini;
      this.$emit('updateDrawer', this.drawerIsMini);
    }
    // drawerIsMini: function updateParent(){
    //   if (this.drawerIsMini){
    //     this.navItems[0].active = false;
    //     this.navItems[1].active = false;
    //   }
    // }
  },
  updated(){
    this.drawerIsMini = this.mini;
  },
  computed: {
    open(){

      let open = false;
      const wideOpen = 500;
      // Domi: new width for Stations in single line
      const wideOpenStation = 300;
      const wideClosed = 240;
      // const smallOpen = 250;
      const smallOpen = 150;
      const smallClosed = 50;

      if (this.navItems && this.navItems.length > 0){
        open = this.navItems[0].active || this.navItems[1].active;
      }

      if (this.$vuetify.breakpoint.lgAndUp){
        if (this.navItems[1].active){
          return open ? wideOpenStation : wideClosed;
        }

        return open ? wideOpen : wideClosed;
      } else {
        return open ? smallOpen : smallClosed;
      }
    },
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
