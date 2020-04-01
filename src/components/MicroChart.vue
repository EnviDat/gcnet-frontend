<template>

  <v-card :id="_uid" :station="stationId" style="height: 135px;" >
    <v-card-title >

      <v-layout column>
        <v-flex>
          <v-layout row justify-space-between>

            <v-flex grow style="font-weight: 700;">
              {{ station.name }}
            </v-flex>

            <v-flex shrink>
              {{ graphs && graphs[0] ? graphs[0].title : '' }}
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex v-show="chartIsLoading"
                xs12 
                style="width: 100%">
          <div class='skeleton skeleton-animation-shimmer' :style="`height: ${chartHeight};`" >
            <div style="width: 100%;" class='bone bone-type-image'></div>
          </div>
        </v-flex>

        <v-flex v-show="!chartIsLoading && dataLength <= 0"
              xs12
              style="color: red;" >
          {{ noDataText }}
        </v-flex>

        <v-flex v-show="dataError"
                xs12
                style="color: red; font-size: 9px;" >
          {{ dataError }}
        </v-flex>

        <v-flex v-show="!chartIsLoading && dataLength > 0"
                xs12 >
          <div :id="microChartId"
                :style="`width: 100%; height: ${chartHeight}; border: 1px solid #eee;`" >
          </div>    
        </v-flex>

        <v-flex v-if="!dataError"
                xs12 
                style="font-size: 9px;">
          {{ `${chartIsLoading ? 'Loading ' : ''}${loadRecentData ? 'recent data' : 'data'} from ${currentDataUrl}` }}
        </v-flex>

      </v-layout>

    </v-card-title>
  </v-card>

</template>


<script>
import { createMicroLineChart } from "@/chartData/charts";


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
  },
  mounted() {
    this.loadChart();
  },
  beforeDestroy() {
    this.clearChart();
  },
  computed: {
    hasData() {
      // return !this.currentFileLoading && !this.dataError;
      return this.microChart && this.microChart.isReady();
    },
    microChartId(){
      return `${this.stationId}_micro`;
    },
    stationId(){
      return `${this._uid}_${this.station.alias}_${this.station.id}`;
    },
  },
  methods: {
    loadChart(){
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
      this.currentDataUrl = this.graphs[0].dataUrl;
      this.dataLength = 0;

      const dateFormatingInfos = {
        dateFormat: this.dateFormat,
        inputFormat: 'x',
      };

      try {
        if (!this.microChart) {
          this.microChart = createMicroLineChart(this.microChartId, 'timestamp', [this.graphs[0]], this.seriesSettings,
                                                  dateFormatingInfos, this.seriesDone, this.seriesError);
        } else {
          const source = this.microChart.series.values[0].dataSource;
          source.url = this.currentDataUrl;
          source.load();
        }
        
      } catch (error) {
        this.dataError = `Error creating chart: ${error}`;
      }
    },
    seriesError(error) {
      this.chartIsLoading = false;
      this.dataError = error.message;

      if (this.loadRecentData ) {
        this.recentDataAvailable = false;
        this.loadRecentData = false;
        this.loadChart();
      }
    },
    seriesDone(doneResponse) {
      this.chartIsLoading = false;
      this.dataLength = doneResponse && doneResponse.data ? doneResponse.data.length : 0;

      if (this.dataLength <= 0 && this.loadRecentData ) {
        this.recentDataAvailable = false;
        this.loadRecentData = false;
        this.loadChart();
      }
    },
  },
  data: () => ({
    microChart: null,
    chartHeight: '50px',
    dateFormat: 'HH:mm DD/MM/YYYY',
    dataError: '',
    dataLength: 0,
    noDataText: 'No data available',
    loadRecentData: true,
    recentDataAvailable: true,
    chartIsLoading: true,
    currentDataUrl: '',
    groupData: true,
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

</style>
