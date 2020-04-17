<template>

  <v-card >
    <v-container>
      <v-layout column>

        <v-flex pb-3>
          <v-layout row wrap justify-space-between>
            <v-flex shrink display-1>
              {{ this.fileObject.chartTitle }}
            </v-flex>
            <v-flex shrink class="title">
              {{ stationName }}
            </v-flex>
          </v-layout>            
        </v-flex>

        <v-flex v-if="chartIsLoading"
                class="chart"
                py-0 >
          <v-layout row wrap fill-height justify-center align-center>
            <v-flex shrink>
              <v-progress-circular :size="50"
                                    color="primary"
                                    indeterminate />
              
            </v-flex>
          </v-layout>
        </v-flex>

        <v-flex v-if="!chartIsLoading && !hasData"
              pt-2 pb-1
              class="display-1"
              :style="`color: ${ $vuetify.theme.error };`" >
          {{ noDataText }}
        </v-flex>

        <v-flex v-if="dataError"
                class="display-1"
                :style="`color: ${ $vuetify.theme.error };`" >
          {{ dataError }}
        </v-flex>

        <v-flex v-show="!chartIsLoading && hasData" >
          <div class='chart' :id="chartId" >
          </div>            
        </v-flex>

      </v-layout>
    </v-container>

  </v-card>

</template>

<script>
import axios from 'axios'
import { createLineChart } from "../chartData/charts";
import * as am4core from "@amcharts/amcharts4/core";
//import * as bullets from "@amcharts/amcharts4/plugins/bullets";

