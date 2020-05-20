/* eslint-disable no-undef */
import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import microchart from '@amcharts/amcharts4/themes/microchart';
import amchartsDefaultTheme from '@amcharts/amcharts4/themes/amcharts';


const defaultSeriesSettings = {
  lineStrokeWidth: 3,
  lineOpacity: 1,
  // the auto gap depends on the baseInterval, which might be "hours"
  // works if the lineConnect is false
  lineAutoGap: 2,
  lineConnect: false,
  bulletsStrokeWidth: 2,
  bulletsRadius: 5,
  bulletFill: 'black',
  bulletsfillOpacity: 0,
  bulletsStrokeOpacity: 1,
  reloadFrequency: 0,
  showLegend: true,
  numberFormat: '#.0',
};

const defaultOptions = {
  queue: true,
  onlyShowOnViewport: true,
  minPolylineStep: 5,
}

const defaultFormatingInfos = {
  dateFormat: '',
  inputFormat: null,
}

const createLineChart = function createLineChart(selector, dateValueField, chartData, graphs, groupData,
                                                  options = defaultOptions, seriesSettings = defaultSeriesSettings,
                                                  dateFormatingInfos = defaultFormatingInfos,
                                                  chartTitle, chartNumberFormat, dateFormatTime,
                                                  doneCallback, errorCallback)
{
    am4core.useTheme(amchartsDefaultTheme);
    // am4core.options.queue = options.queue;
    am4core.options.onlyShowOnViewport = options.onlyShowOnViewport;
    am4core.options.minPolylineStep = options.minPolylineStep;

    let chart = am4core.create(selector, am4charts.XYChart);
    chart.id = selector;
    // chart._uid = selector;
    chart.padding(0, 0, 0, 0);

    chart.events.on('error', errorCallback);
    chart.events.on('ready', doneCallback);
  
    // chart.events.on('beforedisposed', () => {
    //   console.log('beforedisposed event on ' + chart.id);
    // });
  
    if (chartData) {
      // chartData is optional, to be able to give the series directly a datasource
      chart.data = chartData;
    }

    let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.category = dateValueField;
    // dateAxis.renderer.minGridDistance = 40;
    dateAxis.renderer.minGridDistance = 60;
    dateAxis.groupData = groupData;
    // dateAxis.groupCount = 50;
    
    dateAxis.renderer.inside = true;
    dateAxis.renderer.labels.template.dy = 10;

    // dateAxis.renderer.labels.template.rotation = -45;
    // dateAxis.renderer.labels.template.verticalCenter = "middle";
    // dateAxis.renderer.labels.template.horizontalCenter = "right";
    dateAxis.renderer.grid.template.strokeDasharray = "6";

    // If dateFormatTime in fileObject is false format date without time, else format date with time
    if (dateFormatTime === false) {
        chart.dateFormatter.dateFormat = dateFormatingInfos.dateFormatNoTime;
    }
    else {
        chart.dateFormatter.dateFormat = dateFormatingInfos.dateFormat;
    }

    if (dateFormatingInfos.inputFormat) {
      chart.dateFormatter.inputDateFormat = dateFormatingInfos.inputFormat;
    }

    dateAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy[/]");

    // Display month and date
     dateAxis.periodChangeDateFormats.setKey("hour", "[bold]MMM dd[/]");

    if (chartData.length > 350){
      dateAxis.baseInterval = {
        "timeUnit": "day",
        "count": 1,
      }
    } else {
      dateAxis.baseInterval = {
        "timeUnit": "hour",
        "count": 1,
      }
    }

    chart.paddingTop = options.paddingTop;

    if (seriesSettings.showLegend) {
      chart.legend = new am4charts.Legend();
      // chart.legend.parent = chart.plotContainer;
      chart.legend.zIndex = 100;
      // chart.legend.position = 'absolute';
      // chart.legend.dy = -30;

      // Set legend location
      chart.legend.position = 'top';
      chart.legend.contentAlign = 'center';
      chart.paddingTop = 0;
      // chart.paddingLeft = 0;
    } else {
      chart.paddingTop = 15;
      chart.paddingLeft = 0;
    }

    chart.cursor = new am4charts.XYCursor();
    chart.responsive.enabled = true;

    if (chartTitle) {
      // Create and format chart title
      let title = chart.titles.create();
      title.contentAlign = 'left';
      title.fontSize = 30;
      title.marginBottom = 10;
      title.bold = true;

      // Assign chart title to fileObject.chartTitle prop in DetailChart.vue
      title.text = chartTitle;
    }

    // Assign chart numberFormatter to fileObject.numberFormat prop in DetailChart.vue
    chart.numberFormatter.numberFormat = chartNumberFormat;

    // Create new valueAxisY here so that only one valueAxis is created per chart
    const valueAxisY = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxisY.renderer.minGridDistance = 30;

    // Assign valueAxis color to black
    valueAxisY.renderer.labels.template.fill = am4core.color('#313131');
    valueAxisY.renderer.minWidth = 30;

    valueAxisY.extraMin = 0.1;
    valueAxisY.extraMax = 0.1;

    const scrollbarX = new am4charts.XYChartScrollbar();
  
    for (let i = 0; i < graphs.length; i++) {
      const graph = graphs[i];
        
      addGraphToChart(chart, graph, dateAxis, dateValueField, scrollbarX, seriesSettings, valueAxisY);

      if (i <= 0) {
        scrollbarX.scrollbarChart.xAxes.values[i].renderer.labels.template.inside = false;
        scrollbarX.scrollbarChart.xAxes.values[i].renderer.labels.template.dy = -50;
      }
    }

    chart.maskBullets = true;

    scrollbarX.contentHeight = 40;
    scrollbarX.height = 40;
    chart.scrollbarX = scrollbarX;
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    return chart;
}


