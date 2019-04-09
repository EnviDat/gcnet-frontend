<template>

  <v-card >  

    <div v-if="currentFileLoading" >
      Loading {{ currentFileLoading }}
    </div>

    <div v-if="!currentFileLoading" ref="chartdiv">
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
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import am4themes_animated from "@amcharts/amcharts4/themes/animated";
import { createSerialAMChartWeather } from "@/chartData/charts";

am4core.useTheme(am4themes_animated);

export default {
  props: {
    station: Object,
  },
  components: {
    // BaseRectangleButton,
  },
  mounted() {

    // if (!station){
    //   return;
    // }

    this.enhanceStation(this.station);

    this.loadFileFromBackend(this.station, this.$refs.chartdiv, true);

    // let chart = am4core.create(this.$refs.chartdiv, am4charts.XYChart);
    let chart = createSerialAMChartWeather(this.$refs.chartdiv);

    chart.paddingRight = 20;

    let data = [];
    let visits = 10;
    for (let i = 1; i < 366; i++) {
      visits += Math.round((Math.random() < 0.5 ? 1 : -1) * Math.random() * 10);
      data.push({ date: new Date(2018, 0, i), name: "name" + i, value: visits });
    }

    chart.data = data;

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.renderer.grid.template.location = 0;

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.tooltip.disabled = true;
    valueAxis.renderer.minWidth = 35;

    let series = chart.series.push(new am4charts.LineSeries());
    series.dataFields.dateX = "date";
    series.dataFields.valueY = "value";

    series.tooltipText = "{valueY.value}";
    chart.cursor = new am4charts.XYCursor();

    let scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

    this.chart = chart;
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

      // var dSet = GetDataSet(fileName);
      // var stationId = '#station_' + StationId(dSet);

      // if(selector){
      //     $(stationId + ' > div > ' + selector + ' > i').show();
      // }

      // let token = 'your auth token'
      let headers = {
        // 'Authorization': `Bearer ${token}`,
        'Cache-Control': 'no-cache'
      }

      const dataCall = axios.create({
        // baseURL: process.env.VUE_APP_API_URL,
        headers: headers
      })

      dataCall.get(url)
      .then(function (response) {

        // var theFileName = this.getFileNameFromURL(response.request.responseURL);

        // dSet = GetDataSet(fileName)

        // if (dSet !== undefined){
            
            if (this.currentFileLoading === station.fileName) {
                this.fullData = response.data;
            } else if (this.currentFileLoading === station.shortFileName) {
                this.recentData = response.data;
            } else {
                // ShowError("Dataset for " + this.currentFileLoading + " is empty ");
                console.log("Dataset for " + this.currentFileLoading + " is empty ");
            }

            this.currentFileLoading = ''
        // } else {
        //     ShowError("Couldn't load Dataset definition for " + theFileName + " response " + response);
        // }

        // var rawFileUrl = baseurl + dSet.fileName + '?t=' + Date.now();
        // $(stationId + ' > div').find('#station_raw_link').attr('href', rawFileUrl);
        // var rawFileUrl14 = baseurl + dSet.shortFileName + '?t=' + Date.now();
        // $(stationId + ' > div').find('#station_raw_link_14').attr('href', rawFileUrl14);

        // if(selector){
        //     $(stationId + ' > div > ' + selector + ' > i').hide();
        // }

        // filesLoaded++;
        // progress.animate(filesLoaded / filesToLoad);
      })
      .catch(function (error) {

        // console.log("got error " + JSON.stringify(error) + " error: " + error.message + ' ' + error.response);
        console.log("got error: " + error.message + ' ' + error.status);

        // var status = "unknown";
        // var fileName = "";
        // var station = "";

        // if (error.request){

        //     status = error.request.status;
        //     fileName = this.getFileNameFromURL(error.request.responseURL);

        //     if (fileName){                
        //         var dSet = GetDataSet(fileName);
        //         if (dSet){
        //             station = dSet.fileName;
        //         }
        //     }
        // }

        // ShowError('Error while loading station ' + station + ' file ' + fileName + '</h3><div>Error: ' + error.message + ' status: ' + status);

        // if(selector){
        //     $(selector + ' > i').hide();
        // }

        // filesLoaded++;
        // progress.animate(filesLoaded / filesToLoad);                
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
    loadChart(dataset, append, useShortFile){

        var delimiter = '\\s+';
        if (dataset.fileName.includes('.csv')){
            delimiter = ',';
        }

        var jsonData = null;

        if (useShortFile){
            jsonData = this.convertFilteToJsonData(dataset.data, delimiter, dataset.name);
            dataset.dataRecords = jsonData.records;
        } else {
            jsonData = this.convertFilteToJsonData(dataset.filedata, delimiter, dataset.name);
            dataset.filedataRecords = jsonData.records;
        }        

        // console.log("ConvertFilteToJsonData " + useShortFile);

        ShowChartdataset(dataset, append, useShortFile);
    },
    convertFilteToJsonData(data, delimiter, station){

        if (data !== undefined && data.length > 0){

            return createJSONDataset(data, delimiter, station, this.dateFormat);

            // dataset.data = cleanGOESDataset(roughData);
        } else {
            console.log("Not data for station " + station);
        }

        return null;
    },
  },
  data: () => ({
    fullData: null,
    recentData: null,
    dateFormat: 'MM/DD/YYYY HH:mm',
    baseurl: 'https://www.wsl.ch/gcnet/data/',
    currentFileLoading: '',
  }),
};
</script>

<style scoped>

</style>
