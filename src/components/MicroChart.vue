/* eslint-disable consistent-return */
<template>

  <!-- <v-fade-transition> -->
  <v-card :id="stationId"
          ref="main_container"
          class="pa-1"
          v-show="visible" >

    <v-container fluid
                  pa-0>

      <v-layout row wrap>
        <v-flex xs3
                pa-0 >
          <img :style="`${ showInfo ? '' : 'height: 100%;'} cursor: pointer;`"
                @click="catchDetailClick(station.alias)"
                :alt="image"
                :src="image" />
        </v-flex>

        <v-flex xs9
                py-3
                pr-3
                style="background-color: white; ">
          <v-layout column justify-space-between fill-height>
            <v-flex pt-0>
              <v-layout row justify-space-between>

                <v-flex grow style="font-weight: 700;">
                  {{ station.name }}
                </v-flex>

                <v-flex shrink>
                  <base-status-icon icon="access_time"
                                    :color="allIconColor" />
                </v-flex>

                <v-flex shrink>
                  <base-status-icon icon="av_timer"
                                    :color="recentIconColor"/>
                </v-flex>

                </v-layout>
            </v-flex>

            <v-flex v-if="chartIsLoading"
                    xs12 py-0
                    style="width: 100%">
              <div class='skeleton skeleton-animation-shimmer' :style="`height: ${chartHeight};`" >
                <div style="width: 100%;" class='bone bone-type-image'></div>
              </div>
            </v-flex>

            <v-flex v-if="!chartIsLoading && !hasData()"
                  xs12 py-1
                  class="body-1"
                  :style="`color: red;`" >
              {{ noDataText }}
            </v-flex>

            <v-flex v-if="dataError"
                    xs12
                    class="smallText"
                    :style="`color: red;`" >
              {{ dataError }}
            </v-flex>

            <v-flex xs12 py-0 px-0 mx-1
                    :id="microChartId"
                    ref="microChart"
                    :style="`background-color: #f5f5f5; width: 100%; height: ${chartHeight}; border: 1px solid #eee;`" >
            </v-flex>

            <v-flex v-if="!dataError && hasData()"
                    xs12 py-0
                    class="smallText">
              {{ chartSubText }}
            </v-flex>

            <v-flex xs12 
                    pt-2>
              <v-layout row align-center justify-space-between >
                <v-flex shrink>
                  <v-layout row>
                    <v-flex shrink>
                      <base-status-icon-button :icon="showInfo ? 'keyboard_arrow_up' : 'keyboard_arrow_down'"
                                                color="primary"
                                                :outline="true"
                                                @click="showInfo = !showInfo;" />          
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex shrink>
                  <v-layout row>
                    <v-flex shrink
                            px-0
                            class="caption">
                      Station Details
                    </v-flex>

                    <v-flex shrink>
                      <base-status-icon-button icon="search"
                                                color="secondary"
                                                @click="catchDetailClick(station.alias)" />
                    </v-flex>
                  </v-layout>
                </v-flex>
              </v-layout>
            </v-flex>

            <v-flex v-if="showInfo"
                    xs12>
              <v-layout column>
                <v-flex >
                  <v-divider></v-divider>
                </v-flex>

                <v-flex >
                  <v-layout row wrap
                            justify-space-between align-center>
                    <v-flex grow
                            class="body-1">
                      {{ 'All Data' }}
                    </v-flex>

                    <v-flex shrink>
                      <base-status-icon icon="access_time"
                                        :color="allIconColor" />
                    </v-flex>

                    <v-flex shrink
                            class="smallText">
                      <div :style="`background-color: ${ $vuetify.theme.accent };`"
                            class="py-0 px-1">
                        {{ allDataLength }}
                      </div>

                    </v-flex>

                    <v-flex shrink>
                      <base-status-icon-button icon="refresh"
                                                color="secondary"
                                                @click="loadRecentData = false; loadChart(false);" />
                    </v-flex>
                  </v-layout>
                </v-flex>

                <v-flex grow
                        class="smallText">
                  {{ allDataUrl }}
                </v-flex>

                <v-flex >
                  <v-divider></v-divider>
                </v-flex>

                <v-flex >
                  <v-layout row justify-space-between align-center>
                    <v-flex grow
                            class="body-1">
                      Recent Data
                    </v-flex>

                    <v-flex shrink>
                      <base-status-icon icon="av_timer"
                                        :color="recentIconColor"/>
                    </v-flex>

                    <v-flex shrink
                            class="smallText">
                      <div :style="`background-color: ${ $vuetify.theme.accent };`"
                            class="py-0 px-1">
                        {{ recentDataLength }}
                      </div>
                    </v-flex>

                    <v-flex shrink>
                      <base-status-icon-button icon="refresh"
                                                color="secondary"
                                                @click="loadRecentData = true; loadChart(false);" />
                    </v-flex>
                  </v-layout>
                </v-flex>
          
                <v-flex grow
                        class="smallText">
                  {{ recentDataUrl }}
                </v-flex>

              </v-layout>
            </v-flex>

          </v-layout>
        </v-flex>
      </v-layout>

    </v-container>
  </v-card>
  <!-- </v-fade-transition> -->

