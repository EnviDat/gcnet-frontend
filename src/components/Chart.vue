<template>

  <v-card >  

    <div v-if="currentFileLoading" >
      Loading {{ currentFileLoading }}
    </div>

    <h2>{{ station.name }}</h2>

    <div v-show="!currentFileLoading" ref="chartdiv" id="chartdiv"
          style="height: 600px;" >
    </div>    
      <!-- <v-container grid-list-md pa-0>
        <v-layout column >

          <v-flex xs5 py-0>
            <div class="hello" ref="chartdiv">
            </div>    
          </v-flex>

        </v-layout>
      </v-container> -->


    <v-card-actions class="ma-0 pa-2"
                    style="position: absolute; bottom: 0; right: 0;">

      <!-- <base-rectangle-button :buttonText="buttonText"
                            :isSmall="true"
                            v-on:clicked="buttonCallback"
                            /> -->

    </v-card-actions>
  </v-card>

</template>


<script>
import axios from 'axios';
import dateFns from 'date-fns';
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import {
  createSerialAMChartWeather,
  createSerialAMChartWind,
} from "@/chartData/charts";
import {
    createJSONDataset,
} from "@/chartData/data_conversion";


am4core.useTheme(am4themes_animated);

export default {
  props: {
    station: Object,
  },
  components: {
    BaseRectangleButton,
  },
  mounted() {
    this.createJSONDataset = createJSONDataset;

    // if (!station){
    //   return;
    // }

    this.enhanceStation(this.station);

    this.loadFileFromBackend(this.station, this.$refs.chartdiv, true);

  },
  beforeDestroy() {
    if (this.chart) {
      this.chart.dispose();
    }
  },
  computed: {

  },
  methods: {
    loadChartData(records) {
      var data = [];

      //var dataset = {header: [label1, label2], records:[] }
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
    loadFileFromBackend(station, selector, loadRecentData){

      const fileName = loadRecentData ? station.shortFileName : station.fileName;
      this.currentFileLoading = fileName;

      // add the timestamp to prevent server side caching
      const url = this.baseurl + fileName + '?t=' + Date.now();

      // let token = 'your auth token'
      let headers = {
        // 'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }

      const dataCall = axios.create({
        // baseURL: process.env.VUE_APP_API_URL,
        headers: headers
      })

      const that = this;

      dataCall.get(url)
      .then(function (response) {
        if (that.currentFileLoading === station.fileName) {
            that.fullData = response.data;

            that.loadChart(that, that.fullData, false);
        } else if (that.currentFileLoading === station.shortFileName) {
            that.recentData = response.data;

            that.loadChart(that, that.recentData, true);
        } else {
            // ShowError("Dataset for " + this.currentFileLoading + " is empty ");
            console.log("Dataset for " + that.currentFileLoading + " is empty ");
        }

        that.currentFileLoading = ''
      })
      .catch(function (error) {
        console.log("got error: " + error.message + ' ' + error.status);
      }); 
    },
    getFileNameFromURL(url) {
        var splits = url.split('/');
        fileName = splits[splits.length - 1];
        if (fileName.includes('?')){
            fileName = fileName.split('?')[0];
        }

        return fileName;
    },
    enhanceStation(station){
      station.fileName = `${station.id}.csv`;
      station.shortFileName = `${station.id}_v.csv`;
    },
    loadChart(vueInstance, data, useShortFile){

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
      // let chart = createSerialAMChartWeather(vueInstance.$refs.chartdiv);
      let chart = createSerialAMChartWeather('chartdiv', vueInstance.dateFormat, jsonRecords);
      // chart.data = jsonRecords;
      this.weatherChart = chart;

      // let chart = createSerialAMChartWind('chartdiv', vueInstance.dateFormat, jsonRecords);
      // chart.data = jsonRecords;
      // this.windChart = chart;
    },
  },
  data: () => ({
    fullData: null,
    fullDataJson: null,
    recentData: null,
    recentDataJson: null,
    weatherChart: null,
    windChart: null,
    dateFormat: 'MM/DD/YYYY HH:mm',
    baseurl: 'https://www.wsl.ch/gcnet/data/',
    currentFileLoading: '',
  }),
};
</script>

<style scoped>

</style>