function addGraphToChart(chart, graph, dateAxis, dateValueField, scrollbarX, seriesSettings, valueAxisY) {

    let series = new am4charts.LineSeries();
    series.name = graph.title;
    series.hidden = graph.hidden ? graph.hidden : false;

    series.xAxis = dateAxis;
    // Assign series yAxis to valueAxisY
    series.yAxis = valueAxisY;

    if (graph.dataUrl) {
        series.dataSource.url = graph.dataUrl;

        // series.dataSource.events.on('error', (err) => {
        //     console.log(`${graph.title} got an error: ${err}`);
        // });

        // series.dataSource.events.on('done', () => {
        //     console.log(`${graph.title} finished loading`);
        // });

        series.dataSource.reloadFrequency = seriesSettings.reloadFrequency;
        series.dataSource.updateCurrentData = true;
    }

    // Assign tooltip to series color
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color(graph.lineColor);

    series.dataFields.dateX = dateValueField;
    series.dataFields.valueY = graph.valueField;
    series.minBulletDistance = graph.hideBulletsCount;

    series.numberFormatter = new am4core.NumberFormatter();
    series.numberFormatter.numberFormat = seriesSettings.numberFormat;
    series.tooltipText = `{dateX}\n{name}: [bold] {valueY}`;

    series.autoGapCount = seriesSettings.lineAutoGap;
    series.connect = seriesSettings.lineConncet;
    series.stroke = am4core.color(graph.lineColor);
    series.strokeWidth = seriesSettings.lineStrokeWidth;
    series.strokeOpacity = seriesSettings.lineOpacity;

    let bullet = graph.bullet;
    bullet.width = graph.bulletRadius;
    bullet.height = graph.bulletRadius;
    bullet.radius = graph.bulletRadius;
    bullet.fill = seriesSettings.bulletFill;
    bullet.fillOpacity = seriesSettings.bulletsfillOpacity;
    bullet.stroke = am4core.color(graph.lineColor);
    bullet.strokeWidth = seriesSettings.bulletsStrokeWidth;
    bullet.strokeOpacity = seriesSettings.bulletsStrokeOpacity;
    bullet.stroke.color = am4core.color(graph.lineColor);

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.5;
  
    series.bullets.push(bullet);
  
    chart.series.push(series);

    // TODO series preview needs to display in scrollbarX
    scrollbarX.series.push(series);
  
    // hide preview of the series in the scrollbar
    scrollbarX.scrollbarChart.seriesContainer.hide();
}


