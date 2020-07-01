<template>
  <v-card raised
          :height="compactLayout ? $vuetify.breakpoint.sm ? 38 : 32 : 40"
  >
    <v-card-actions class="fill-height ma-0 py-0 px-1" >

      <v-btn flat
            icon
            v-on:click.native="catchHomeClick"
            :style="compactLayout ? 'height: 32px !important' : ''">
        <v-icon>home</v-icon>
      </v-btn>

      <v-text-field class="fill-height envidatControlInfos"
                    style="align-items: center;" 
                    :class="{'small' : compactLayout }"
                    :label="label"
                    flat
                    single-line
                    readonly
                    solo
                    disabled
                    hide-details
                    small
      />

        <v-btn-toggle mandatory
                      >

          <v-btn flat
                v-on:click.native="catchMapClick"
                :color="isActiveControl($store.getters.mapViewPos) ? $vuetify.theme.selected : ''"
                :active="isActiveControl($store.getters.mapViewPos)"
                :style="compactLayout ? 'height: 32px !important' : ''">
            <v-icon>map</v-icon>
          </v-btn>
          
          <v-btn flat
                v-on:click.native="catchListClick"
                :color="isActiveControl($store.getters.listViewPos) ? $vuetify.theme.selected : ''"
                :active="isActiveControl($store.getters.listViewPos)"
                :style="compactLayout ? 'height: 32px !important' : ''">
            <v-icon>list</v-icon>
          </v-btn>

        </v-btn-toggle>

    </v-card-actions>

  </v-card>
</template>

<script>

export default {
  props: {
    compactLayout: Boolean,
    label: String,
  },
  beforeMount: function beforeMount() {
    // this.listViewIcon = this.mixinMethods_getIcon('listView');
    // this.mapIcon = this.mixinMethods_getIcon('map');
  },
  mounted: function mounted() {
    this.controlsActive = this.$store.getters.controls;
  },
  data: () => ({
    mapFilterActivateText: 'Activate Mapfiltering',
    mapFilterDeactivateText: 'Deactivate Mapfiltering',
    listViewActivate: 'List view',
    listViewDeactivate: 'Grid view',
    // controlsActive: [],
    listViewIcon: null,
    mapIcon: null,
  }),
  // updated: function updated() {
  //   this.$emit('controlsChanged', this.controlsActive);
  // },
  methods: {
    isActiveControl(number) {
      return this.$store.getters.controls.includes(number);
    },
    catchListClick: function catchListClick() {
      this.$emit('lsitClick');
    },
    catchHomeClick() {
      this.$emit('homeClick');
    },
    catchMapClick: function catchMapClick() {
      this.$emit('mapClick');
    },
  },
  components: {
  },
};
</script>

<style>

.envidatControlInfos.small > .v-input__control > .v-input__slot > .v-text-field__slot > .v-label {
  font-size: 12px !important;
}

.v-input > .v-input__control > .v-input__slot > .v-text-field__slot > .v-label {
  font-size: 14px !important;
}

.envidatControlInfos.small > .v-input__control {
  min-height: 32px !important;
}
.envidatControlInfos > .v-input__control {
  min-height: 40px !important;
}

.envidatControlInfos > .v-input__slot {
    margin: 0 !important;
}

.envidatControlInfos > .v-input__append-outer {
  margin: auto !important;
}

</style>
