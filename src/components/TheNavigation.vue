<template>
  <v-navigation-drawer
    v-model="drawer"
    :mini-variant.sync="drawerIsMini"
    hide-overlay
    temporary
    stateless
    app
    width="500"
  >
    <v-toolbar flat class="transparent">
      <v-list class="pa-0">
        <v-list-tile avatar>
          <v-list-tile-avatar>
            <img :src="gcNetlogo">
          </v-list-tile-avatar>

          <v-list-tile-content>
            <v-list-tile-title>{{ gcNetHomeText }}</v-list-tile-title>
          </v-list-tile-content>

          <v-list-tile-action>
            <v-btn
              icon
              @click.stop="catchDrawerClick"
            >
              <v-icon>chevron_left</v-icon>
            </v-btn>
          </v-list-tile-action>
        </v-list-tile>
      </v-list>
    </v-toolbar>

    <v-list class="pt-0" dense>
      <v-divider></v-divider>

      <v-list-group
        :prepend-icon="items[0].icon"
        v-model="items[0].active"
      >

        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>{{ items[0].title }}</v-list-tile-title>
          </v-list-tile>

        </template>
        <v-list-tile-content>
          <slot name="map">
            
          </slot>
        </v-list-tile-content>

      </v-list-group>

      <v-list-group
        :prepend-icon="items[1].icon"
        v-model="items[1].active"
      >

        <template v-slot:activator>
          <v-list-tile>
            <v-list-tile-title>{{ items[1].title }}</v-list-tile-title>
          </v-list-tile>

        </template>
        <v-list-tile-content>
          <slot name="list">
            
          </slot>
        </v-list-tile-content>
        
      </v-list-group>
    </v-list>

  </v-navigation-drawer>
</template>


<script>
import gcNetlogo from '@/assets/gc_net_logo.png';

export default {
  props: {
    mini: Boolean,
  },
  watch: {
    mini: function overwrite(){
      this.drawerIsMini = this.mini;
    },
    drawerIsMini: function updateParent(){
      if (this.drawerIsMini){
        this.items[0].active = false;
        this.items[1].active = false;
      }
    }
  },
  updated(){
    this.$emit('drawerClick', this.drawerIsMini);
  },
  methods: {
    catchDrawerClick(){
      this.drawerIsMini = !this.drawerIsMini;
      this.$emit('drawerClick', this.drawerIsMini);
    },
  },
  data: () => ({
    drawer: true,
    items: [
      { title: 'Greenland Map', icon: 'map', active: true },
      { title: 'Station List', icon: 'list', active: false },
    ],
    drawerIsMini: false,
    right: null,
    gcNetlogo,
    gcNetHomeText: 'GC-Net Data Portal'
  }),
}
</script>