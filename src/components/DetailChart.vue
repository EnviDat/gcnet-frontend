<template>

  <v-card >
    <v-container fluid pa-3>
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

        <v-flex v-if="chartIsLoading && preloading"
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
                class="title"
                :style="`color: ${ $vuetify.theme.error };`" >
          {{ noDataText }}
        </v-flex>

        <v-flex v-if="dataError"
                class="title"
                :style="`color: ${ $vuetify.theme.error };`" >
          {{ dataError }}
        </v-flex>

        <v-flex v-if="!preloading" >
          <v-layout row wrap justify-center>
            <v-flex shrink>
              
              <base-rectangle-button buttonText="Load historical Chart"
                                      materialIconName="refresh"
                                      @clicked="preloading = true; intersected = true; chartIsLoading = true; loadChart();"
                                      iconColor="white" />
            </v-flex>
          </v-layout>
        </v-flex>


        <v-flex v-if="showDisclaimer && showChart"
                class="title" style="color: red;">
          {{ disclaimerText }}
        </v-flex>


        <v-flex v-show="showChart" >
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
import BaseRectangleButton from '@/components/BaseElements/BaseRectangleButton';
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
    valueFieldMapping: Object,
    preload: Boolean,
    showDisclaimer: Boolean,
  },
  components: {
    BaseRectangleButton,
  },
  mounted() {
    this.preloading = this.preload;

    if (this.preloading) {
      this.registeryIntersectionObserver();
    }
  },
  beforeDestroy() {
    // console.log('DetailChart: beforeDestroy method ' + this.chartId);
    this.clearChart();
  },
  computed: {
    hasData() {
      return this.dataAvailable;
    },
    showChart(){
      return this.intersected && !this.chartIsLoading && this.hasData;
    },
  },
  watch: {
    records() {
      if (this.records && this.records.length > 0){
        this.createChart();
      }
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
      this.$nextTick( () => {
        this.loadJsonFiles();
      });
    },
    loadJsonFiles(){
      axios
      .get(this.url)
      .then(response => {
        // createChart() gets called due to the watch on the records
        this.records = response.data;
        this.dataAvailable = response.data && response.data.length > 0;
        this.chartIsLoading = this.dataAvailable;
      })
      .catch(error => {
        this.chartIsLoading = false;
        this.dataError = `Error creating chart: ${error}`;
      })
    },
    createChart(){
      const dateFormatingInfos = {
        dateFormat: this.dateFormat,
        dateFormatNoTime: this.dateFormatNoTime,
        inputFormat: 'x',
      };
    
       try {
          this.detailChart = createLineChart(this.chartId, 'timestamp', this.records, this.graphs,
                                      !this.chartId.includes('_v'), undefined, undefined, dateFormatingInfos,
                                       undefined, this.fileObject.numberFormat, this.fileObject.dateFormatTime,
                                       this.chartDone, this.chartError);
      } catch (error) {
        this.chartIsLoading = false;
        this.dataError = `Error creating chart: ${error}`;
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
    registeryIntersectionObserver(){
      this.ISObserver = new IntersectionObserver(entries => {
        const entry = entries[0];
        if (entry.isIntersecting) {
          if (!this.intersected){
            this.intersected = true;
            this.loadChart();
          }
        }
      });

      this.ISObserver.observe(this.$el);
    },
    clearChart(){
      if (this.detailChart) {
        // console.log('dispose via DetailChart');
        this.detailChart.dispose();
        // console.log('delete via DetailChart');
        this.detailChart = null;
        // delete this.detailChart;
      }

      this.records = [];
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
      preloading: true,
      ISObserver: null,
      intersected: false,
      noDataText: 'No data available',
      disclaimerText: 'Please note: this data is averaged for visulisation purposes.',
      records: [],
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
