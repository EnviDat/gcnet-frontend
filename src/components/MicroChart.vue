<template>

  <v-card :id="_uid" :station="stationId" >
    <v-card-title >

      <v-layout column>
        <v-flex>
          <v-layout row justify-space-between>

            <v-flex grow>
              {{ station.name }}
            </v-flex>

            <v-flex shrink>
              {{ graphs && graphs[0] ? graphs[0].title : '' }}
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex xs12 style="height: 20px;">
          <div class='skeleton skeleton-animation-shimmer' >
            <div class='bone bone-type-image'></div>
          </div>
        </v-flex>

        <v-flex v-if="dataError"
              xs12
              style="color: red;" >
          {{ dataError }}
        </v-flex>

        <v-flex xs12 >
          <div :id="microChartId"
                style="width: 100%; height: 50px; border: 1px solid #eee;" >
          </div>    
        </v-flex>

      </v-layout>

    </v-card-title>
  </v-card>

</template>


<script>
import * as am4core from '@amcharts/amcharts4/core';
import microchart from '@amcharts/amcharts4/themes/microchart';
// import animated from '@amcharts/amcharts4/themes/animated';
import * as bullets from '@amcharts/amcharts4/plugins/bullets';

am4core.useTheme(microchart);
// am4core.useTheme(animated);

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
    this.urlValueMapping = this.getUrlValueMapping();

    this.buildGraphs();

    this.loadJsonCharts();
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
    getUrlValueMapping(){
      const urlValueMapping = {};
      const keys = Object.keys(this.fileValueMapping);

      for (let i = 0; i < keys.length; i++) {
        const prefix = keys[i];

        const url = this.getUrlToPrefix(prefix, true);
        
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
          graphs.push(this.createGraph(param, url, j));
        }
      }

      this.graphs = graphs;
    },
    createGraph(parameter, url, count){
      // let lineColor = '#73C8A9';

      // if (count == 1) {
      //   lineColor = '#B0DE09';
      // } else if (count == 2) {
      //   lineColor = '#00F4FF';
      // } else if (count == 2) {
      //   lineColor = '#AAAAE5';
      // }
      let lineColor = this.colorPalette[this.colorCount];
      this.colorCount++;
      
      return {
        lineColor,
        bullet: this.bulletForms[count],
        bulletRadius: this.seriesSettings.bulletsRadius,
        title: parameter,
        valueField: parameter,
        hideBulletsCount: 20,
        dataUrl: url,
        hidden: count > 0 ? true : false,
      };
    },
    clearChart(){
      if (this.microChart) {
        this.microChart.dispose();
      }
    },
    loadJsonCharts(){
      const dateFormatingInfos = {
        dateFormat: this.dateFormat,
        inputFormat: 'x',
      };

      try {
        // if (!this.microChart) {
          this.microChart = createMicroLineChart(this.microChartId, 'timestamp', null, this.graphs, this.groupData, undefined, dateFormatingInfos);
          // this.microChart.events.on('ready', () => {
          //   console.log('microChart is ready');
          // });
        // } else {
        //   this.microChart.data = jsonRecords;
        //   this.microChart.invalidateRawData();
        // }
        
      } catch (error) {
        this.dataError = `Error creating chart: ${error}`;
      }

    },
  },
  data: () => ({
    microChart: null,
    dateFormat: 'HH:mm DD/MM/YYYY',
    dataError: '',
    loadRecentData: true,
    groupData: true,
    graphs: [],
    seriesSettings: {
      lineStrokeWidth: 3,
      // lineOpacity: 1,
      // // the auto gap depends on the baseInterval, which might be "hours"
      // // works if the lineConnect is false
      // lineAutoGap: 2,
      // lineConncet: false,
      // bulletsStrokeWidth: 2,
      bulletsRadius: 2,
      // bulletFill: 'black',
      // bulletsfillOpacity: 1,
      // bulletsStrokeOpacity: 1,
    },    
    urlValueMapping: {},
    bulletForms: [new am4core.Circle(), new am4core.Rectangle(), new am4core.Triangle() , new bullets.Star()],
    colorCount: 0,
    colorPalette: ['#DCECC9', '#B3DDCC', '#8ACDCE',
                   '#62BED2', '#46AACE', '#3D91BE',
                   '#3577AE', '#2D5E9E', '#24448E',
                   '#1C2B7F', '#162065', '#11174B'],
  }),
};
</script>

<style scoped>

</style>
