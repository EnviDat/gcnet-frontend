<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.smAndDown ? 'px-3 py-1' : 'px-2 py-1'"
                @click="anyClick">  

    <v-layout row wrap >
  
      <v-flex xs12 offset-xs6
          v-if="loadingStation"
      >
        <v-progress-circular
          indeterminate
          color="primary"
          
          />
      </v-flex>

      <v-flex xs12
              ref="iframe_parent"
              v-show="!loadingStation && !showHomeScreen"
                >

        <!-- <iframe :style="`height: 100%; width: 100%;`"
                id="station_iframe"
                ref="station_iframe"
                src=""
                frameborder="0" >
        </iframe> -->
      </v-flex>

      <v-flex xs12 md8 offset-md2
              v-show="showHomeScreen" >

              <!-- :class="{ 'px-5': $vuetify.breakpoint.mdAndUp,
                        'px-1': $vuetify.breakpoint.smAndDown,
                      }" -->

        <v-flex>
          <title-view :title="homeInfos.title"
                      :slogan="homeInfos.startText"
                      />
        </v-flex>

        <!-- <v-flex xs12
                pt-5>
          <p v-html="homeInfos.homeText"></p>
        </v-flex> -->

        <v-flex xs12
                pt-3>
          <p v-html="homeInfos.awsInfo"></p>
        </v-flex>

        <v-flex xs12
                v-if="showMoreInfos">
          <p v-html="homeInfos.gcnetTransmissionsInfo"></p>
        </v-flex>

        <v-flex xs12
                v-if="showMoreInfos">
          <p v-html="homeInfos.additionalInfo"></p>
        </v-flex>

        <v-flex xs12
                pt-3>
          <v-layout row wrap>
            <v-flex>
              <base-rectangle-button :buttonText="MapSelectionText"
                                      materialIconName="map"
                                      iconColor="white"
                                      v-on:clicked="catchMapViewClick()"
                                      />
            </v-flex>

            <v-flex>
              <base-rectangle-button :buttonText="ListSelectionText"
                                      materialIconName="list"
                                      iconColor="white"
                                      v-on:clicked="catchListViewClick()"
                                    />
            </v-flex>

            <v-flex>
              <base-rectangle-button :buttonText="dataRequestText"
                                      materialIconName="save_alt"
                                      iconColor="white"
                                      url="http://cires1.colorado.edu/steffen/gcnet/order/admin/station.php"
                                    />
            </v-flex>

            <v-flex>
              <base-rectangle-button :buttonText="showMoreInfosText"
                                      materialIconName="info"
                                      iconColor="white"
                                      v-on:clicked="showMoreInfos = !showMoreInfos"
                                    />
            </v-flex>

          </v-layout>
        </v-flex>
      </v-flex>

      <!-- <v-flex xs12 md8 offset-md2
              v-if="!showHomeScreen && showOverview" >

          <v-layout column >
            <v-flex py-3 >
              <chart :station="$store.getters.stations[0]" />
            </v-flex>
          </v-layout>

      </v-flex> -->

            <!-- <v-flex py-3
                    v-for="station in $store.getters.stations"
                    :key="station.id">

              <chart :station="station" />

            </v-flex> -->

    </v-layout>
  </v-container>
</template>

<script>
// import vuex from 'vuex';
// import { mapGetters } from 'vuex';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
// import ControlPanelView from '@/components/ControlPanelView.vue';
import TitleView from '@/components/TitleView.vue';
import homeInfos from '@/homeInfos';
// import mapHTML from '@/map_html.html';
// import StationsMap from '@/components/StationsMap';

export default {
  props: {
    currentStation: Object,
    showHomeScreen: Boolean,
  },
  components: {
    BaseRectangleButton,
    // ControlPanelView,
    TitleView,
    // StationsMap,
  },
  data: () => ({
    baseStationURL: 'https://www.wsl.ch/gcnet/cms/stations/',
    loadingStation: false,
    homeInfos,
    MapSelectionText: 'Select Stations via map',
    ListSelectionText: 'Choose Station from list',
    dataRequestText: 'Request GC-Net Data',
    showMoreInfos: false,
    showMoreInfosText: 'More Information',
    currentStationName: '',
    stationOverviewUrl: 'https://www.wsl.ch/gcnet/stations.html',
    // mapHTML,
  }),
  watch: {
    currentStation: function updateStation() {
      if (this.currentStation) {
        this.loadStation(this.baseStationURL + this.currentStation.alias);
      }
    },
    showOverview: function updateStationOverview(){
      if (this.showOverview) {
        this.currentStation = null;
        this.loadStation(this.stationOverviewUrl);
      }
    },
  },
  methods: {
    isActiveControl(number) {
      return this.$store.getters.controls.includes(number);
    },
    checkStations() {
      const stations = this.$store.getters.stations;

      for (let index in stations) {
        const station = stations[index];
        
        station.urlValid = this.UrlExists(this.baseStationURL + station.alias);
      }
    },
    catchMapViewClick() {
      this.$emit('mapViewClick');
    },
    catchListViewClick() {
      this.$emit('listViewClick');
    },
    iframeWithSource(src){
        return `<iframe style="height: 100%; width: 100%;"
                id="station_iframe"
                ref="station_iframe"
                src="${src}"
                onload="${ this.loadingStation = false }"
                frameborder="0" >
              </iframe>`;
    },
    anyClick(){
      this.$emit('anyClick');
    },
    loadStation(url) {
      this.loadingStation = true;

      this.$refs.iframe_parent.innerHTML = null;
      this.$refs.iframe_parent.innerHTML = this.iframeWithSource(url);
    },
    iframeScreenHeight() {
      return window.innerHeight - 150;
    },
    // randomImg(name) {
    //   const keys = Object.keys(this.cardImgs);
    //   let rnd = 0;

    //   if (keys.length > 0) {
    //     // rnd = this.randomIntFromInterval(0, keys.length - 1);
    //     rnd = this.randomIntFromSeed(0, keys.length - 1)
    //   }

    //   return this.cardImgs[keys[rnd]];
    // },
  },

};
</script>

<style scoped>


  iframe html .wrap,
  iframe html .measurement-panel {
    padding: 0 !important;
  }

</style>