export default {
  name: 'DetailChart',
  props: {
    url: String,
    stationName: String,
    chartId: String,
    fileObject: Object,
    delay: {
      type: Number,
      default: 500,
    },
  },
  mounted() {
    var that = this;

    window.setTimeout(function() {
      that.visible = true;
      // console.log("delayed visible " + that.chartId + ' ' + that.visible);
      that.loadChart();
      
    }, that.delay);
    // console.log("visible " + that.chartId + ' ' + that.visible);
  },
  beforeDestroy() {
    this.clearChart();
  },
  computed: {
    hasData() {
      return this.dataAvailable;
    },
  },
  methods: {
    buildGraphs(){
      const graphs = [];
      const keys = Object.keys(this.valueFieldMapping);

      for (let i = 0; i < keys.length; i++) {
        const key = keys[i];

        if (this.url.includes(key)) {
          const graphInfo = this.valueFieldMapping[key];

          for (let j = 0; j < graphInfo.length; j++) {
            const infoObj = graphInfo[j];
            graphs.push(this.buildGraph(infoObj));
          }
        }
      }

      this.graphs = graphs;
    },
    buildGraph(infoObj){
      return {
        "lineColor": infoObj.color,
        "bullet": new am4core.Circle(),
        "bulletRadius": this.seriesSettings.bulletsRadius,
        "title": infoObj.titleString,
        "valueField": infoObj.parameter,
        "hideBulletsCount": 20,
      };
    },
    loadChart() {
      this.clearChart();
      this.chartIsLoading = true;
      this.dataAvailable = false;
      this.dataLength = 0;
      this.dataError = '';

      this.buildGraphs();

      // clear and then new loading on the next tick is needed for the disposing to finish
      const that = this;
      this.$nextTick( () => {
        that.loadJsonFiles();
      });
    },
    loadJsonFiles(){
      axios
      .get(this.url)
      .then(response => {
        // this.records = response.data;
        this.createChart(response.data);
      })
      .catch(error => {
        console.log('There was an error:' + error.response.statusText + ' url: ' + error.request.responseURL);
      })
    },
    createChart(records){
      const dateFormatingInfos = {
        dateFormat: this.dateFormat,
        dateFormatNoTime: this.dateFormatNoTime,
        inputFormat: 'x',
      };
    
       try {

        // if (!this.detailChart) {
          this.detailChart = createLineChart(this.chartId, 'timestamp', records, this.graphs,
                                      !this.chartId.includes('_v'), undefined, undefined, dateFormatingInfos,
                                       undefined, this.fileObject.numberFormat, this.fileObject.dateFormatTime,
                                       this.chartDone, this.chartError);
        // } else {
        //   this.detailChart.data = this.records;
        //   this.detailChart.invalidateRawData();
        // }

      } catch (error) {
        console.log(`Error creating the weather chart: ${error}`);
      }
    },
    chartError(error) {
      this.chartIsLoading = false;
      this.dataError = error.message;

      this.dataAvailable = false;
      this.dataLength = 0;
      this.clearChart();
    },
    chartDone(doneResponse) {
      this.chartIsLoading = false;
      const dataLength = doneResponse && doneResponse.target.data ? doneResponse.target.data.length : 0;
      
      this.dataAvailable = dataLength > 0;
      this.dataLength = dataLength;
      this.dataError = '';

      if (!this.dataAvailable){
        this.clearChart();
      }
    },
    clearChart(){
      if (this.detailChart) {
        this.detailChart.dispose();
        this.detailChart = null;
      }
    },
  },
  data()  {
    return {
      graphs: [],
      dateFormat: 'MMM dd, YYYY HH:mm UTC',
      dateFormatNoTime: 'MMM dd, YYYY',
      detailChart: null,
      visible: false,
      chartIsLoading: true,
      dataLength: 0,
      dataAvailable: false,
      dataError: '',
      noDataText: 'No data available',
      valueFieldMapping: {
        'temp': [
          {
              parameter: 'AirTC1',
              color: '#D26200',
              titleString: 'Thermocouple 1',
          },
          {
              parameter: 'AirTC2',
              color: '#0EAACD',
              titleString: 'Thermocouple 2',
          },
        ],
        'rh': [
            {   parameter: 'RH1',
                color: '#1DAFD7',
                titleString: 'Relative humidity 1',
            },
            {
                parameter: 'RH2',
                color: '#393DA3',
                titleString: 'Relative humidity 2',
            },
        ],
        'rad': [
            {
                parameter: 'NetRad',
                color: '#1C5197',
                titleString: 'Net radiation',
            },
            {
                parameter: 'SWin',
                color: '#E79F32',
                titleString: 'Short-wave incoming',
            },
            {
                parameter: 'SWout',
                color: '#9A6008',
                titleString: 'Short-wave outgoing',
            }
        ],
        'sheight': [
            {
                parameter: 'Sheight1',
                color: '#679DE2',
                titleString: 'Snow height 1',
            },
            {
                parameter: 'Sheight2',
                color: '#3375CD',
                titleString: 'Snow height 2',
            }
        ],
        'ws': [
          {   parameter: 'WS1',
              color: '#046401',
              titleString: 'Wind-speed 1',
          },
          {
              parameter: 'WS2',
              color: '#5ED352',
              titleString: 'Wind-speed 2',
          }
        ],
        'wd': [
            {
                parameter: 'WD1',
                color: '#046401',
                titleString: 'Wind-direction 1',
            },
            {
                parameter: 'WD2',
                color: '#2FCE32',
                titleString: 'Wind-direction 2',
            }
        ],
        'press': [
            {
                parameter: 'press',
                color: '#FF01FF',
                titleString: 'Atmospheric pressure',
            }
        ],
        'battvolt': [
          {
              parameter: 'BattVolt',
              color: '#27AE61',
              titleString: 'Battery voltage',
          }
        ],
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
    };
  },
}
</script>

<style>

    /**************  Responsive Web Design ****************/

    /*  Small to large handset */
    @media screen and (min-width: 480px) {
        .chart {
          height: 300px;
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


    /*.chart {*/
    /*    margin-bottom: 2em;*/
    /*    height: 450px;*/
    /*}*/

</style>
