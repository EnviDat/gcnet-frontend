<template>

  <v-card :id="_uid" :station="stationId" min-height="140" >
    <v-container fluid fill-height pa-3>

      <v-layout column justify-space-between fill-height>
        <v-flex pt-0>
          <v-layout row justify-space-between>

            <v-flex grow style="font-weight: 700;">
              {{ station.name }}
            </v-flex>

            <v-flex shrink>
              <base-status-icon icon="access_time"
                                :color="allIconColor" />
            </v-flex>

            <v-flex shrink>
              <base-status-icon icon="av_timer"
                                :color="recentIconColor"/>
            </v-flex>

            <v-flex shrink>
              {{ graphs && graphs[0] ? graphs[0].title : '' }}
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex v-if="chartIsLoading"
                xs12 py-0
                style="width: 100%">
          <div class='skeleton skeleton-animation-shimmer' :style="`height: ${chartHeight};`" >
            <div style="width: 100%;" class='bone bone-type-image'></div>
          </div>
        </v-flex>

        <v-flex v-if="!chartIsLoading && !hasData"
              xs12
              class="body-1"
              :style="`color: ${ $vuetify.theme.error };`" >
          {{ noDataText }}
        </v-flex>

        <v-flex v-if="dataError"
                xs12 py-0
                class="smallText"
                :style="`color: ${ $vuetify.theme.error };`" >
          {{ dataError }}
        </v-flex>

        <v-flex v-show="!chartIsLoading && hasData"
                xs12 py-0 >
          <div :id="microChartId"
                :style="`width: 100%; height: ${chartHeight}; border: 1px solid #eee;`" >
          </div>    
        </v-flex>

        <v-flex v-if="!dataError"
                xs12 py-0
                class="smallText">
          {{ `${ chartIsLoading ? 'Loading' : 'Showing'} ${ loadRecentData ? 'recent data' : 'all data'}` }}
        </v-flex>

        <v-flex xs12 pt-2>
          <v-layout row align-center justify-end >
            <v-flex shrink
                    class="smallText">
              {{ showInfo ? 'Hide infos' : 'More infos' }}
            </v-flex>
            <v-flex shrink>
              <base-status-icon-button :icon="showInfo ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                                        :color="showInfo ? 'transparent' : 'secondary'"
                                        @click="showInfo = !showInfo;" />          
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex v-if="showInfo"
                xs12>
          <v-layout column>
            <v-flex >
              <v-divider></v-divider>
            </v-flex>

            <v-flex >
              <v-layout row wrap
                        justify-space-between align-center>
                <v-flex grow
                        class="body-1">
                  {{ 'All Data' }}
                </v-flex>

                <v-flex shrink>
                  <base-status-icon icon="access_time"
                                    :color="allIconColor" />
                </v-flex>

                <v-flex shrink
                        class="smallText">
                  <div :style="`background-color: ${ $vuetify.theme.secondary };`"
                        class="py-0 px-1">
                    {{ allDataLength }}
                  </div>

                </v-flex>

                <v-flex shrink>
                  <base-status-icon-button icon="refresh"
                                            color="secondary"
                                            @click="loadRecentData = false; loadChart(false);" />
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex grow
                    class="smallText">
              {{ allDataUrl }}
            </v-flex>

            <v-flex >
              <v-divider></v-divider>
            </v-flex>

            <v-flex >
              <v-layout row justify-space-between align-center>
                <v-flex grow
                        class="body-1">
                  {{ 'Recent Data' }}
                </v-flex>

                <v-flex shrink>
                  <base-status-icon icon="av_timer"
                                    :color="recentIconColor"/>
                </v-flex>

                <v-flex shrink
                        class="smallText">
                  <div :style="`background-color: ${ $vuetify.theme.secondary };`"
                        class="py-0 px-1">
                    {{ recentDataLength }}
                  </div>
                </v-flex>

                <v-flex shrink>
                  <base-status-icon-button icon="refresh"
                                            color="secondary"
                                            @click="loadRecentData = true; loadChart(false);" />
                </v-flex>
              </v-layout>
            </v-flex>
      
            <v-flex grow
                    class="smallText">
              {{ recentDataUrl }}
            </v-flex>

          </v-layout>
        </v-flex>

      </v-layout>

    </v-container>
  </v-card>

</template>


<script>
import { createMicroLineChart } from "@/chartData/charts";
import BaseStatusIcon from "@/components/BaseElements/BaseStatusIcon";
import BaseStatusIconButton from "@/components/BaseElements/BaseStatusIconButton";


