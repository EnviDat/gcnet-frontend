import * as am4core from "@amcharts/amcharts4/core";
import * as am4charts from "@amcharts/amcharts4/charts";

const createSerialAMChartWeather = function createSerialAMChartWeather(selector, dateFormat, chartData, amChartTheme, delay)
{
    var chart = am4core.create(selector, am4charts.XYChart);
    chart.data = chartData;

    var dateAxis = chart.xAxes.push(new am4charts.DateAxis());
    dateAxis.dataFields.category = "time";
    dateAxis.title.text = "Date";
    // dateAxis.dateFormats.setKey("day", dateFormat);
    chart.dateFormatter.dateFormat = dateFormat;

    // dateAxis.dateFormats.setKey("minute", "HH:mm");
    // dateAxis.periodChangeDateFormats.setKey("day", "MMMM dt"); 
    // dateAxis.periodChangeDateFormats.setKey("month", "[bold]yyyy[/]"); 
    
    dateAxis.baseInterval = {
        "timeUnit": "minute",
        "count": 30,
    }

    // var valueAxis = chart.yAxes.push(new am4charts.ValueAxis());    
    // valueAxis.title.text = "Turnover ($M)";

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

    // for (let i = 0; i < graphs.length; i++) {
    //     const graph = graphs[i];
        
    //     chart = addGraphToChart(chart, graph, dateAxis);
    // }

    chart = addGraphToChart(chart, graphs[0], dateAxis);

    chart.legend = new am4charts.Legend();
    chart.legend.parent = chart.plotContainer;
    chart.legend.zIndex = 100;
    chart.legend.align = 'bottom';

    chart.cursor = new am4charts.XYCursor();    

    return chart;
}

function addGraphToChart(chart, graph, dateAxis) {

    let valueAxis = chart.yAxes.push(new am4charts.ValueAxis());
    valueAxis.fill = am4core.color(graph.lineColor);
    // valueAxis.title.text = graph.title;

    let series = chart.series.push(new am4charts.LineSeries());
    // series.autoGapCount = 3;
    series.connect = false;
    series.stroke = am4core.color(graph.lineColor);
    series.strokeWidth = 3; // 3px
    series.strokeOpacity = 0.8;
    // "time" refeers to the json element "time" from the data_conversion.js
    series.dataFields.dateX = "time";
    series.dataFields.valueY = graph.valueField;

    let bullet = new am4charts.CircleBullet();
    bullet.width = 5;
    bullet.height = 5;
    bullet.minBulletDistance = 30;        
    series.bullets.push(bullet);
    // series.bullets.push(graph.bullet);

    series.name = graph.title;
    series.tooltipText = "{name}: [bold]{valueY}[/] {dateX}";
    series.yAxis = valueAxis;
    series.xAxis = dateAxis;

    var scrollbarX = new am4charts.XYChartScrollbar();
    scrollbarX.series.push(series);
    chart.scrollbarX = scrollbarX;

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


const createSerialAMChartWind = function createSerialAMChartWind(selector, dateFormat, chartData, amChartTheme)
{
    var chartConfig = {
        "type": "serial",
        // "theme": amChartTheme.themeName,
        "dataDateFormat": dateFormat,            
        "legend": {
            "useGraphSettings": true
        },
        // "dataProvider": chartData,
        "synchronizeGrid": true,
        "valueAxes": [
            {
            "id":"v1",
            "axisColor": "#73C8A9",
            "axisThickness": 3,
            "axisAlpha": 1,
            "position": "right"
        }, {
            "id":"v2",
            "axisColor": "#2E926F",
            "axisThickness": 3,
            "offset": 40,
            "axisAlpha": 1,
            "position": "right"
        }, {
            "id":"v3",
            "axisColor": "#BD5532",
            "axisThickness": 3,
            "gridAlpha": 0,
            "offset": 80,
            "axisAlpha": 1,
            "position": "right"
        }, {
            "id":"v4",
            "axisColor": "#6D2600",
            "axisThickness": 3,
            "gridAlpha": 0,
            "offset": 120,
            "axisAlpha": 1,
            "position": "right"
        }],
        "graphs": [{
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
        }],
        "chartScrollbar": {},
        "chartCursor": {
            "categoryBalloonDateFormat": "JJ:NN, DD MMMM",            
            "cursorPosition": "mouse"
        },
        "categoryField": "date",
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

    // var chart = am4core.create(selector, am4charts.XYChart);
    var chart = am4core.create(selector, am4charts.XYChart);
    chart.config = chartConfig;

    //chart.addListener("dataUpdated", zoomChart);
    //zoomChart(chart);

    return chart;
}

export {
    createSerialAMChartWeather,
    createSerialAMChartWind,
}