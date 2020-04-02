<template>

  <v-card :id="_uid" :station="stationId" >
    <v-card-title class="display-1">
      <v-layout row justify-space-around>
        <v-flex grow>
          {{ station.name }}
        </v-flex>
        <v-flex shrink>
          <base-rectangle-button :buttonText="loadAllDataText"
                                  :isSmall="false"
                                  :color="hasData && !loadRecentData ? 'green' : 'primary'"
                                  @clicked="groupData = true; loadRecentData = false; loadChart();" />
        </v-flex>
        <v-flex shrink>
          <base-rectangle-button :buttonText="loadRecentDataText"
                                  :isSmall="false"
                                  :color="hasData && loadRecentData ? 'green' : 'primary'"
                                  @clicked="loadRecentData = true; loadChart();" />
        </v-flex>
        <v-flex shrink>
          <base-icon-button materialIconName="compress"
                                  :outlined="true"
                                  :isToggled="groupData"
                                  :iconColor="groupData ? 'white' : 'primary'"
                                  @clicked="groupData = !groupData" />
        </v-flex>
      </v-layout>

    </v-card-title>

    <v-card-text>
      <v-layout row wrap>
        
        <v-flex v-if="!hasData"
                xs12
                pb-3 >
          Loading {{ currentFileLoading }}
        </v-flex>

        <v-flex v-if="!currentFileLoading && dataError"
              xs12
              pb-3
              style="color: red;" >
          Could not load the chart, an error occured: {{ dataError }}
        </v-flex>

        <v-flex v-show="hasData"
                xs12 >
          <div :id="weatherChartId"
                style="height: 350px;" >
          </div>    
        </v-flex>

      </v-layout>

    </v-card-text>
  </v-card>

</template>


<script>
import * as am4core from "@amcharts/amcharts4/core";
import * as bullets from '@amcharts/amcharts4/plugins/bullets';

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import { createLineChart } from "@/chartData/charts";

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
    BaseRectangleButton,
    BaseIconButton,
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
      return this.weatherChart && this.weatherChart.isReady();
    },
    weatherChartId(){
      return `${this.stationId}_weather`;
    },
    windChartId(){
      return `${this.stationId}_wind`;
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
      if (this.weatherChart) {
        this.weatherChart.dispose();
      }
      if (this.windChart) {
        this.windChart.dispose();
      }
    },
    loadJsonCharts(){
      const dateFormatingInfos = {
        dateFormat: this.dateFormat,
        inputFormat: 'x',
      };

      try {
        // if (!this.weatherChart) {
          this.weatherChart = createLineChart(this.weatherChartId, 'timestamp', null, this.graphs, this.groupData, undefined, undefined, dateFormatingInfos);
          // this.weatherChart.events.on('ready', () => {
          //   console.log('WeatherChart is ready');
          // });
        // } else {
        //   this.weatherChart.data = jsonRecords;
        //   this.weatherChart.invalidateRawData();
        // }
        
      } catch (error) {
        this.dataError = `Error creating the weather chart: ${error}`;
      }

    },
  },
  data: () => ({
    weatherChart: null,
    windChart: null,
    dateFormat: 'HH:mm DD/MM/YYYY',
    currentFileLoading: '',
    dataError: '',
    loadRecentData: true,
    loadRecentDataText: 'Load data from last 14 days',
    loadAllDataText: 'Load all data',
    theme: 'light',
    groupData: true,
    graphs: [],
    seriesSettings: {
      // lineStrokeWidth: 3,
      // lineOpacity: 1,
      // // the auto gap depends on the baseInterval, which might be "hours"
      // // works if the lineConnect is false
      // lineAutoGap: 2,
      // lineConncet: false,
      // bulletsStrokeWidth: 2,
      bulletsRadius: 3,
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