export default {
  props: {
    station: Object,
    JSONUrls: {
      type: Object,
      default: () =>({
        dataURLs: [{ fileType: 'temp', url: './testdata/0temp.json' }],
        recentDataURLs: [{ fileType: 'temp', url: './testdata/0temp_v.json' }],
      }),
    },
    fileValueMapping:{
      type: Object,
      default: () => ({
        temp: ['AirTC1', 'AirTC2'],
        press: ['press'],
        wd: ['WD1', 'WD2'],
        ws: ['WS1', 'WS2'],
        battvolt: ['battvolt'],
      }),
    },
  },
  components: {
    BaseStatusIcon,
    BaseStatusIconButton,
  },
  mounted() {
    this.loadChart();
  },
  beforeDestroy() {
    this.clearChart();
  },
  computed: {
    hasData() {
      // return this.recentDataLength > 0 || this.allDataLength > 0;
      return this.recentDataAvailable || this.alldataAvailable;
    },
    microChartId(){
      return `${this.stationId}_micro`;
    },
    stationId(){
      return `${this._uid}_${this.station.alias}_${this.station.id}`;
    },
    recentIconColor() {
      return this.recentCheckedOnce ? this.recentDataAvailable ? this.$vuetify.theme.success : this.$vuetify.theme.error : 'transparent';
    },
    allIconColor() {
      return this.allCheckedOnce ? this.alldataAvailable ? this.$vuetify.theme.success : this.$vuetify.theme.error : 'transparent';
    },
  },
  methods: {
    loadChart(fallback = true){
      this.fallback = fallback;
      this.chartIsLoading = true;

      this.urlValueMapping = this.getUrlValueMapping(this.loadRecentData);

      this.buildGraphs();

      this.loadJsonCharts();
    },
    getUrlValueMapping(loadRecentData){
      const urlValueMapping = {};
      const keys = Object.keys(this.fileValueMapping);

      for (let i = 0; i < keys.length; i++) {
        const prefix = keys[i];

        const url = this.getUrlToPrefix(prefix, loadRecentData);
        
        if (url) {
          urlValueMapping[url] = this.fileValueMapping[prefix];
        }
      }

      return urlValueMapping;
    },
    getUrlToPrefix(prefix, loadRecentData){
      const urlObjs = loadRecentData ? this.JSONUrls.recentDataURLs : this.JSONUrls.dataURLs;

      for (let i = 0; i < urlObjs.length; i++) {
        const obj = urlObjs[i];
        
        if (prefix === obj.fileType) {
          return obj.url;
        }
      }

      return null;
    },
    buildGraphs(){
      const keys = Object.keys(this.urlValueMapping);
      const graphs = [];

      for (let i = 0; i < keys.length; i++) {
        const url = keys[i];
        const dataParameters = this.urlValueMapping[url];

        for (let j = 0; j < dataParameters.length; j++) {
          const param = dataParameters[j];

          graphs.push({
            lineColor: this.seriesSettings.lineColor,
            title: param,
            valueField: param,
            dataUrl: url,
          });
        }
      }

      this.graphs = graphs;
    },
    clearChart(){
      if (this.microChart) {
        this.microChart.dispose();
      }
    },
    loadJsonCharts(){
      this.chartIsLoading = true;
      const currentDataUrl = this.graphs[0].dataUrl;

      if (this.loadRecentData) {
        this.recentDataUrl = currentDataUrl;
        this.recentDataLength = 0;
      } else {
        this.allDataUrl = currentDataUrl;
        this.allDataLength = 0;
      }

      const dateFormatingInfos = {
        dateFormat: this.dateFormat,
        inputFormat: 'x',
      };

      try {
        if (!this.microChart) {
          this.microChart = createMicroLineChart(this.microChartId, 'timestamp', [this.graphs[0]], this.seriesSettings,
                                                  dateFormatingInfos, this.seriesDone, this.seriesError);
        } else {
          const series = this.microChart.series.values[0];
          series.data = [];
          // this.microChart.invalidateData();          
          const source = series.dataSource;
          source.url = currentDataUrl;
          source.load();
        }
        
      } catch (error) {
        this.dataError = `Error creating chart: ${error}`;
      }
    },
    seriesError(error) {
      this.chartIsLoading = false;
      this.dataError = error.message;

      this.loadRecentData ? this.recentCheckedOnce = true : this.allCheckedOnce = true;

      if (this.loadRecentData ) {
        this.recentDataAvailable = false;
        if (this.fallback){
          this.loadRecentData = false;
          this.loadChart();
        }
      } else {
        this.alldataAvailable = false;
      }
    },
    seriesDone(doneResponse) {
      this.chartIsLoading = false;
      const dataLength = doneResponse && doneResponse.data ? doneResponse.data.length : 0;
      
      this.loadRecentData ? this.recentCheckedOnce = true : this.allCheckedOnce = true;

      if (dataLength > 0) {
        if (this.loadRecentData) {
          this.recentDataAvailable = true;
          this.recentDataLength = dataLength;
        } else {
          this.alldataAvailable = true;
          this.allDataLength = dataLength;
        }
      } else {
        if (this.loadRecentData) {
          this.recentDataAvailable = false;
          if (this.fallback){
            this.loadRecentData = false;
            this.loadChart();
          }
        } else {
          this.alldataAvailable = false;
        }
      }
    },    
  },
  data: () => ({
    microChart: null,
    chartHeight: '50px',
    dateFormat: 'HH:mm DD/MM/YYYY',
    dataError: '',
    noDataText: 'No data available',
    loadRecentData: true,
    recentCheckedOnce: false,
    recentDataAvailable: false,
    recentDataLength: 0,
    recentDataUrl: '',
    allCheckedOnce: false,
    alldataAvailable: false,
    allDataLength: 0,
    allDataUrl: '',
    chartIsLoading: true,
    showInfo: false,
    graphs: [],
    seriesSettings: {
      lineStrokeWidth: 3,
      lineColor: '#8ACDCE',
    },    
    urlValueMapping: {},
  }),
};
</script>

<style scoped>
 .smallText {
   font-size: 9px;
   word-break: break-all;
 }
</style>
