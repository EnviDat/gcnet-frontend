<template>

  <v-card >
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
        
      <v-flex v-if="currentFileLoading && !dataError"
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


      <!-- <v-flex v-show="hasData"
              xs12 >
        {{ loadRecentData ? 'Recent data loaded' : 'All data loaded' }}
      </v-flex> -->

      <v-flex v-show="hasData"
              xs12 >
        <div ref="chartdiv" id="chartdiv"
              style="height: 350px;" >
        </div>    
      </v-flex>
      
      <v-flex v-show="hasData"
              xs12 >
        <div v-show="hasData" ref="chartdiv" id="wchartdiv"
              style="height: 350px;" >
        </div>    
      </v-flex>

      </v-layout>

    </v-card-text>
  </v-card>

</template>


<script>
import axios from 'axios';
import * as am4core from "@amcharts/amcharts4/core";
import * as bullets from '@amcharts/amcharts4/plugins/bullets';

import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import BaseIconButton from '@/components/BaseElements/BaseIconButton';
import {
  createLineChart,
} from "@/chartData/charts";
import {
    createJSONDataset,
} from "@/chartData/data_conversion";


export default {
  props: {
    station: Object,
  },
  components: {
    BaseRectangleButton,
    BaseIconButton,
  },
  mounted() {
    this.createJSONDataset = createJSONDataset;

    this.enhanceStation(this.station);

    this.loadChart();
  },
  beforeDestroy() {
    this.clearChart();
  },
  computed: {
    hasData() {
      return !this.currentFileLoading && !this.dataError;
    },
    weatherGraphs(){
      return [{
        "lineColor": "#F39D01",
        "bullet": new am4core.Circle(),
        "bulletRadius": this.seriesSettings.bulletsRadius,
        "title": "Atmos Pressure",
        "valueField": "pressure",
        "hideBulletsCount": 0
      }, {
        "lineColor": "#B0DE09",
        "bullet": new am4core.Rectangle(),
        "bulletRadius": this.seriesSettings.bulletsRadius * 2,
        "title": "Net Radiation",
        "valueField": "net_radiation",
        "hideBulletsCount": 0
      }, {
        "lineColor": "#00F4FF",
        "bullet": new am4core.Triangle(),
        "bulletRadius": this.seriesSettings.bulletsRadius * 2,
        "title": "Air Temperature-TC Air 1",
        "valueField": "tc_air_1",
        "hideBulletsCount": 0
      }, {
        "lineColor": "#AAAAE5",
        "bullet": new bullets.Star(),
        "bulletRadius": this.seriesSettings.bulletsRadius * 2,
        "title": "Air Temperature-TC Air 2",
        "valueField": "tc_air_2",
        "hideBulletsCount": 0
      }];
    },
    windGraphs(){
      return [{
        "lineColor": "#73C8A9",
        "bullet": new am4core.Circle(),
        "bulletRadius": this.seriesSettings.bulletsRadius,
        "title": "Wind Speed U1 M [m/s]",
        "valueField": "wind_speed_u1",
        "hideBulletsCount": 0
      }, {
        "lineColor": "#2E926F",
        "bullet": new am4core.Rectangle(),
        "bulletRadius": this.seriesSettings.bulletsRadius * 2,
        "title": "Wind Speed U2 N [m/s]",
        "valueField": "wind_speed_u2",
        "hideBulletsCount": 0
      }, {
        "lineColor": "#BD5532",
        "bullet": new am4core.Triangle(),
        "bulletRadius": this.seriesSettings.bulletsRadius * 2,
        "title": "Wind direction 1 O [deg]",
        "valueField": "wind_dir_u1",
        "hideBulletsCount": 0
      }, {
        "lineColor": "#6D2600",
        "bullet": new bullets.Star(),
        "bulletRadius": this.seriesSettings.bulletsRadius * 2,
        "title": "Wind direction 2 P [deg]",
        "valueField": "wind_dir_u2",
        "hideBulletsCount": 0
      }];
    },
  },
  methods: {
    clearChart(){
      if (this.weatherChart) {
        this.weatherChart.dispose();
      }
      if (this.windChart) {
        this.windChart.dispose();
      }
    },
    loadChart(){
      this.clearChart();

      this.loadFileFromBackend(this.station, this.$refs.chartdiv, this.loadRecentData);
    },
    loadDataText(){
      return this.loadRecentData ? this.loadRecentDataText : this.loadAllDataText;
    },
    loadChartData(records) {
      var data = [];

      var record;

      for (var i = 0; i < records.length; i++) {

          record = records[i];

          data.push({
              station: record.station,
              date: record.time,
              sw_down: record.sw_down,
              sw_up: record.sw_up,
              net_radiation: record.net_radiation,
              tc_air_1: record.tc_air_1,
              tc_air_2: record.tc_air_2,
              wind_speed_u1: record.wind_speed_u1,
              wind_speed_u2: record.wind_speed_u2,
              wind_dir_u1: record.wind_dir_u1,
              wind_dir_u2: record.wind_dir_u2,
              pressure: record.pressure,
          });
      }

      this.chartData = data;
    },
    getJSONFilesurlObjs(station, loadRecentData){
      const urlObjs = [];

      for (let i = 0; i < this.filePrefixes.length; i++) {
        const prefix = this.filePrefixes[i];
        const fileName = `${station.id}${prefix}${loadRecentData ? '_v' : ''}.json`;

        // add the timestamp to prevent server side caching
        const url = process.env.NODE_ENV === 'production' ? `${this.baseurl}${fileName}?t=${Date.now()}` : `./testdata/${fileName}`;
        urlObjs.push({ fileType: prefix, recentData: loadRecentData, url });
      }

      return urlObjs;
    },
    // loadJSONFiles(station, urlObjs) {    

    //   for (let i = 0; i < urlObjs.length; i++) {
    //     const urlObj = urlObjs[i];
    //     axios.get(urlObj.url)
    //     .then(response => {
    //       this.
    //     }).catch(error => {

    //     }).finally();
    //   }
      
    // },
    loadFileFromBackend(station, selector, loadRecentData){

      const fileName = loadRecentData ? station.shortFileName : station.fileName;
      this.currentFileLoading = fileName;

      // add the timestamp to prevent server side caching
      const url = process.env.NODE_ENV === 'production' ? `${this.baseurl}${fileName}?t=${Date.now()}` : `./testdata/${fileName}`;

      let headers = {
        // 'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache',
        'Content-Type': 'text/csv'
      }

      const dataCall = axios.create({
        // baseURL: process.env.VUE_APP_API_URL,
        headers: headers
      });

      const that = this;
      that.dataError = '';

      dataCall.get(url)
      .then(response => {
        that.handleResponse(that, station, response.data);
      })
      .catch(error => {
        that.dataError = error;
      }).finally (() => {
        that.currentFileLoading = ''
      });
    },
    handleResponse(vueInstance, station, data){
      if (vueInstance.currentFileLoading === station.fileName) {
          vueInstance.fullData = data;

          // vueInstance.useShortFile = false;
          vueInstance.fillChart(vueInstance, vueInstance.fullData);
      } else if (vueInstance.currentFileLoading === station.shortFileName) {
          vueInstance.recentData = data;

          // vueInstance.useShortFile = true;
          vueInstance.fillChart(vueInstance, vueInstance.recentData);
      } else {
          // ShowError("Dataset for " + this.currentFileLoading + " is empty ");
          // console.log("Dataset for " + that.currentFileLoading + " is empty ");
          vueInstance.dataError = 'Dataset for " + that.currentFileLoading + " is empty ';
      }

      // vueInstance.currentFileLoading = ''
    },
    getFileNameFromURL(url) {
        var splits = url.split('/');
        let fileName = splits[splits.length - 1];

        if (fileName.includes('?')){
            fileName = fileName.split('?')[0];
        }

        return fileName;
    },
    enhanceStation(station){
      station.fileName = `${station.id}.csv`;
      station.shortFileName = `${station.id}_v.csv`;
    },
    fillChart(vueInstance, data){

        var delimiter = '\\s+';
        if (vueInstance.station.fileName.includes('.csv')){
            delimiter = ',';
        }

        var jsonData = null;
        // vueInstance.convertFilteToJsonData(data, delimiter, vueInstance.station.name, vueInstance.dateFormat);

        if (data !== undefined && data.length > 0){

            jsonData = vueInstance.createJSONDataset(data, delimiter, vueInstance.station, vueInstance.dateFormat);

            // dataset.data = cleanGOESDataset(roughData);
        } else {
            console.log("Not data for station " + vueInstance.station.name);
            return;
        }

        if (vueInstance.loadRecentData){
            vueInstance.recentDataJson = jsonData.records;
        } else {
            vueInstance.fullDataJson = jsonData.records;
        }        

        // console.log("ConvertFilteToJsonData " + useShortFile);

        vueInstance.showChartDataset(vueInstance);
    },
    showChartDataset(vueInstance) {
      const jsonRecords = vueInstance.loadRecentData ? vueInstance.recentDataJson : vueInstance.fullDataJson;

      try {
        let chart = createLineChart('chartdiv', vueInstance.dateFormat, jsonRecords, vueInstance.weatherGraphs, vueInstance.groupData);

        // chart.events.on('ready', () => {
        //   console.log('WeatherChart is ready');
        // });


        this.weatherChart = chart;
        
      } catch (error) {
        vueInstance.dataError = `Error creating the weather chart: ${error}`;
      }

      try {
        let chart = createLineChart('wchartdiv', vueInstance.dateFormat, jsonRecords, vueInstance.windGraphs, vueInstance.groupData);

        // chart.events.on('ready', () => {
        //   console.log('WindChart is ready');
        // });

        this.windChart = chart;
      } catch (error) {
        vueInstance.dataError = `Error creating the wind chart: ${error}`;
      }
    },
  },
  data: () => ({
    fullData: null,
    fullDataJson: null,
    recentData: null,
    recentDataJson: null,
    weatherChart: null,
    windChart: null,
    dateFormat: 'HH:mm DD/MM/YYYY',
    baseurl: 'https://www.wsl.ch/gcnet/data/',
    currentFileLoading: '',
    dataError: '',
    loadRecentData: true,
    loadRecentDataText: 'Load data from last 14 days',
    loadAllDataText: 'Load all data',
    theme: 'light',
    groupData: true,
    filePrefixes: ['temp', 'press', 'ws', 'wd', 'battvolt'],
    valueFieldMapping: {
      'temp': ['AirTC1', 'AirTC2'],
      'press': ['press'],
      'ws': ['WS1', 'WS2'],
    },    
    jsonFiles: {},
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

  }),
};
</script>

<style scoped>

</style>