</template>

<script>
import axios from 'axios';
import uPlot from 'uplot/dist/uPlot.esm';
import 'uplot/dist/uPlot.min.css';
import BaseStatusIcon from '@/components/BaseElements/BaseStatusIcon';
import BaseStatusIconButton from '@/components/BaseElements/BaseStatusIconButton';

export default {
  name: 'MicroChart',
  props: {
    station: Object,
    image: String,
    JSONUrls: {
      type: Object,
      default: () => ({
        dataURLs: [{ fileType: 'temp', url: './testdata/0temp.json' }],
        recentDataURLs: [{ fileType: 'temp', url: './testdata/0temp_v.json' }],
      }),
    },
    fileValueMapping: {
      type: Object,
      default: () => ({
        temp: ['airtemp1', 'airtemp2'],
        press: ['pressure'],
        wd: ['winddir1', 'winddir2'],
        ws: ['windspeed1', 'windspeed2'],
        battvolt: ['battvolt'],
      }),
    },
    delay: {
      type: Number,
      default: 500,
    },
  },
  components: {
    BaseStatusIcon,
    BaseStatusIconButton,
  },
  mounted() {
    let that = this;

    setTimeout(() => {
      that.visible = true;
      // console.log("visible " + that.station.name + ' ' + that.visible);
      if (that.$refs && that.$refs.main_container) {
        that.loadChart();
      }
      that = null;
    }, this.delay);
    // console.log("visible " + that.station.name + ' ' + that.visible);
  },
  beforeDestroy() {
    // console.log('MicroChart: beforeDestroy method ' + this.microChartId);
    this.clearChart();
  },
  computed: {
    microChartId() {
      return `${this.stationId}_microChart`;
    },
    stationId() {
      return `${this.station.id}_${this.station.alias ? this.station.alias : this.station.name}`;
    },
    recentIconColor() {
      return this.recentCheckedOnce ? this.recentDataAvailable ? this.$vuetify.theme.success : this.$vuetify.theme.error : 'transparent';
    },
    allIconColor() {
      return this.allCheckedOnce ? this.alldataAvailable ? this.$vuetify.theme.success : this.$vuetify.theme.error : 'transparent';
    },
    chartSubText() {
      return `${this.chartIsLoading ? 'Loading' : 'Showing'} ${this.graphs && this.graphs[0] ? this.graphs[0].title : ''} of ${this.loadRecentData ? 'recent data' : 'all data'} 
              from ${new Date(this.minDate).toLocaleDateString('en-US')} to ${new Date(this.maxDate).toLocaleDateString('en-US')}`;
    },
  },
  methods: {
    hasData() {
      // return this.recentDataLength > 0 || this.allDataLength > 0;
      if (this.fallback) {
        return this.recentDataAvailable || this.alldataAvailable;
      }

      return (this.loadRecentData && this.recentDataAvailable)
          || (!this.loadRecentData && this.alldataAvailable);
    },
    loadChart(fallback = true) {
      this.clearChart();

      this.fallback = fallback;
      this.chartIsLoading = true;

      this.urlValueMapping = this.getUrlValueMapping(this.loadRecentData);

      this.buildGraphs();

      // clear and then new loading on the next tick is needed for the disposing to finish
      this.$nextTick(() => {
        // this.loadJsonCharts();
        this.loadJsonFiles();
      });
    },
    getUrlValueMapping(loadRecentData) {
      const urlValueMapping = {};
      const keys = Object.keys(this.fileValueMapping);

      for (let i = 0; i < keys.length; i++) {
        const prefix = keys[i];

        const url = this.getUrlToPrefix(prefix, loadRecentData);
        
        if (url) {
          urlValueMapping[url] = this.fileValueMapping[prefix];
        }
      }

      return urlValueMapping;
    },
    getUrlToPrefix(prefix, loadRecentData) {
      const urlObjs = loadRecentData ? this.JSONUrls.recentDataURLs : this.JSONUrls.dataURLs;

      for (let i = 0; i < urlObjs.length; i++) {
        const obj = urlObjs[i];
        
        if (prefix === obj.fileType) {
          return obj.url;
        }
      }

      return null;
    },
    buildGraphs() {
      this.colorCount = 0;
      const keys = Object.keys(this.urlValueMapping);
      const graphs = [];

      for (let i = 0; i < keys.length; i++) {
        const url = keys[i];
        const dataParameters = this.urlValueMapping[url];

        for (let j = 0; j < dataParameters.length; j++) {
          const param = dataParameters[j];

          const lineColor = this.colorPalette[this.colorCount];
          this.colorCount++;

          graphs.push({
            lineColor,
            title: param,
            valueField: param,
            dataUrl: url,
          });
        }
      }

      this.graphs = graphs;
    },
    clearChart() {
      // if (this.microChart) {
      //   this.microChart.dispose();
      //   console.log('dispose via MicroChart ' + this.microChartId + ' isDisposed() ' + this.microChart.isDisposed());
      //   // console.log('delete via MicroChart');
      //   this.microChart = null;
      //   // delete this.microChart;
      // }
      if (this.$refs.microChart) {

        const childs = this.$refs.microChart.children;

        if (childs) {
          for (let i = 0; i < childs.length; i++) {
            const child = childs[i];
            this.$refs.microChart.removeChild(child);
          }
        }
      }
    },
    loadJsonFiles() {
      this.chartIsLoading = true;
      const currentDataUrl = this.graphs[0].dataUrl;

      this.loadRecentData ? this.recentDataUrl = currentDataUrl : this.allDataUrl = currentDataUrl;
      this.loadRecentData ? this.recentDataLength = 0 : this.allDataLength = 0;

      axios
      .get(currentDataUrl)
      .then((response) => {
        this.makeSparkChart(response.data);
      })
      .catch((error) => {
        this.chartError(error);
      });
    },
    makeSparkChart(data) {
      this.chartIsLoading = false;

      const parameter = 'airtemp1';
      const fallbackParameter = 'airtemp2';

      const x = [];
      let y = [];
      const dataLength = data ? data.length : 0;

      if (dataLength > 0) {

        let useFallback = true;

        for (let i = 0; i < data.length; i++) {
          const entry = data[i];
          const param = entry[parameter];
          
          if (useFallback && param) {
            useFallback = false;
          }
          
          x.push(entry.timestamp);
          y.push(param);
        }

        if (useFallback) {
          y = [];
          this.graphs[0].title = parameter;

          for (let i = 0; i < data.length; i++) {
            const entry = data[i];            
            y.push(entry[fallbackParameter]);
          }
        }

        this.makeSpark([x, y]);

        this.minDate = data[0].timestamp;
        this.maxDate = data[data.length - 1].timestamp;
      }

      this.loadRecentData ? this.recentCheckedOnce = true : this.allCheckedOnce = true;

      if (dataLength > 0) {
        if (this.loadRecentData) {
          this.recentDataAvailable = true;
          this.recentDataLength = dataLength;
        } else {
          this.alldataAvailable = true;
          this.allDataLength = dataLength;
        }
      } else if (this.loadRecentData) {
          this.recentDataAvailable = false;

          if (this.fallback) {
            this.loadRecentData = false;
            
            this.$nextTick(() => {
              this.loadChart();
            });
          } else {
            this.clearChart();
          }
        } else {
          this.alldataAvailable = false;
          this.clearChart();
        }
    },
    makeSpark(data) {
      this.sparkLineOptions.width = this.$refs.microChart.clientWidth;
      this.sparkLineOptions.height = this.chartHeight;
      this.sparkLineOptions.plugins = [this.tooltipsPlugin()];

      // eslint-disable-next-line new-cap
      const sparkChart = new uPlot(this.sparkLineOptions, data, this.$refs.microChart);

      return sparkChart;
    },
    /* eslint-disable no-unused-vars */
    tooltipsPlugin(opts) {
      // eslint-disable-next-line no-shadow
      function init(u, opts, data) {
        const plot = u.root.querySelector('.u-over');

        // eslint-disable-next-line no-multi-assign
        const ttc = u.cursortt = document.createElement('div');
        ttc.className = 'tooltip';
        ttc.textContent = '(x,y)';
        ttc.style.pointerEvents = 'none';
        ttc.style.position = 'absolute';
        ttc.style.background = 'rgba(0,0,255,0.1)';
        // plot.appendChild(ttc);

        u.seriestt = opts.series.map((s, i) => {
          if (i === 0) return;

          const tt = document.createElement('div');
          tt.className = 'tooltip';
          tt.textContent = 'Tooltip!';
          tt.style.pointerEvents = 'none';
          tt.style.position = 'absolute';
          tt.style.background = 'rgba(0,0,0,0.1)';
          tt.style.color = s.color;
          tt.style.display = s.show ? null : 'none';
          plot.appendChild(tt);
          // eslint-disable-next-line consistent-return
          return tt;
        });

        function hideTips() {
          // ttc.style.display = "none";
          u.seriestt.forEach((tt, i) => {
            if (i === 0) return;

            tt.style.display = 'none';
          });
        }

        function showTips() {
          // ttc.style.display = null;
          u.seriestt.forEach((tt, i) => {
            if (i === 0) return;

            const s = u.series[i];
            tt.style.display = s.show ? null : 'none';
          });
        }

        plot.addEventListener('mouseleave', () => {
          if (!u.cursor.locked) {
            // u.setCursor({ left: -10, top: -10 });
            hideTips();
          }
        });

        plot.addEventListener('mouseenter', () => {
          showTips();
        });

        hideTips();
      }

      function setCursor(u) {
        const { left, top, idx } = u.cursor;

        // this is here to handle if initial cursor position is set
        // not great (can be optimized by doing more enter/leave state transition tracking)
      // if (left > 0)
      //  u.cursortt.style.display = null;

        // u.cursortt.style.left = left + "px";
        // u.cursortt.style.top = top + "px";
        // u.cursortt.textContent = "(" + u.posToVal(left, "x").toFixed(2) + ", " + u.posToVal(top, "y").toFixed(2) + ")";
        u.cursortt.textContent = `(${u.posToVal(top, 'y').toFixed(2)})`;

        // can optimize further by not applying styles if idx did not change
        u.seriestt.forEach((tt, i) => {
          if (i === 0) return;

          const s = u.series[i];

          if (s.show) {
            // this is here to handle if initial cursor position is set
            // not great (can be optimized by doing more enter/leave state transition tracking)
            // if (left > 0)
            // tt.style.display = null;

            // let xVal = u.data[0][idx];
            const yVal = u.data[i][idx];

            tt.textContent = `(${yVal})`;

            // tt.style.left = Math.round(u.valToPos(xVal, 'x')) + "px";
            // tt.style.top = Math.round(u.valToPos(yVal, 'y')) + "px";
          }
        });
      }

      return {
        hooks: {
          init,
          setCursor,
          setScale: [
            (u, key) => {
              // console.log('setScale', key);
            },
          ],
          setSeries: [
            (u, idx) => {
              // console.log('setSeries', idx);
            },
          ],
        },
      };
    },
    chartError(error) {
      this.chartIsLoading = false;
      this.dataError = error.message;

      this.loadRecentData ? this.recentCheckedOnce = true : this.allCheckedOnce = true;

      if (this.loadRecentData) {
        this.recentDataAvailable = false;

        if (this.fallback) {
          this.loadRecentData = false;

          this.$nextTick(() => {
            this.loadChart();
          });
        } else {
          this.clearChart();
        }
      } else {
        this.alldataAvailable = false;
        this.clearChart();
        if (this.$refs.microChart) {
          this.$refs.microChart.style.display = 'none';
        }
      }
    },
    catchDetailClick(stationId) {
      this.$emit('detailClick', stationId);
    },
  },
  data: () => ({
    microChart: null,
    chartHeight: 50,
    dateFormat: 'HH:mm DD/MM/YYYY',
    dataError: '',
    noDataText: 'No data available',
    loadRecentData: true,
    recentCheckedOnce: false,
    recentDataAvailable: false,
    recentDataLength: 0,
    recentDataUrl: '',
    allCheckedOnce: false,
    alldataAvailable: false,
    allDataLength: 0,
    allDataUrl: '',
    chartIsLoading: true,
    showInfo: false,
    minDate: null,
    maxDate: null,
    graphs: [],
    seriesSettings: {
      lineStrokeWidth: 2,
      lineColor: '#8ACDCE',
    },    
    urlValueMapping: {},
    sparkLineOptions: {
      class: 'spark',
      background: 'black',
      cursor: {
        show: true,
        y: false,
        drag: { setScale: false },
      },
      select: {
        show: false,
      },
      legend: {
        show: false,
      },
      scales: {
        x: {
          time: false,
        },
      },
      axes: [
        {
          show: false,
        },
        {
          show: false,
        },
      ],
      series: [
        {},
        {
          stroke: '#03a9f4',
          fill: '#b3e5fc',
        },
      ],
    },
    visible: false,
    colorCount: 0,
    colorPalette: ['#8ACDCE', 
                   '#3D91BE', 
                   '#24448E', 
                   '#11174B'],
    // colorPalette: ['#DCECC9', '#B3DDCC', '#8ACDCE',
    //                '#62BED2', '#46AACE', '#3D91BE',
    //                '#3577AE', '#2D5E9E', '#24448E',
    //                '#1C2B7F', '#162065', '#11174B'],
  }),
};
</script>

<style scoped>
 .smallText {
   font-size: 9px;
   word-break: break-word;
 }
</style>
