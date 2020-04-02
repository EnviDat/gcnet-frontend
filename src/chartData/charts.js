import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";
import microchart from '@amcharts/amcharts4/themes/microchart';


const defaultSeriesSettings = {
  lineStrokeWidth: 3,
  lineOpacity: 1,
  // the auto gap depends on the baseInterval, which might be "hours"
  // works if the lineConnect is false
  lineAutoGap: 2,
  lineConnect: false,
  bulletsStrokeWidth: 2,
  bulletsRadius: 3,
  bulletFill: 'black',
  bulletsfillOpacity: 1,
  bulletsStrokeOpacity: 1,
  reloadFrequency: 0,
};

const defaultOptions = {
  queue: true,
  onlyShowOnViewport: true,
  minPolylineStep: 20,
}

const defaultFormatingInfos = {
  dateFormat: '',
  inputFormat: null,
}

const createLineChart = function createLineChart(selector, dateValueField, chartData, graphs, groupData,
                                                    chartOptions = defaultOptions, seriesSettings = defaultSeriesSettings,
                                                    dateFormatingInfos = defaultFormatingInfos)
{
    am4core.options.queue = chartOptions.queue;
    am4core.options.onlyShowOnViewport = chartOptions.onlyShowOnViewport;

    var chart = am4core.create(selector, am4charts.XYChart);
    chart.hiddenState.properties.opacity = 0;
    chart.options = chartOptions;

    if (chartData) {
        // chartData is optional, to be able to give the series directly a datasource
        chart.data = chartData;
    }

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.category = dateValueField;
    dateAxis.renderer.minGridDistance = 40;
    dateAxis.groupData = groupData;
    
    dateAxis.renderer.inside = true;
    dateAxis.renderer.labels.template.dy = 10;

    // dateAxis.renderer.labels.template.rotation = -45;
    // dateAxis.renderer.labels.template.verticalCenter = "middle";
    // dateAxis.renderer.labels.template.horizontalCenter = "right";
    dateAxis.renderer.grid.template.strokeDasharray = "4";

    chart.dateFormatter.dateFormat = dateFormatingInfos.dateFormat;
    if (dateFormatingInfos.inputFormat) {
      chart.dateFormatter.inputDateFormat = dateFormatingInfos.inputFormat;
    }

    dateAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy[/]"); 
    
    am4core.options.minPolylineStep = 2;

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

    chart.legend = new am4charts.Legend();
    // chart.legend.parent = chart.plotContainer;
    chart.legend.zIndex = 100;
    // chart.legend.position = 'absolute';
    // chart.legend.dy = -30;
    // chart.paddingTop = 30;

    // Set legend location
    chart.legend.position = 'bottom';
    chart.legend.contentAlign = 'left';

    chart.cursor = new am4charts.XYCursor();
    chart.responsive.enabled = true;

    // Create and format chart title
    var title = chart.titles.create();
    title.contentAlign = 'left';
    title.fontSize = 30;
    title.marginBottom = 10;
    title.bold = true;


    // Dynamically assign chart title
    switch (graphs[0].valueField) {
        case 'AirTC1':
        case 'AirTC2':
            title.text = 'Air temperatures';
            break;
        case 'RH1':
        case 'RH2':
            title.text = 'Relative humidity';
            break;
        case 'NetRad':
        case 'SWin':
        case 'SWout':
            title.text = 'Radiation';
            break;
        case 'Sheight1':
        case 'Sheight2':
            title.text = 'Snow heights';
            break;
        case 'WS1':
        case 'WS2':
            title.text = 'Wind speed';
            break;
        case 'WD1':
        case 'WD2':
            title.text = 'Wind direction';
            break;
        case 'press':
            title.text = 'Air pressure';
            break;
        case 'Battvolt':
            title.text = 'Battery voltage';
            break;
        default:
            // Assign default chart text to first valueField for each graph
            title.text = graphs[0].valueField;
    }


    const scrollbarX = new am4charts.XYChartScrollbar();

    // addGraphToChart(chart, graphs[0], dateAxis, dateValueField, 0, scrollbarX, seriesSettings);
    // addGraphToChart(chart, graphs[1], dateAxis, dateValueField, 1, scrollbarX, seriesSettings);

    for (let i = 0; i < graphs.length; i++) {
      const graph = graphs[i];
        
        chart = addGraphToChart(chart, graph, dateAxis, dateValueField, i, scrollbarX, seriesSettings);
    }

    chart.maskBullets = true;
    
    chart.scrollbarX = scrollbarX;
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    return chart;
}


