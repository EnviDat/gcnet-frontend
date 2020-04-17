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
  bulletsRadius: 3,
  bulletFill: 'black',
  bulletsfillOpacity: 1,
  bulletsStrokeOpacity: 1,
  reloadFrequency: 0,
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
    // chart.id = selector;
    // chart._uid = selector;
    chart.padding(0, 0, 0, 0);


    // chart.hiddenState.properties.opacity = 0;
  
    if (chartData) {
      chart.events.on('error', errorCallback);
      chart.events.on('ready', doneCallback);

      // chart.events.on('beforedisposed', () => {
      //   console.log(chart._uid + ' going to dispose');
      // });
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

    if (chartData && chartData.length > 350){
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
    chart.paddingTop = 0;

    // Set legend location
    chart.legend.position = 'top';
    chart.legend.contentAlign = 'center';

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
        
      chart = addGraphToChart(chart, graph, dateAxis, dateValueField, i, scrollbarX, seriesSettings, valueAxisY, doneCallback, errorCallback);

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


// function addGraphToChart(chart, graph, dateAxis, dateValueField, count, scrollbarX, seriesSettings) {
function addGraphToChart(chart, graph, dateAxis, dateValueField, count, scrollbarX, seriesSettings, valueAxisY, doneCallback, errorCallback) {

    // let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    // valueAxis.renderer.opposite = count % 2 == 0;
    // valueAxis.renderer.minGridDistance = 30;
    //
    // // valueAxis.renderer.labels.template.stroke = am4core.color(graph.lineColor);
    // valueAxis.renderer.labels.template.fill = am4core.color(graph.lineColor);
    // valueAxis.renderer.minWidth = 30;
    // // valueAxis.renderer.grid.template.stroke = am4core.color(graph.lineColor);
    //
    // valueAxis.extraMin = 0.1;
    // valueAxis.extraMax = 0.1;

    let series = new am4charts.LineSeries();
    series.name = graph.title;
    series.hidden = graph.hidden ? graph.hidden : false;

    if (graph.dataUrl) {
      series.dataSource.url = graph.dataUrl;

      series.dataSource.events.on('parseerror', errorCallback);
      series.dataSource.events.on('error', errorCallback);
      series.dataSource.events.on('done', doneCallback);

      // series.dataSource.reloadFrequency = seriesSettings.reloadFrequency;
      series.dataSource.updateCurrentData = false;
    }

    // Assign tooltip to series color
    series.tooltip.getFillFromObject = false;
    series.tooltip.background.fill = am4core.color(graph.lineColor);

    // series.yAxis = valueAxis;
    series.xAxis = dateAxis;
  
    series.dataFields.dateX = dateValueField;
    series.dataFields.valueY = graph.valueField;
    series.minBulletDistance = graph.hideBulletsCount;

    // Assign tooltipText
    series.tooltipText = "{dateX}\n{name}: [bold] {valueY}";

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

    // TODO series preview needs to display in scrollbarX
    scrollbarX.series.push(series);
    // Temporarily hide series preview
    scrollbarX.scrollbarChart.seriesContainer.hide();

    // Assign series yAxis to valueAxisY
    series.yAxis = valueAxisY;

    return chart;
}


const createMicroLineChart = function createMicroLineChart(selector, dateValueField, graphs,
                                                            seriesSettings = defaultSeriesSettings,
                                                            dateFormatingInfos = defaultFormatingInfos,
                                                            doneCallback, errorCallback) {
  
  am4core.useTheme(microchart);

  // am4core.options.queue = true;
  am4core.options.minPolylineStep = 2;

  let chart = am4core.create(selector, am4charts.XYChart);
  // chart.id = selector;
  // chart._uid = selector;

  // chart.events.on('beforedisposed', () => {
  //   console.log(chart.id + ' going to dispose');
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

  for (let i = 0; i < graphs.length; i++) {
    const graph = graphs[i];
    
    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());

    let series = chart.series.push(new am4charts.LineSeries());

    if (graph.dataUrl) {
      series.dataSource.url = graph.dataUrl;

      series.dataSource.events.on('parseerror', errorCallback);
      series.dataSource.events.on('error', errorCallback);
      series.dataSource.events.on('done', doneCallback);

      // series.dataSource.reloadFrequency = seriesSettings.reloadFrequency;
      series.dataSource.updateCurrentData = false;
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


export {
  createLineChart,
  createMicroLineChart,
};
