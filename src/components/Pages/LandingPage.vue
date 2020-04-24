<template>
  <v-container fluid
                fill-height
                :class="$vuetify.breakpoint.smAndDown ? 'px-3 py-1' : 'px-2 py-1'"
                @click="anyClick">

    <v-layout row wrap >
  
      <v-flex xs12 md8 offset-md2 >

        <!-- <v-flex pb-3>
          <title-view :title="homeInfos.title"
                      :slogan="showHomeScreen ? homeInfos.startText : ''"
                      />
        </v-flex> -->

        <!-- <v-flex xs12
                pt-5>
          <p v-html="homeInfos.homeText"></p>
        </v-flex> -->

        <v-flex xs12
                pt-3
                >
          <p v-html="homeInfos.awsInfo"></p>
        </v-flex>

        <v-flex xs12
                v-if="!showOverview && showMoreInfos">
          <p v-html="homeInfos.gcnetTransmissionsInfo"></p>
        </v-flex>

        <v-flex xs12
                v-if="!showOverview && showMoreInfos">
          <p v-html="homeInfos.additionalInfo"></p>
        </v-flex>

        <v-flex xs12
                pt-3>
          <v-layout row wrap >
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
                                      v-on:clicked="showMoreInfos = !showMoreInfos; catchOverviewClick();"
                                    />
            </v-flex>

          </v-layout>
        </v-flex>
      </v-flex>

      <v-flex v-if="showOverview"
              xs12
              pt-3>
        <stations-overview-page @detailClick="(stationID) => { $emit('detailClick', stationID); }" />
      </v-flex>

    </v-layout>
  </v-container>
</template>

<script>
import StationsOverviewPage from '@/components/Pages/StationsOverviewPage';

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton.vue';
// import TitleView from '@/components/TitleView.vue';
import homeInfos from '@/homeInfos';

export default {
  props: {
    showHomeScreen: Boolean,
    showOverview: Boolean,
  },
  components: {
    BaseRectangleButton,
    // TitleView,
    StationsOverviewPage,
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
    stationOverviewUrl: 'https://www.wsl.ch/gcnet/stations.html',
  }),
  methods: {
    catchMapViewClick() {
      this.$emit('mapViewClick');
    },
    catchListViewClick() {
      this.$emit('listViewClick');
    },
    catchOverviewClick() {
      this.$emit('overviewClick');
    },
    anyClick(){
      this.$emit('anyClick');
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