const createMicroLineChart = function createMicroLineChart(selector, dateValueField, graphs,
                                                            seriesSettings = defaultSeriesSettings,
                                                            dateFormatingInfos = defaultFormatingInfos,
                                                            doneCallback, errorCallback) {
  
  am4core.useTheme(microchart);

  // am4core.options.queue = true;
  am4core.options.minPolylineStep = 2;

  let chart = am4core.create(selector, am4charts.XYChart);
  chart.id = selector;
  // chart._uid = selector;

  // chart.events.on('beforedisposed', () => {
  //   console.log('beforedisposed event on ' + chart.id);
  // });

  let dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.baseInterval = {
    "timeUnit": "hour",
    "count": 1,
  };

  dateAxis.startLocation = 0.5;
  dateAxis.endLocation = 0.7;

  chart.dateFormatter.dateFormat = dateFormatingInfos.dateFormat;
  if (dateFormatingInfos.inputFormat) {
    chart.dateFormatter.inputDateFormat = dateFormatingInfos.inputFormat;
  }

  let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

  for (let i = 0; i < graphs.length; i++) {
    const graph = graphs[i];
    
    let series = chart.series.push(new am4charts.LineSeries());

    if (graph.dataUrl) {
      series.dataSource.url = graph.dataUrl;

      series.dataSource.events.on('parseerror', errorCallback);
      series.dataSource.events.on('error', errorCallback);
      series.dataSource.events.on('done', doneCallback);

      series.dataSource.reloadFrequency = seriesSettings.reloadFrequency;
      series.dataSource.updateCurrentData = true;
    }  

    series.tooltipText = "[bold]{valueY}\n[/]{dateX.formatDate('dd-MM-yyyy HH:mm')}";
    series.tooltip.fill = am4core.color(graph.lineColor);
    series.autoGapCount = seriesSettings.lineAutoGap;
    series.connect = seriesSettings.lineConncet;

    series.yAxis = valueAxis;
    series.xAxis = dateAxis;
    series.dataFields.dateX = dateValueField;
    series.dataFields.valueY = graph.valueField;

    series.stroke = am4core.color(graph.lineColor);
    series.strokeWidth = seriesSettings.lineStrokeWidth;  
  }

  chart.maskBullets = true;

  chart.cursor = new am4charts.XYCursor();
  chart.cursor.lineY.disabled = true;
  
  return chart;
}

// import * as AmCharts from 'amcharts3'
// eslint-disable-next-line no-unused-vars
// import AmSerial from 'amcharts3/amcharts/serial'
// import lightTheme from 'amcharts3/amcharts/themes/light';


