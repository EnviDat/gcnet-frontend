import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const chartSettings = {
  lineStrokeWidth: 3,
  lineOpacity: 1,
  // the auto gap depends on the baseInterval, which might be "hours"
  // works if the lineConnect is false
  lineAutoGap: 2,
  lineConncet: false,
  bulletsStrokeWidth: 2,
  bulletsRadius: 3,
  bulletsfillOpacity: 0,
  bulletsStrokeOpacity: 1,
};

const createSerialAMChartWeather = function createSerialAMChartWeather(selector, dateFormat, chartData)
{
    var chart = am4core.create(selector, am4charts.XYChart);
    chart.data = chartData;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.category = "time";
    dateAxis.renderer.minGridDistance = 40;
    dateAxis.groupData = true;
    
    dateAxis.renderer.inside = true;
    dateAxis.renderer.labels.template.dy = 5;
    // dateAxis.renderer.labels.template.rotation = -45;
    // dateAxis.renderer.labels.template.verticalCenter = "middle";
    // dateAxis.renderer.labels.template.horizontalCenter = "right";

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

    const graphs = [
    /*
    {
        "valueAxis": "v1",
        "lineColor": "#FE5745",
        "bullet": "round",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "sw_down",
        "valueField": "sw_down",
        "fillAlphas": 0
    }, {
        "valueAxis": "v2",
        "lineColor": "#F39D01",
        "bullet": "square",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "sw_up",
        "valueField": "sw_up",
        "fillAlphas": 0
    },
    */
    {
        "valueAxis": "v2",
        "lineColor": "#F39D01",
        "bullet": am4core.Circle,
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Atmos Pressure",
        "valueField": "pressure",
        "fillAlphas": 0
    },
    {
        "valueAxis": "v3",
        "lineColor": "#B0DE09",
        "bullet": am4core.Circle,
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Net Radiation",
        "valueField": "net_radiation",
        "fillAlphas": 0,
        /* "negativeLineColor": "#6D8A00", */
    }, {
        "valueAxis": "v4",
        "lineColor": "#00F4FF",
        "bullet": am4core.Circle,
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Air Temperture-TC Air 1",
        "valueField": "tc_air_1",
        "fillAlphas": 0,
        /* "negativeLineColor": "#00B7BE", */
    }, {
        "valueAxis": "v5",
        "lineColor": "#AAAAE5",
        "bullet": am4core.Circle,
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Air Temperture-TC Air 2",
        "valueField": "tc_air_2",
        "fillAlphas": 0,
        /* "negativeLineColor": "#7F7FCF", */
    }];

    chart.legend = new am4charts.Legend();
    chart.legend.parent = chart.plotContainer;
    chart.legend.zIndex = 100;
    chart.legend.position = 'top';
    // chart.legend.position = 'absolute';
    // chart.legend.y = 500;

    // chart.legend.valign = 'bottom';
    // chart.legend.contentAlign = 'center';

    chart.cursor = new am4charts.XYCursor();
    chart.responsive.enabled = true;
  
    const scrollbarX = new am4charts.XYChartScrollbar();

    chart = addGraphToChart(chart, graphs[0], dateAxis, 0, scrollbarX, chartSettings);
    chart = addGraphToChart(chart, graphs[1], dateAxis, 1, scrollbarX, chartSettings);

    // for (let i = 0; i < graphs.length; i++) {
    //     const graph = graphs[i];
        
    //     chart = addGraphToChart(chart, graph, dateAxis, i, chartSettings);
    // }

    chart.maskBullets = false;

    scrollbarX.height = 25;
    // scrollbarX.scrollbarChart.xAxes.values[0].renderer.inside = false;
    scrollbarX.scrollbarChart.xAxes.values[0].renderer.labels.template.dy = -10;
    chart.scrollbarX = scrollbarX;
    chart.scrollbarX.parent = chart.bottomAxesContainer;

    return chart;
}


