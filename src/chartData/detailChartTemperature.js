import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const defaultSettings = {
  lineStrokeWidth: 3,
  lineOpacity: 1,
  // the auto gap depends on the baseInterval, which might be "hours"
  // works if the lineConnect is false
  lineAutoGap: 2,
  lineConncet: false,
  bulletsStrokeWidth: 2,
  bulletsRadius: 3,
  bulletFill: 'black',
  bulletsfillOpacity: 1,
  bulletsStrokeOpacity: 1,
};

const defaultOptions = {
  queue: true,
  onlyShowOnViewport: true,
}

const createLineChartTemperature = function createLineChart(selector, dateFormat, chartData, graphs, groupData, chartOptions = defaultOptions, seriesSettings = defaultSettings)
{
    var chart = am4core.create(selector, am4charts.XYChart);
    chart.options = chartOptions;
    chart.data = chartData;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.category = "time";
    dateAxis.renderer.minGridDistance = 40;
    dateAxis.groupData = groupData;

    dateAxis.renderer.inside = true;
    dateAxis.renderer.labels.template.dy = 10;

    // dateAxis.renderer.labels.template.rotation = -45;
    // dateAxis.renderer.labels.template.verticalCenter = "middle";
    // dateAxis.renderer.labels.template.horizontalCenter = "right";
    dateAxis.renderer.grid.template.strokeDasharray = "4";

    chart.dateFormatter.dateFormat = dateFormat;

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
    chart.legend.parent = chart.plotContainer;
    chart.legend.zIndex = 100;
    chart.legend.position = 'absolute';
    chart.legend.dy = -30;
    chart.paddingTop = 30;

    chart.cursor = new am4charts.XYCursor();
    chart.responsive.enabled = true;

    const scrollbarX = new am4charts.XYChartScrollbar();

    // addGraphToChart(chart, graphs[0], dateAxis, 0, scrollbarX, seriesSettings);
    // addGraphToChart(chart, graphs[1], dateAxis, 1, scrollbarX, seriesSettings);

    for (let i = 0; i < graphs.length; i++) {
      const graph = graphs[i];

      chart = addGraphToChart(chart, graph, dateAxis, i, scrollbarX, seriesSettings);
    }

    chart.maskBullets = true;

    chart.scrollbarX = scrollbarX;
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    return chart;
}


function addGraphToChart(chart, graph, dateAxis, count, scrollbarX, seriesSettings) {

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

    let series = new am4charts.LineSeries();
    series.name = graph.title;
    series.tooltipText = "{name}: [bold] {valueY}";
    series.yAxis = valueAxis;
    series.xAxis = dateAxis;

    // "time" refeers to the json element "time" from the data_conversion.js
    series.dataFields.dateX = "time";
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

    if (count <= 0) {
      scrollbarX.series.push(series);
      scrollbarX.scrollbarChart.xAxes.values[count].renderer.labels.template.inside = false;
      scrollbarX.scrollbarChart.xAxes.values[count].renderer.labels.template.dy = -50;
    }

    return chart;
}


export {
  createLineChartTemperature,
}