// eslint-disable-next-line no-unused-vars
const createSerialChart = function createSerialChart(selector, unit, graphs, chartData, delay, doneCallback, errorCallback) {
    // var chart = am4core.create(selector, am4charts.XYChart);
    // AmCharts.theme = AmCharts.themes.light;
    // AmCharts.useUTC = true;
  
  // console.log('typeof AmCharts.makeChart ' + typeof(AmCharts.makeChart));

    var chartConfig = {
        "type": "serial",
        // "theme": lightTheme,
        // "dataDateFormat": dateFormat,
        "legend": {
          "equalWidths": true,
          "useGraphSettings": true,
          "align": "center",
          "position": "top",
          "valueAlign": "left",
          // "valueText": "[[value]] °C",
          // "valueWidth": 100
        },
        "dataProvider": chartData,
        "synchronizeGrid": true,
        "valueAxes": [{
          // "axisAlpha": 0.2,
          "unit": unit,
          // "dashLength": 1,
          // "position": "left",
          "strictMinMax": true,
          // "minimum": -45,
          // "maximum": 30
        }],
        // "valueAxes": [
        //     {
        //         "id": "v2",
        //         "axisColor": "#F39D01",
        //         "axisThickness": 3,
        //         "axisAlpha": 1,
        //         "position": "left"
        //     }, {
        //         "id": "v3",
        //         "axisColor": "#B0DE09",
        //         "axisThickness": 3,
        //         "gridAlpha": 0,
        //         "offset": 40,
        //         "axisAlpha": 1,
        //         "position": "left"
        //     }, {
        //         "id": "v4",
        //         "axisColor": "#00B7BE",
        //         "axisThickness": 3,
        //         "gridAlpha": 0,
        //         "offset": 80,
        //         "axisAlpha": 1,
        //         "position": "left"
        //     }, {
        //         "id": "v5",
        //         "axisColor": "#7F7FCF",
        //         "axisThickness": 3,
        //         "gridAlpha": 0,
        //         "offset": 120,
        //         "axisAlpha": 1,
        //         "position": "left"
        //     }],
      "graphs": graphs,
        // [
        //     {
        //         "valueAxis": "v2",
        //         "lineColor": "#F39D01",
        //         "bullet": "round",
        //         "bulletBorderThickness": 1,
        //         "hideBulletsCount": 30,
        //         "title": "Atmos Pressure",
        //         "valueField": "pressure",
        //         "connect": false,
        //         "fillAlphas": 0
        //     },
        //     {
        //         "valueAxis": "v3",
        //         "lineColor": "#B0DE09",
        //         "bullet": "triangleUp",
        //         "bulletBorderThickness": 1,
        //         "hideBulletsCount": 30,
        //         "title": "net_radiation",
        //         "valueField": "net_radiation",
        //         "connect": false,
        //         "fillAlphas": 0,
        //         // "negativeLineColor": "#6D8A00",
        //     },
        //     {
        //         "valueAxis": "v4",
        //         "lineColor": "#00F4FF",
        //         "bullet": "triangleDown",
        //         "bulletBorderThickness": 1,
        //         "hideBulletsCount": 30,
        //         "title": "Air Temperture-TC Air 1",
        //         "valueField": "tc_air_1",
        //         "connect": false,
        //         "fillAlphas": 0,
        //         // "negativeLineColor": "#00B7BE",
        //     }, {
        //         "valueAxis": "v5",
        //         "lineColor": "#AAAAE5",
        //         "bullet": "diamond",
        //         "bulletBorderThickness": 1,
        //         "hideBulletsCount": 30,
        //         "title": "Air Temperture-TC Air 2",
        //         "valueField": "tc_air_2",
        //         "connect": false,
        //         "fillAlphas": 0,
        //         // "negativeLineColor": "#7F7FCF",
        //     }
        // ],
        "chartScrollbar": {
          "oppositeAxis": false,
          "offset": 30,
          "scrollbarHeight": 20,
          "backgroundAlpha": 0,
          "selectedBackgroundAlpha": 0.1,
          "selectedBackgroundColor": "#888888",
          "graphFillAlpha": 0,
          "graphLineAlpha": 0.5,
          "selectedGraphFillAlpha": 0,
          "selectedGraphLineAlpha": 1,
          "autoGridCount": true,
          "color": "#AAAAAA"
        },
        "chartCursor": {
          "pan": false,
          "valueLineEnabled": true,
          "valueLineBalloonEnabled": true,
          "parseDates": true,
          "categoryBalloonDateFormat": "MMM DD, YYYY JJ:NN",
          // "dataDateFormat": "MMM DD, YYYY JJ:NN"
        },
        "categoryField": "timestamp",
        "categoryAxis": {
          "parseDates": true,
          /* "axisColor": "#DADADA", */
          // "minPeriod": "mm",
          "minPeriod": "ww",
          "equalSpacing": true,
          "axisColor": "#DADADA",
          "dashLength": 1,
          "minorGridEnabled": true            
        },
        "export": {
            "enabled": false,
        },
        "listeners": [
          // {
          //     "event": "dataUpdated",
          //     "method": () => { console.log("dataUpdated"); }
          // },
          {
            "event": "error",
            "method": (e) => { errorCallback(e); }
          },
          {
            "event": "init",
            "method": () => {
              doneCallback(chart.dataProvider.length);
              // console.log("init finished"); 
            }
          }
        ],
    };

  var chart = AmCharts.makeChart(selector, chartConfig, delay);
  // var chart = makeChart(selector, chartConfig);

    // chart.addListener("dataUpdated", zoomChart);
    // zoomChart(chart);

    return chart;
}