function addGraphToChart(chart, graph, dateAxis, count, scrollbarX, chartSettings) {

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.title.text = graph.title;
    valueAxis.renderer.opposite = count % 2 == 0;
    valueAxis.renderer.minGridDistance = 25;
    
    // valueAxis.fill = am4core.color(graph.lineColor);
    valueAxis.renderer.labels.template.fill = am4core.color(graph.lineColor);
    valueAxis.renderer.minWidth = 30;
    valueAxis.extraMin = 0.2;
    valueAxis.extraMax = 0.2;

    let series = new am4charts.LineSeries();
    series.name = graph.title;
    series.tooltipText = "{name}: [bold] {valueY}";
    series.yAxis = valueAxis;
    series.xAxis = dateAxis;
  
    // "time" refeers to the json element "time" from the data_conversion.js
    series.dataFields.dateX = "time";
    series.dataFields.valueY = graph.valueField;
    // series.minBulletDistance = graph.hideBulletsCount;

    series.autoGapCount = chartSettings.lineAutoGap;
    series.connect = chartSettings.lineConncet;
    series.stroke = am4core.color(graph.lineColor);
    series.strokeWidth = chartSettings.lineStrokeWidth;
    series.strokeOpacity = chartSettings.lineOpacity;

    let bullet = new am4core.Circle();
    bullet.radius = chartSettings.bulletsRadius;
    bullet.fillOpacity = chartSettings.bulletsfillOpacity;
    bullet.stroke = am4core.color(graph.lineColor);
    bullet.strokeWidth = chartSettings.bulletsStrokeWidth;
    bullet.strokeOpacity = chartSettings.bulletsStrokeOpacity;
    bullet.stroke.color = am4core.color(graph.lineColor);

    let bullethover = bullet.states.create("hover");
    bullethover.properties.scale = 1.3;
  
    series.bullets.push(bullet);
  
    chart.series.push(series);

    if (count <= 0) {
      scrollbarX.series.push(series);
    }
  
    return chart;
}
    
    // var chartConfig = {
    //     "type": "serial",
    //     // "theme": amChartTheme.themeName,
    //     "dataDateFormat": dateFormat,
    //     "legend": {
    //         "useGraphSettings": false
    //     },
    //     // "dataProvider": chartData,
    //     "synchronizeGrid": true,
    //     "valueAxes": [
    //     /*
    //         {
    //         "id":"v1",
    //         "axisColor": "#FF6600",
    //         "axisThickness": 3,
    //         "axisAlpha": 1,
    //         "position": "left"
    //     },
    //     */
    //      {
    //         "id":"v2",
    //         "axisColor": "#F39D01",
    //         "axisThickness": 3,
    //         "axisAlpha": 1,
    //         "position": "left"
    //     }, {
    //         "id":"v3",
    //         "axisColor": "#B0DE09",
    //         "axisThickness": 3,
    //         "gridAlpha": 0,
    //         "offset": 40,
    //         "axisAlpha": 1,
    //         "position": "left"
    //     }, {
    //         "id":"v4",
    //         "axisColor": "#00B7BE",
    //         "axisThickness": 3,
    //         "gridAlpha": 0,
    //         "offset": 80,
    //         "axisAlpha": 1,
    //         "position": "left"
    //     }, {
    //         "id":"v5",
    //         "axisColor": "#7F7FCF",
    //         "axisThickness": 3,
    //         "gridAlpha": 0,
    //         "offset": 120,
    //         "axisAlpha": 1,
    //         "position": "left"
    //     }],
    //     "graphs": [
    //     /*
    //     {
    //         "valueAxis": "v1",
    //         "lineColor": "#FE5745",
    //         "bullet": "round",
    //         "bulletBorderThickness": 1,
    //         "hideBulletsCount": 30,
    //         "title": "sw_down",
    //         "valueField": "sw_down",
    //         "fillAlphas": 0
    //     }, {
    //         "valueAxis": "v2",
    //         "lineColor": "#F39D01",
    //         "bullet": "square",
    //         "bulletBorderThickness": 1,
    //         "hideBulletsCount": 30,
    //         "title": "sw_up",
    //         "valueField": "sw_up",
    //         "fillAlphas": 0
    //     },
    //     */
    //     {
    //         "valueAxis": "v2",
    //         "lineColor": "#F39D01",
    //         "bullet": "square",
    //         "bulletBorderThickness": 1,
    //         "hideBulletsCount": 30,
    //         "title": "Atmos Pressure",
    //         "valueField": "pressure",
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
    //         "fillAlphas": 0,
    //         /* "negativeLineColor": "#6D8A00", */
    //     }, {
    //         "valueAxis": "v4",
    //         "lineColor": "#00F4FF",
    //         "bullet": "triangleDown",
    //         "bulletBorderThickness": 1,
    //         "hideBulletsCount": 30,
    //         "title": "Air Temperture-TC Air 1",
    //         "valueField": "tc_air_1",
    //         "fillAlphas": 0,
    //         /* "negativeLineColor": "#00B7BE", */
    //     }, {
    //         "valueAxis": "v5",
    //         "lineColor": "#AAAAE5",
    //         "bullet": "diamond",
    //         "bulletBorderThickness": 1,
    //         "hideBulletsCount": 30,
    //         "title": "Air Temperture-TC Air 2",
    //         "valueField": "tc_air_2",
    //         "fillAlphas": 0,
    //         /* "negativeLineColor": "#7F7FCF", */
    //     }],
    //     "chartScrollbar": {},
    //     "chartCursor": {
    //         "categoryBalloonDateFormat": "JJ:NN, DD MMMM",            
    //         "cursorPosition": "mouse"
    //     },
    //     "categoryField": "date",
    //     "categoryAxis": {
    //         "parseDates": true,
    //         /* "axisColor": "#DADADA", */
    //         "minorGridEnabled": true,
    //         "minPeriod": "15mm"
    //     },
    //     "export": {
    //         "enabled": false,
    //     }
    // };

    // var chart = AmCharts.makeChart(selector, chartConfig, delay);

    // chart.config = chartConfig;

    // var chart = am4core.createFromConfig({
    //     chartConfig,
    //     // Add data
    //     "data": chartData,
    //     // And, for a good measure, let's add a legend
    //     "legend": {}
    //   }, selector, am4charts.XYChart);    

    //chart.addListener("dataUpdated", zoomChart);
    //zoomChart(chart);

