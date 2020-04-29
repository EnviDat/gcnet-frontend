<template>

  <!-- <v-fade-transition> -->
  <v-card :id="stationId"
          ref="main_container"
          v-show="visible" >
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
              xs12 py-1
              class="body-1"
              :style="`color: ${ $vuetify.theme.error };`" >
          {{ noDataText }}
        </v-flex>

        <v-flex v-if="dataError"
                xs12
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
          {{ `${ chartIsLoading ? 'Loading' : 'Showing'} ${ graphs && graphs[0] ? graphs[0].title : '' } of ${ loadRecentData ? 'recent data' : 'all data'}` }}
        </v-flex>

        <v-flex xs12 
                pt-2>
          <v-layout row align-center justify-space-between >
            <v-flex shrink>
              <v-layout row>
                <v-flex shrink>
                  <base-status-icon-button :icon="showInfo ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                                            color="primary"
                                            :outline="true"
                                            @click="showInfo = !showInfo;" />          
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex shrink>
              <v-layout row>
                <v-flex shrink
                        px-0
                        class="smallText">
                  Station Details
                </v-flex>

                <v-flex shrink>
                  <base-status-icon-button icon="search"
                                            color="secondary"
                                            @click="catchDetailClick(station.alias)" />
                </v-flex>
              </v-layout>
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
  <!-- </v-fade-transition> -->

</template>


<script>
import { createMicroLineChart } from "@/chartData/charts";
import BaseStatusIcon from "@/components/BaseElements/BaseStatusIcon";
import BaseStatusIconButton from "@/components/BaseElements/BaseStatusIconButton";


export default {
  name: 'MicroChart',
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
    delay: {
      type: Number,
      default: 500,
    },
  },
  components: {
    BaseStatusIcon,
    BaseStatusIconButton,
  },
  mounted() {
    let that = this;

    setTimeout(() => {
      that.visible = true;
      // console.log("visible " + that.station.name + ' ' + that.visible);
      if (that.$refs && that.$refs.main_container){
        that.loadChart();
      }
      that = null;
    }, this.delay);
    // console.log("visible " + that.station.name + ' ' + that.visible);
  },
  beforeDestroy() {
    // console.log('MicroChart: beforeDestroy method ' + this.microChartId);
    this.clearChart();
  },
  computed: {
    hasData() {
      // return this.recentDataLength > 0 || this.allDataLength > 0;
      return this.recentDataAvailable || this.alldataAvailable;
    },
    microChartId(){
      return `${this.stationId}_microChart`;
    },
    stationId(){
      return `${this.station.id}_${this.station.alias ? this.station.alias : this.station.name}`;
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
      this.clearChart();

      this.fallback = fallback;
      this.chartIsLoading = true;

      this.urlValueMapping = this.getUrlValueMapping(this.loadRecentData);

      this.buildGraphs();

      // clear and then new loading on the next tick is needed for the disposing to finish
      this.$nextTick( () => {
        this.loadJsonCharts();
      });
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
      this.colorCount = 0;
      const keys = Object.keys(this.urlValueMapping);
      const graphs = [];

      for (let i = 0; i < keys.length; i++) {
        const url = keys[i];
        const dataParameters = this.urlValueMapping[url];

        for (let j = 0; j < dataParameters.length; j++) {
          const param = dataParameters[j];

          let lineColor = this.colorPalette[this.colorCount];
          this.colorCount++;

          graphs.push({
            lineColor: lineColor,
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
        // console.log('dispose via MicroChart');
        this.microChart.dispose();
        // console.log('delete via MicroChart');
        this.microChart = null;
        // delete this.microChart;
      }
    },
    loadJsonCharts(){
      this.chartIsLoading = true;
      const currentDataUrl = this.graphs[0].dataUrl;

      this.loadRecentData ? this.recentDataUrl = currentDataUrl : this.allDataUrl = currentDataUrl;
      this.loadRecentData ? this.recentDataLength = 0 : this.allDataLength = 0;

      const dateFormatingInfos = {
        dateFormat: this.dateFormat,
        inputFormat: 'x',
      };

      try {
        this.microChart = createMicroLineChart(this.microChartId, 'timestamp', this.graphs, this.seriesSettings,
                                                  dateFormatingInfos, this.seriesDone, this.seriesError);
        // if (!this.microChart) {
        //   this.microChart = createMicroLineChart(this.microChartId, 'timestamp', [this.graphs[0]], this.seriesSettings,
        //                                             dateFormatingInfos, this.seriesDone, this.seriesError);
        // } else {
        //   // this.clearChart();
        //   const series = this.microChart.series.values[0];
        //   series.data = [];
        //   const source = series.dataSource;
        //   source.dispose();
        //   source.url = currentDataUrl;
        //   source.load();
        // }
        
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

          this.$nextTick( () => {
            this.loadChart();
          });
        }
      } else {
        this.alldataAvailable = false;
        this.clearChart();
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
            
            this.$nextTick( () => {
              this.loadChart();
            });
          }
        } else {
          this.alldataAvailable = false;
          this.clearChart();
        }
      }
    },
    catchDetailClick(stationId){
      this.$emit('detailClick', stationId);
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
      lineStrokeWidth: 2,
      lineColor: '#8ACDCE',
    },    
    urlValueMapping: {},
    visible: false,
    colorCount: 0,
    colorPalette: ['#8ACDCE', 
                   '#3D91BE', 
                   '#24448E', 
                   '#11174B'],
    // colorPalette: ['#DCECC9', '#B3DDCC', '#8ACDCE',
    //                '#62BED2', '#46AACE', '#3D91BE',
    //                '#3577AE', '#2D5E9E', '#24448E',
    //                '#1C2B7F', '#162065', '#11174B'],
  }),
};
</script>

<style scoped>
 .smallText {
   font-size: 9px;
   word-break: break-all;
 }
</style>