function zoomChart(chart) {
    chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
}


const createSerialAMChartWind = function createSerialAMChartWind(selector, dateFormat, chartData, delay) {
    var chartConfig = {
        "type": "serial",
        // "theme": lightTheme,
        "dataDateFormat": dateFormat,
        "legend": {
            "useGraphSettings": true
        },
        "dataProvider": chartData,
        "synchronizeGrid": true,
        // "valueAxes": [
        //     {
        //         "id": "v1",
        //         "axisColor": "#73C8A9",
        //         "axisThickness": 3,
        //         "offset": 10,
        //         "axisAlpha": 1,
        //         "position": "right"
        //     }, {
        //         "id": "v2",
        //         "axisColor": "#2E926F",
        //         "axisThickness": 3,
        //         "offset": 50,
        //         "axisAlpha": 1,
        //         "position": "right"
        //     }, {
        //         "id": "v3",
        //         "axisColor": "#BD5532",
        //         "axisThickness": 3,
        //         "gridAlpha": 0,
        //         "offset": 90,
        //         "axisAlpha": 1,
        //         "position": "right"
        //     }, {
        //         "id": "v4",
        //         "axisColor": "#6D2600",
        //         "axisThickness": 3,
        //         "gridAlpha": 0,
        //         "offset": 150,
        //         "axisAlpha": 1,
        //         "position": "right"
        //     }],
        "graphs": [{
            "valueAxis": "v1",
            "lineColor": "#73C8A9",
            "bullet": "round",
            "bulletBorderThickness": 1,
            "hideBulletsCount": 30,
            "title": "Wind Speed U1 M [m/s]",
            "valueField": "wind_speed_u1",
            "connect": false,
            "fillAlphas": 0
        }, {
            "valueAxis": "v2",
            "lineColor": "#2E926F",
            "bullet": "square",
            "bulletBorderThickness": 1,
            "hideBulletsCount": 30,
            "title": "Wind Speed U2 N [m/s]",
            "valueField": "wind_speed_u2",
            "connect": false,
            "fillAlphas": 0
        }, {
            "valueAxis": "v3",
            "lineColor": "#BD5532",
            "bullet": "triangleUp",
            "bulletBorderThickness": 1,
            "hideBulletsCount": 30,
            "title": "Wind direction 1 O [deg]",
            "valueField": "wind_dir_u1",
            "connect": false,
            "fillAlphas": 0,
        }, {
            "valueAxis": "v4",
            "lineColor": "#6D2600",
            "bullet": "triangleDown",
            "bulletBorderThickness": 1,
            "hideBulletsCount": 30,
            "title": "Wind direction 2 P [deg]",
            "valueField": "wind_dir_u2",
            "connect": false,
            "fillAlphas": 0,
        }],
        "chartScrollbar": {},
        "chartCursor": {
            "categoryBalloonDateFormat": "JJ:NN, DD MMMM",
            "cursorPosition": "mouse"
        },
        "categoryField": "timestamp",
        "categoryAxis": {
            "parseDates": true,
            /* "axisColor": "#DADADA", */
            "minorGridEnabled": true,
            "minPeriod": "15mm"
        },
        "export": {
            "enabled": false,
        }
    };

  var chart = AmCharts.makeChart(selector, chartConfig, delay);

    chart.addListener("dataUpdated", zoomChart);
    zoomChart(chart);

    return chart;
}

export {
  createLineChart,
  createMicroLineChart,
  createSerialChart,
  createSerialAMChartWind,
  defaultSeriesSettings,
};