// function zoomChart(chart){
//     chart.zoomToIndexes(chart.dataProvider.length - 20, chart.dataProvider.length - 1);
// }    


const createSerialAMChartWind = function createSerialAMChartWind(selector, dateFormat, chartData)
{
    var chart = am4core.create(selector, am4charts.XYChart);
    chart.data = chartData;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.category = "time";
    dateAxis.renderer.minGridDistance = 30;
    dateAxis.renderer.strokeDasharray = "2";
    // dateAxis.title.text = "Date";
    
    chart.dateFormatter.dateFormat = dateFormat;
    // chart.dateFormatter.inputDateFormat = dateFormat;
    // chart.dateFormatter. = "yyyy-MM-dd HH:mm";
    // dateAxis.dateFormats.setKey("minute", "dd/MM/yy HH:mm");
    // dateAxis.dateFormats.setKey("hour", "dd/MM/yy HH:mm");
    // dateAxis.dateFormats.setKey("day", "MMMM dd");

    // dateAxis.periodChangeDateFormats.setKey("day", "MM dd"); 
    dateAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy[/]"); 

    am4core.options.minPolylineStep = 2;
    dateAxis.baseInterval = {
        "timeUnit": "hour",
        "count": 1,
    }
    
    // if (chartData.length > 350){
    //     am4core.options.minPolylineStep = 5;
    //     dateAxis.baseInterval = {
    //         "timeUnit": "hour",
    //         "count": 1,
    //     }
    // } else {
    //     am4core.options.minPolylineStep = 1;
    //         dateAxis.baseInterval = {
    //         "timeUnit": "minute",
    //         "count": 30,
    //     }
    // }

    const graphs = [{
        "valueAxis": "v1",
        "lineColor": "#73C8A9",
        "bullet": "round",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Wind Speed U1 M [m/s]",
        "valueField": "wind_speed_u1",
        // "connect": false,
        "fillAlphas": 0
    }, {
        "valueAxis": "v2",
        "lineColor": "#2E926F",
        "bullet": "square",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Wind Speed U2 N [m/s]",
        "valueField": "wind_speed_u2",
        //"connect": false,
        "fillAlphas": 0
    }, {
        "valueAxis": "v3",
        "lineColor": "#BD5532",
        "bullet": "triangleUp",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Wind direction 1 O [deg]",
        "valueField": "wind_dir_u1",
        //"connect": false,
        "fillAlphas": 0,
    }, {
        "valueAxis": "v4",
        "lineColor": "#6D2600",
        "bullet": "triangleDown",
        "bulletBorderThickness": 1,
        "hideBulletsCount": 30,
        "title": "Wind direction 2 P [deg]",
        "valueField": "wind_dir_u2",
        //"connect": false,
        "fillAlphas": 0,
    }];


    chart.legend = new am4charts.Legend();
    chart.legend.parent = chart.plotContainer;
    chart.legend.zIndex = 100;
    // chart.legend.position = 'bottom';
    chart.legend.position = 'absolute';
    chart.legend.y = 500;

    // chart.legend.valign = 'bottom';
    // chart.legend.contentAlign = 'center';

    chart.cursor = new am4charts.XYCursor();
    chart.responsive.enabled = true;

    for (let i = 0; i < graphs.length; i++) {
        const graph = graphs[i];
        
        chart = addGraphToChart(chart, graph, dateAxis, i);
    }

    return chart;
}

