<template>

  <v-card>

     <div class='chart' :id="chartdivID">
    </div>

  </v-card>

</template>

<script>
import axios from 'axios'
import { createLineChart } from "../chartData/charts";
import * as am4core from "@amcharts/amcharts4/core";
//import * as bullets from "@amcharts/amcharts4/plugins/bullets";

export default {
  props: {
    url: String,
    chartdivID: String,
  },
  data()  {
    return {
      graphs: [],
      dateFormat: 'HH:mm DD/MM/YYYY',
      records: [],
      valueFieldMapping: {
      'temp': ['AirTC1', 'AirTC2'],
      'press': ['press'],
      'ws': ['WS1', 'WS2'],
      'battvolt': ['Battvolt'],
      'rad': ['NetRad', 'SWin', 'SWout'],
      'rh': ['RH1', 'RH2'],
      'sheight': ['Sheight1', 'Sheight2'],
      'wd': ['WD1', 'WD2'],


    },
      seriesSettings: {
      // lineStrokeWidth: 3,
      // lineOpacity: 1,
      // // the auto gap depends on the baseInterval, which might be "hours"
      // // works if the lineConnect is false
      // lineAutoGap: 2,
      // lineConnect: false,
      // bulletsStrokeWidth: 2,
      bulletsRadius: 3,
      // bulletFill: 'black',
      // bulletsfillOpacity: 1,
      // bulletsStrokeOpacity: 1,
    },
    }
  },
  mounted() {
      const keys = Object.keys(this.valueFieldMapping);
      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (this.url.includes(key)) {
          const dataParameters = this.valueFieldMapping[key];
          for (let j = 0; j < dataParameters.length; j++) {
            const param = dataParameters[j];
            this.graphs.push(this.buildGraph(param));
          }
        }

      }

    axios
      .get(this.url)
      .then(response => {
        this.records = response.data;
        this.loadChart();
      })
      .catch(error => {
        console.log('There was an error:' + error.response.statusText + ' url: ' + error.request.responseURL);
      })
  },
  computed: {
    // windChartId(){
    //   return `${this.stationId}_wind`;
    // },
    weatherGraphs() {
      return [{
        "lineColor": "#F39D01",
        "bullet": new am4core.Circle(),
        "bulletRadius": this.seriesSettings.bulletsRadius,
        "title": "Air Temperature 1",
        "valueField": "AirT1",
        "hideBulletsCount": 0
      }, {
        "lineColor": "#B0DE09",
        "bullet": new am4core.Rectangle(),
        "bulletRadius": this.seriesSettings.bulletsRadius * 2,
        "title": "Air Temperature 2",
        "valueField": "AirT2",
        "hideBulletsCount": 0
      }];
    },
  },


  methods: {
    buildGraph(parameter){

      // Assign default lineColor
      let color = '#73C8A9';

      // Assign default titleString to data parameter (i.e. legend)
      let titleString = parameter;

      // Match lineColor for series to original GC-Net website chart colors and legend strings by evaluating parameter
      switch (parameter) {
         case 'AirTC1':
             color = '#0EAACD';
             titleString = 'Thermocouple 1';
             break;
         case 'AirTC2':
             color = '#D26200';
             titleString = 'Thermocouple 2';
             break;
         case 'RH1':
             color = '#1DAFD7';
             titleString = 'Relative humidity 1';
             break;
         case 'RH2':
             color = '#393DA3';
             titleString = 'Relative humidity 2';
             break;
         case 'NetRad':
             color = '#1C5197';
             titleString = 'Net radiation';
             break;
         case 'SWin':
             color = '#E79F32';
             titleString = 'Short-wave incoming';
             break;
         case 'SWout':
             color = '#9A6008';
             titleString = 'Short-wave outgoing';
             break;
         case 'Sheight1':
             color = '#679DE2';
             titleString = 'Snow height 1';
             break;
         case 'Sheight2':
             color = '#3375CD';
             titleString = 'Snow height 2';
             break;
         case 'WS1':
             color = '#046401';
             titleString = 'Wind-speed 1';
             break;
         case 'WS2':
             color = '#5ED352';
             titleString = 'Wind-speed 2';
             break;
         case 'WD1':
             color = '#046401';
             titleString = 'Wind-direction 1';
             break;
         case 'WD2':
             color = '#2FCE32';
             titleString = 'Wind-direction 2';
             break;
         case 'press':
             color = '#FF01FF';
             titleString = 'Atmospheric pressure';
             break;
         case 'Battvolt':
             color = '#27AE61';
             titleString = 'Battery voltage';
             break;
         default:
             color = '#73C8A9';
             titleString = parameter;
      }

      return {
        "lineColor": color,
        "bullet": new am4core.Circle(),
        "bulletRadius": this.seriesSettings.bulletsRadius,
        "title": titleString,
        "valueField": parameter,
        "hideBulletsCount": 10
      };
    },
    loadChart() {
      const dateFormatingInfos = {
        dateFormat: this.dateFormat,
        inputFormat: 'x',
      };
    
       try {

        if (!this.weatherChart) {
          this.weatherChart = createLineChart(this.chartdivID, 'timestamp', this.records, this.graphs,
                                      true, undefined, undefined, dateFormatingInfos);
        } else {
          this.weatherChart.data = this.records;
          this.weatherChart.invalidateRawData();
        }
      } catch (error) {
        console.log(`Error creating the weather chart: ${error}`);
      }

    },

  },

}
</script>

<style>

    .chart {
        margin-bottom: 2em;
        height: 350px;
    }

</style>
