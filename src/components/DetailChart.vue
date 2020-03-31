<template>

  <v-card>

     <div :id="chartdivID"
              style="height: 350px;" >
      <p>chartdiv0</p>
    </div>

  </v-card>

</template>

<script>
import axios from 'axios'
import {createLineChart} from "../chartData/charts";
import * as am4core from "@amcharts/amcharts4/core";
//import * as bullets from "@amcharts/amcharts4/plugins/bullets";

export default {
  props: {
    url: String,
    // Trying to create unique chart div ID
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
      'ws': ['WS1', 'WS2']
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
      //  this.loadChartDivs();
      })
      .catch(error => {
        console.log('There was an error:' + error.response.statusText + ' url: ' + error.request.responseURL);
      })
  },
  computed: {
    // TODO: replace with ChartID
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
      // }, {
      //   "lineColor": "#00F4FF",
      //   "bullet": new am4core.Triangle(),
      //   "bulletRadius": this.seriesSettings.bulletsRadius * 2,
      //   "title": "Air Temperature-TC Air 1",
      //   "valueField": "tc_air_1",
      //   "hideBulletsCount": 0
      // }, {
      //   "lineColor": "#AAAAE5",
      //   "bullet": new bullets.Star(),
      //   "bulletRadius": this.seriesSettings.bulletsRadius * 2,
      //   "title": "Air Temperature-TC Air 2",
      //   "valueField": "tc_air_2",
      //   "hideBulletsCount": 0
      }];
    },
  },


  methods: {
    buildGraph(parameter){
      // add a count parameter to swap the color
      let color = "#73C8A9";

      return {
        "lineColor": color,
        "bullet": new am4core.Circle(),
        "bulletRadius": this.seriesSettings.bulletsRadius,
        "title": parameter,
        "valueField": parameter,
        "hideBulletsCount": 0
      };
    },
    loadChart() {
       try {
        let chart = createLineChart(this.chartdivID, this.dateFormat, this.records, this.graphs, false);

        // chart.events.on('ready', () => {
        //   console.log('WeatherChrt is ready');
        // });


        this.weatherChart = chart;

      } catch (error) {
        console.log(`Error creating the weather chart: ${error}`);
      }

    },

    // Function to load charts into multiple divs
    loadChartDivs() {
       try {
        let fileCount = this.fileNames.length
        for (let i = 0; i < fileCount; i++) {
          let assignedDiv = this.chartdivID
          let chart = createLineChart(assignedDiv, this.dateFormat, this.records, this.graphs, false);
          // let assignedDiv = 'chartdiv' + i;
          // let chart = createLineChart(assignedDiv, this.dateFormat, this.records, this.graphs, false);
          this.weatherChart = chart;
        }


        // chart.events.on('ready', () => {
        //   console.log('WeatherChrt is ready');
        // });




      } catch (error) {
        console.log(`Error creating the weather chart: ${error}`);
      }

    }
  },

}
</script>