// var chartConfig = {
//     "type": "serial",
//     // "theme": amChartTheme.themeName,
//     "dataDateFormat": dateFormat,            
//     "legend": {
//         "useGraphSettings": true
//     },
//     // "dataProvider": chartData,
//     "synchronizeGrid": true,
//     "valueAxes": [
//         {
//         "id":"v1",
//         "axisColor": "#73C8A9",
//         "axisThickness": 3,
//         "axisAlpha": 1,
//         "position": "right"
//     }, {
//         "id":"v2",
//         "axisColor": "#2E926F",
//         "axisThickness": 3,
//         "offset": 40,
//         "axisAlpha": 1,
//         "position": "right"
//     }, {
//         "id":"v3",
//         "axisColor": "#BD5532",
//         "axisThickness": 3,
//         "gridAlpha": 0,
//         "offset": 80,
//         "axisAlpha": 1,
//         "position": "right"
//     }, {
//         "id":"v4",
//         "axisColor": "#6D2600",
//         "axisThickness": 3,
//         "gridAlpha": 0,
//         "offset": 120,
//         "axisAlpha": 1,
//         "position": "right"
//     }],
//     "graphs": [{
//         "valueAxis": "v1",
//         "lineColor": "#73C8A9",
//         "bullet": "round",
//         "bulletBorderThickness": 1,
//         "hideBulletsCount": 30,
//         "title": "Wind Speed U1 M [m/s]",
//         "valueField": "wind_speed_u1",
//         // "connect": false,
//         "fillAlphas": 0
//     }, {
//         "valueAxis": "v2",
//         "lineColor": "#2E926F",
//         "bullet": "square",
//         "bulletBorderThickness": 1,
//         "hideBulletsCount": 30,
//         "title": "Wind Speed U2 N [m/s]",
//         "valueField": "wind_speed_u2",
//         //"connect": false,
//         "fillAlphas": 0
//     }, {
//         "valueAxis": "v3",
//         "lineColor": "#BD5532",
//         "bullet": "triangleUp",
//         "bulletBorderThickness": 1,
//         "hideBulletsCount": 30,
//         "title": "Wind direction 1 O [deg]",
//         "valueField": "wind_dir_u1",
//         //"connect": false,
//         "fillAlphas": 0,
//     }, {
//         "valueAxis": "v4",
//         "lineColor": "#6D2600",
//         "bullet": "triangleDown",
//         "bulletBorderThickness": 1,
//         "hideBulletsCount": 30,
//         "title": "Wind direction 2 P [deg]",
//         "valueField": "wind_dir_u2",
//         //"connect": false,
//         "fillAlphas": 0,
//     }],
//     "chartScrollbar": {},
//     "chartCursor": {
//         "categoryBalloonDateFormat": "JJ:NN, DD MMMM",            
//         "cursorPosition": "mouse"
//     },
//     "categoryField": "date",
//     "categoryAxis": {
//         "parseDates": true,
//         /* "axisColor": "#DADADA", */
//         "minorGridEnabled": true,
//         "minPeriod": "15mm"
//     },
//     "export": {
//         "enabled": false,
//     }
// };


export {
    createSerialAMChartWeather,
    createSerialAMChartWind,
}