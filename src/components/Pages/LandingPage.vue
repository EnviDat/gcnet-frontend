<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.smAndDown ? 'px-3 py-1' : 'px-2 py-1'"
                @click="anyClick">

    <v-layout row wrap >
  
      <v-flex xs12 offset-xs6
          v-if="loadingStation" >
        <v-progress-circular
          indeterminate
          color="primary" />

      </v-flex>

      <v-flex xs12
              ref="iframe_parent"
              v-show="!loadingStation && !showHomeScreen" >
      </v-flex>

      <v-flex xs12 md8 offset-md2
              v-show="showHomeScreen" >

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
          <v-layout row wrap >
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

            <v-flex>
              <base-rectangle-button :buttonText="showOverviewText"
                                      materialIconName="dashboard"
                                      iconColor="white"
                                      v-on:clicked="catchOverviewClick"
                                    />
            </v-flex>

          </v-layout>
        </v-flex>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
import TitleView from '@/components/TitleView.vue';
import homeInfos from '@/homeInfos';

export default {
  props: {
    currentStation: Object,
    showHomeScreen: Boolean,
  },
  components: {
    BaseRectangleButton,
    TitleView,
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
    showOverviewText: 'Show Stations Overview',
    currentStationName: '',
    stationOverviewUrl: 'https://www.wsl.ch/gcnet/stations.html',
  }),
  watch: {
    currentStation: function updateStation() {
      if (this.currentStation) {
        this.loadStation(this.baseStationURL + this.currentStation.alias);
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
    catchOverviewClick() {
      this.$emit('overviewClick');
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
  },

};
</script>

<style scoped>


  iframe html .wrap,
  iframe html .measurement-panel {
    padding: 0 !important;
  }

</style>
