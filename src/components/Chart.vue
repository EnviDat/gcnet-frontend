<template>

  <v-card >
    <v-card-title class="display-1">
      <v-layout row justify-space-around>
        <v-flex grow>
          {{ station.name }}
        </v-flex>
        <v-flex shrink>
          <base-rectangle-button :buttonText="loadAllDataText"
                                  :isSmall="true"
                                  :color="hasData && !loadRecentData ? 'green' : 'primary'"
                                  @clicked="loadRecentData = false; loadChart();" />
        </v-flex>
        <v-flex shrink>
          <base-rectangle-button :buttonText="loadRecentDataText"
                                  :isSmall="true"
                                  :color="hasData && loadRecentData ? 'green' : 'primary'"
                                  @clicked="loadRecentData = true; loadChart();" />
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
import dateFns from 'date-fns';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import {
  createSerialAMChartWeather,
  createSerialAMChartWind,
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
  },
  mounted() {
    this.createJSONDataset = createJSONDataset;

    this.enhanceStation(this.station);

    this.loadChart();
  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  computed: {
    hasData() {
      return !this.currentFileLoading && !this.dataError;
    },
  },
  methods: {
    loadChart(){
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

      const dataCall =  axios.create({
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

          vueInstance.fillChart(vueInstance, vueInstance.fullData, false);
      } else if (vueInstance.currentFileLoading === station.shortFileName) {
          vueInstance.recentData = data;

          vueInstance.fillChart(vueInstance, vueInstance.recentData, true);
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
    fillChart(vueInstance, data, useShortFile){

        var delimiter = '\\s+';
        if (vueInstance.station.fileName.includes('.csv')){
            delimiter = ',';
        }

        var jsonData = null;
        // vueInstance.convertFilteToJsonData(data, delimiter, vueInstance.station.name, vueInstance.dateFormat, dateFns);

        if (data !== undefined && data.length > 0){

            jsonData = vueInstance.createJSONDataset(data, delimiter, vueInstance.station, vueInstance.dateFormat, dateFns);

            // dataset.data = cleanGOESDataset(roughData);
        } else {
            console.log("Not data for station " + vueInstance.station.name);
            return;
        }

        if (useShortFile){
            vueInstance.recentDataJson = jsonData.records;
        } else {
            vueInstance.fullDataJson = jsonData.records;
        }        

        // console.log("ConvertFilteToJsonData " + useShortFile);

        vueInstance.showChartDataset(vueInstance, jsonData.records);
    },
    showChartDataset(vueInstance, jsonRecords) {
      try {
        let chart = createSerialAMChartWeather('chartdiv', vueInstance.dateFormat, jsonRecords, 0, this.theme);
        // chart.paddingTop = 25;
        chart.events.on('ready', () => {
          console.log('WindChart is ready');
        });


        this.weatherChart = chart;
        
      } catch (error) {
        vueInstance.dataError = `Error creating the weather chart: ${error}`;
      }

      // try {
      //   let chart = createSerialAMChartWind('wchartdiv', vueInstance.dateFormat, jsonRecords, 500, this.theme);
      //   this.windChart = chart;
      // } catch (error) {
      //   vueInstance.dataError = `Error creating the wind chart: ${error}`;
      // }
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
    filePrefixes: ['temp', 'press', 'rad', 'wd', 'battvolt'],
    jsonFiles: {},
  }),
};
</script>

<style scoped>

</style>
