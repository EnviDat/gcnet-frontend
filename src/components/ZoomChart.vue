<template>

  <v-card>

<!--      <select @change="changeDataset($event)" v-model="selectedDataset">-->
<!--          <option value="" selected disabled>Choose Dataset</option>-->
<!--          <option value="set1">Historical Data</option>-->
<!--          <option value="set2">Recent Days</option>-->
<!--      </select>-->

<!--      <div v-if=false class='chart' :id="chartdivID" >-->
<!--    </div>-->


<!--       <div v-if=true class='chart' :id="chartdivID2" >-->
<!--    </div>-->

      <div v-if=zoomIn class='chart' :id="chartdivID2"></div>
      <div v-else class='chart' :id="chartdivID"></div>

  </v-card>

</template>

<script>

import axios from 'axios'
import { createLineChart } from "../chartData/charts";
import * as am4core from "@amcharts/amcharts4/core";


export default {
  props: {
   // url: String,
     url1: String,
     url2: String,
    chartdivID: String,
    chartdivID2: String,
    fileObject: Object,
  },
  data()  {
    return {
      graphs: [],
      dateFormat: 'MMM dd, YYYY HH:mm UTC',
      dateFormatNoTime: 'MMM dd, YYYY',
      records: [],
      records2: [],
      zoomIn: false,
      recordsObject: {
          'set1': [],
          'set2': [],
      },
      breakpoint: [],
      valueFieldMapping: {
      'temp': ['AirTC1', 'AirTC2'],
      'press': ['press'],
      'ws': ['WS1', 'WS2'],
      'battvolt': ['BattVolt'],
      'rad': ['NetRad', 'SWin', 'SWout'],
      'rh': ['RH1', 'RH2'],
      'sheight': ['Sheight1', 'Sheight2'],
      'wd': ['WD1', 'WD2'],
    },
      selectedDataset: '',
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
           if (this.url1.includes(key)) {
               const dataParameters = this.valueFieldMapping[key];
               for (let j = 0; j < dataParameters.length; j++) {
                   const param = dataParameters[j];
                   this.graphs.push(this.buildGraph(param));
               }
           }
       }

       // if (this.selectedDataset === 'set2') {
       //     axios
       //     .get(this.url1)
       //     .then(response => {
       //         this.records = response.data;
       //         this.loadChart();
       //     })
       //     .catch(error => {
       //         console.log('There was an error:' + error.response.statusText + ' url1: ' + error.request.responseURL);
       //     })
       // }

        axios
           .get(this.url1)
           .then(response => {
               this.records = response.data;
               this.loadChart();
           })
           .catch(error => {
               console.log('There was an error:' + error.response.statusText + ' url1: ' + error.request.responseURL);
           })


       // for (let i = 0; i < keys.length; i++) {
       //     const key = keys[i];
       //     if (this.url2.includes(key)) {
       //         const dataParameters = this.valueFieldMapping[key];
       //         for (let j = 0; j < dataParameters.length; j++) {
       //             const param = dataParameters[j];
       //             this.graphs.push(this.buildGraph(param));
       //         }
       //     }
       // }

        axios
           .get(this.url2)
           .then(response => {
               this.records2 = response.data;
               this.loadChart2();
           })
           .catch(error => {
               console.log('There was an error:' + error.response.statusText + ' url2: ' + error.request.responseURL);
           })


       //   axios
       //     .get(this.url2)
       //     .then(response => {
       //    //   this.records = response.data;
       //       this.recordsObject.set2 = response.data;
       //       this.loadChart();
       //     })
       //     .catch(error => {
       //       console.log('There was an error:' + error.response.statusText + ' url2: ' + error.request.responseURL);
       //     })
       //
       //
       //    axios
       //      .get(this.url1)
       //     .then(response => {
       //    //   this.records = response.data;
       //       this.recordsObject.set1 = response.data;
       //       this.loadChart();
       //     })
       //     .catch(error => {
       //       console.log('There was an error:' + error.response.statusText + ' url1: ' + error.request.responseURL);
       //     })
       // },

       // mounted() {
       //   const keys = Object.keys(this.valueFieldMapping);
       //   for (let i = 0; i < keys.length; i++) {
       //     const key = keys[i];
       //   //   // if (this.url1.includes(key)) {
       //   //
       //   //     // Check if currentURL is assigned to 'url1'
       //   //     if (this.url1.includes(key) && this.currentURL === 'url1') {
       //   //         const dataParameters = this.valueFieldMapping[key];
       //   //             for (let j = 0; j < dataParameters.length; j++) {
       //   //               const param = dataParameters[j];
       //   //               this.graphs.push(this.buildGraph(param));
       //   //             }
       //   //         axios
       //   //             .get(this.url1)
       //   //             .then(response => {
       //   //               this.records = response.data;
       //   //               this.loadChart();
       //   //             })
       //   //             .catch(error => {
       //   //               console.log('There was an error:' + error.response.statusText + ' url1: ' + error.request.responseURL);
       //   //             })
       //   //     }
       //   //
       //   //      // Check if currentURL is assigned to 'url2'
       //   //     else if (this.url2.includes(key) && this.currentURL === 'url2') {
       //   //         const dataParameters = this.valueFieldMapping[key];
       //   //             for (let j = 0; j < dataParameters.length; j++) {
       //   //               const param = dataParameters[j];
       //   //               this.graphs.push(this.buildGraph(param));
       //   //             }
       //   //         axios
       //   //             .get(this.url2)
       //   //             .then(response => {
       //   //               this.records = response.data;
       //   //              // console.log(this.records[0].timestamp);
       //   //               this.loadChart();
       //   //             })
       //   //             .catch(error => {
       //   //               console.log('There was an error:' + error.response.statusText + ' url2: ' + error.request.responseURL);
       //   //             })
       //   //     }
       //   //
       //   // }

       // axios
       //     .get(this.url1)
       //     .then(response => {
       //         this.records = response.data;
       //         this.loadChart();
       //     })
       //     .catch(error => {
       //         console.log('There was an error:' + error.response.statusText + ' url1: ' + error.request.responseURL);
       //     })
   },


  methods: {

    // changeDataset(event) {
    //       this.selectedDataset = event.target.value;
    //       console.log(this.selectedDataset);
    //       this.loadChart();
    //       return this.selectedDataset;
    //   },

    buildGraph(parameter){

      // Assign default lineColor
      let color = '#73C8A9';

      // Assign default titleString to data parameter (i.e. legend)
     let titleString = parameter;

      // Match lineColor for series to original GC-Net website chart colors and legend strings by evaluating parameter
      switch (parameter) {
         case 'AirTC1':
             color = '#1DAFD7';
             titleString = 'Thermocouple 1';
             break;
         case 'AirTC2':
             color = '#393DA3';
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
        "hideBulletsCount": 20,
      };
    },
    loadChart() {
      const dateFormatingInfos = {
        dateFormat: this.dateFormat,
        dateFormatNoTime: this.dateFormatNoTime,
        inputFormat: 'x',
      };

       try {

        if (!this.weatherChart) {
          this.weatherChart = createLineChart(this.chartdivID, 'timestamp', this.records, this.graphs,
                                      true, undefined, undefined, dateFormatingInfos,
                                       this.fileObject.chartTitle, this.fileObject.numberFormat,
                                       this.fileObject.dateFormatTime, this.records2);
        } else {
              this.weatherChart.data = this.records;
              this.weatherChart.invalidateRawData();
          // // Test
          // // if (this.currentURL === 'url1')  {
          // if (this.selectedDataset === 'set2')  {
          //     this.weatherChart.data = this.recordsObject.set2;
          //    // this.weatherChart.invalidateRawData();
          // }
          // else {
          //     this.weatherChart.data = this.recordsObject.set1;
          //  //   this.weatherChart.invalidateRawData();
          // }
          // this.weatherChart.invalidateRawData();
        }
      } catch (error) {
        console.log(`Error creating the weather chart: ${error}`);
      }

    },

    loadChart2() {
      const dateFormatingInfos = {
        dateFormat: this.dateFormat,
        dateFormatNoTime: this.dateFormatNoTime,
        inputFormat: 'x',
      };

       try {

        if (!this.weatherChart) {
          this.weatherChart = createLineChart(this.chartdivID2, 'timestamp', this.records2, this.graphs,
                                      true, undefined, undefined, dateFormatingInfos,
                                       this.fileObject.chartTitle, this.fileObject.numberFormat,
                                       this.fileObject.dateFormatTime, this.records2);
        } else {
              this.weatherChart.data = this.records;
              this.weatherChart.invalidateRawData();
          // // Test
          // // if (this.currentURL === 'url1')  {
          // if (this.selectedDataset === 'set2')  {
          //     this.weatherChart.data = this.recordsObject.set2;
          //    // this.weatherChart.invalidateRawData();
          // }
          // else {
          //     this.weatherChart.data = this.recordsObject.set1;
          //  //   this.weatherChart.invalidateRawData();
          // }
          // this.weatherChart.invalidateRawData();
        }
      } catch (error) {
        console.log(`Error creating the weather chart: ${error}`);
      }

    },

  },

}
</script>

<style>

    /**************  Responsive Web Design ****************/

    /*  Small to large handset */
    @media screen and (min-width: 480px) {
        .chart {
          height: 400px;
        }
    }

    /* Small to medium tablet */
    @media screen and (min-width: 700px) {
        .chart {
          height: 450px;
        }
    }

    /* Large tablet to laptop */
     @media screen and (min-width: 960px) {
         .chart {
            height: 450px;
        }
    }

     /* Desktop */
     @media screen and (min-width: 1264px) {
        .chart {
          height: 450px;
        }
    }


</style>
