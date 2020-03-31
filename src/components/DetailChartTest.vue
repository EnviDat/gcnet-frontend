<template>

  <div>

    <div id="chartdiv1"
              style="height: 350px;" >
             <p>test text</p>
    </div>

<!--     <div id="chartdiv0"-->
<!--              style="height: 350px;" >-->
<!--             <p>chartdiv0</p>-->
<!--    </div>-->

<!--      <div id="chartdiv1"-->
<!--              style="height: 350px;" >-->
<!--             <p>chartdiv1</p>-->
<!--    </div>-->

  </div>
</template>

<script>
import axios from 'axios'
import {createLineChart} from "../chartData/charts";
import * as am4core from "@amcharts/amcharts4/core";
//import * as bullets from "@amcharts/amcharts4/plugins/bullets";

export default {
  props: {
    url: String,
    // Trying to create unique chartdivID
    //chartdivID: Number,
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
  created() {
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
     //   this.loadChartDivs();
      })
      .catch(error => {
        console.log('There was an error:' + error.response)
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
      return {
        "lineColor": "#73C8A9",
        "bullet": new am4core.Circle(),
        "bulletRadius": this.seriesSettings.bulletsRadius,
        "title": parameter,
        "valueField": parameter,
        "hideBulletsCount": 20
      };
    },
    loadChart() {
       try {
        let chart = createLineChart('chartdiv1', this.dateFormat, this.records, this.graphs, false);

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
          let assignedDiv = 'chartdiv' + i;
          let chart = createLineChart(assignedDiv, this.dateFormat, this.records, this.graphs, false);
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