function addGraphToChart(chart, graph, dateAxis, dateValueField, count, scrollbarX, seriesSettings) {

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    // valueAxis.title.text = graph.title;
    valueAxis.renderer.opposite = count % 2 == 0;
    valueAxis.renderer.minGridDistance = 30;

    // valueAxis.renderer.labels.template.stroke = am4core.color(graph.lineColor);
    valueAxis.renderer.labels.template.fill = am4core.color(graph.lineColor);
    valueAxis.renderer.minWidth = 30;
    // valueAxis.renderer.grid.template.stroke = am4core.color(graph.lineColor);

    valueAxis.extraMin = 0.1;
    valueAxis.extraMax = 0.1;

    // Assign title to valueAxis
    // TODO Dynamically assign title to valueAis
    valueAxis.title.text = '°C';



    let series = new am4charts.LineSeries();
    series.name = graph.title;
    series.hidden = graph.hidden ? graph.hidden : false;

    if (graph.dataUrl) {
        series.dataSource.url = graph.dataUrl;

        series.dataSource.events.on('error', (err) => {
            console.log(`${graph.title} got an error: ${err}`);
        });

        series.dataSource.events.on('done', () => {
            console.log(`${graph.title} finished loading`);
        });

        series.dataSource.reloadFrequency = seriesSettings.reloadFrequency;
        series.dataSource.updateCurrentData = true;
    }

    series.tooltipText = "{name}: [bold] {valueY}";

    series.yAxis = valueAxis;
    series.xAxis = dateAxis;
  
    series.dataFields.dateX = dateValueField;
    series.dataFields.valueY = graph.valueField;
    series.minBulletDistance = graph.hideBulletsCount;

    series.autoGapCount = seriesSettings.lineAutoGap;
    series.connect = seriesSettings.lineConncet;
    series.stroke = am4core.color(graph.lineColor);
    series.strokeWidth = seriesSettings.lineStrokeWidth;
    series.strokeOpacity = seriesSettings.lineOpacity;

    let bullet = graph.bullet;
    // let bullet = new am4core.Circle();
  // let bullet = new am4core.Rectangle();
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
    bullethover.properties.scale = 1.3;
  
    series.bullets.push(bullet);
  
    chart.series.push(series);

    if (count <= 0 && scrollbarX) {
      scrollbarX.series.push(series);
      scrollbarX.scrollbarChart.xAxes.values[count].renderer.labels.template.inside = false;
      scrollbarX.scrollbarChart.xAxes.values[count].renderer.labels.template.dy = -50;
    }
  
    return chart;
}

const createMicroLineChart = function createMicroLineChart(selector, dateValueField, graphs,
                                                            seriesSettings = defaultSeriesSettings,
                                                            dateFormatingInfos = defaultFormatingInfos,
                                                            doneCallback, errorCallback) {
  
  am4core.useTheme(microchart);

  am4core.options.queue = defaultOptions.queue;

  var chart = am4core.create(selector, am4charts.XYChart);
  chart.id = selector;

  var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
  dateAxis.startLocation = 0.5;
  dateAxis.endLocation = 0.7;

  chart.dateFormatter.dateFormat = dateFormatingInfos.dateFormat;
  if (dateFormatingInfos.inputFormat) {
    chart.dateFormatter.inputDateFormat = dateFormatingInfos.inputFormat;
  }

  for (let i = 0; i < graphs.length; i++) {
    const graph = graphs[i];
    
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    
    var series = chart.series.push(new am4charts.LineSeries());

    if (graph.dataUrl) {
      series.dataSource.url = graph.dataUrl;

      series.dataSource.events.on('parseerror', errorCallback);
      series.dataSource.events.on('error', errorCallback);
      series.dataSource.events.on('done', doneCallback);

      series.dataSource.reloadFrequency = seriesSettings.reloadFrequency;
      series.dataSource.updateCurrentData = true;
    }  

    series.tooltipText = `[bold]{${graph.valueField}}`;
    series.tooltip.fill = am4core.color(graph.lineColor);

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


export {
  createLineChart,
  createMicroLineChart,
}