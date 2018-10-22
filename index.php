<?php
//error_reporting(E_ALL);
//ini_set('display_errors', 1);

$stationFile = file_get_contents('Resources/Public/JavaScript/stations.json');
$stations    = json_decode($stationFile);
$stationsJs  = '';
$selectOptions = '<option value="https://www.wsl.ch/gcnet/overview_all_stations.html">All weather stations</option>';
$stationsBaseUrl = 'https://www.wsl.ch/gcnet/stations/';
foreach ($stations as $station){
    $balloonText = '';
    // add start date
    if($station->startdate != NULL){
        $dateFormated = substr($station->startdate,0,4);
        $balloonText = '<br>Start date: '.$dateFormated;
    }
    // add elevation
    if($station->elevation != NULL) {
        $balloonText = '<br>Elevation: ' . $station->elevation . ' m';
    }
    // add detail link
    if($station->active == 1 && $station->data == 1){
        $iconColor = 'rgba(102,205,170,0.8)';
        $balloonText .= '<br><br>Click to view weather station data';

    } else if ($station->active == 1 && $station->data == 0) {
        $iconColor = 'rgba(244, 241, 66,0.8)';
        $balloonText .= '<br><br>No data available at the moment';
    } else {
        $iconColor = 'rgba(216,75,75,0.8)';
        $balloonText .= '<br><br>No longer in operation';
    }

    $urlJson = '';
    if(strlen($station->alias) > 2){
        $selectOptions .= '
            <option value="'.$stationsBaseUrl.$station->alias.'">'.$station->id.') '.$station->name.'</option>
        
        ';
        $urlJson = '"url" : "'.$stationsBaseUrl.$station->alias.'",';
    }


    $stationsJs .= '
        {
            "type": "circle",
            "selectable": true,
            "balloonText": "<b>'.$station->name.'</b>'.$balloonText.'",
            "longitude": -'.$station->longitude.',
            "latitude": '.$station->latitude.',
            "color": "'.$iconColor.'",
            "rollOverColor": "rgba(0,0,0,0.8)",
            "scale": 1.3, 
            "urlTarget": "_blank",
            '.$urlJson.'
        },
    ';



}

?>



<!DOCTYPE html>
<html>
<head>
    <title>Automated Weather Stations AWS</title>
    <meta name="description" content="map created using amCharts" />
    <link rel="stylesheet" media="all" href="Resources/Public/Css/main.css" />
    <script type="text/javascript" src="Resources/Public/JavaScript/main.js"></script>
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha256-3edrmyuQ0w65f8gfBsqowzjJe2iM6n0nKciPUp8y+7E=" crossorigin="anonymous"></script>
    <script type="application/javascript">
        jQuery(document).ready(function() {
            jQuery('#stationsform').on('change', function() {
                var optVal= jQuery("#stationname option:selected").val();
                jQuery('#stationsform').attr('action', optVal);
                this.submit();
            });
        });
    </script>

    <!--

        See also http://pixelmap.amcharts.com/
        For event example see: https://www.amcharts.com/kbase/using-map-events-catch-clicked-object-information/

    -->


    <!--
        This map was created using Pixel Map Generator by amCharts and is licensed under the Creative Commons Attribution 4.0 International License.
        You may use this map the way you see fit as long as proper attribution to the name of amCharts is given in the form of link to https://pixelmap.amcharts.com/
        To view a copy of this license, visit http://creativecommons.org/licenses/by/4.0/

        If you would like to use this map without any attribution, you can acquire a commercial license for the JavaScript Maps - a tool that was used to produce this map.
        To do so, visit amCharts Online Store: https://www.amcharts.com/online-store/
    -->

    <!-- amCharts javascript sources -->
    <script type="text/javascript" src="https://www.amcharts.com/lib/3/ammap.js"></script>
    <script type="text/javascript" src="https://www.amcharts.com/lib/3/maps/js/greenlandHigh.js"></script>

    <!-- amCharts javascript code -->
    <script type="text/javascript">
        var chart = AmCharts.makeChart("map",{
            "type": "map",
            "pathToImages": "http://www.amcharts.com/lib/3/images/",
            "addClassNames": true,
            "fontSize": 15,
            // "color": "#FFFFFF",
            "projection": "mercator",
            "backgroundAlpha": 1,
            "backgroundColor": "#252f38",
            "dataProvider": {
                "map": "greenlandHigh",
                "getAreasFromMap": false,
                "images": [
                    <?php echo $stationsJs; ?>
                ]
            },
            "balloon": {
                "horizontalPadding": 15,
                "borderAlpha": 0,
                "borderThickness": 1,
                "verticalPadding": 15
            },
            "zoomControl": {
                "zoomControlEnabled": true,
                "homeButtonEnabled": false,
                "panControlEnabled": false,
                "right": 38,
                "bottom": 30,
                "minZoomLevel": 0.25,
                "gridHeight": 100,
                "gridAlpha": 0.1,
                "gridBackgroundAlpha": 0,
                "gridColor": "#FFFFFF",
                "draggerAlpha": 1,
                "buttonCornerRadius": 2
            }
        });

        // chart.addListener("clickMapObject", function (event) {
        //     // click event occurred
        //     // let's do something cool
        //     var x = document.getElementById("chartdiv");
        //     x.style.display = "block";
        //     x.style.left = event.event.clientX+10+'px';
        //     x.style.top = (event.event.clientY+50)+'px';
        //
        //
        //     console.log('debug: ');
        //     // console.log(event);
        //     console.log(event.event.clientX);
        //     console.log(event.event.clientY);
        // });


        function show() {
            if(document.getElementById('chartdiv').style.display=='none') {
                document.getElementById('chartdiv').style.display='block';
            }
            return false;
        }
        function hide() {
            if(document.getElementById('chartdiv').style.display=='block') {
                document.getElementById('chartdiv').style.display='none';
            }
            return false;
        }

    </script>

    <style>
        #chartdiv{
            background-color: #FFFFFF;
            display:none;
        }
        .close_button{
            float: right;
            width: 30px;
        }

    </style>

</head>
<body>
<div class="drop-down">
    <form method="post" name="stations" target="_blank" id="stationsform" action="ActionDefinedInOptions">
        <select class="minimal" name="stationname" id="stationname">
            <option>Select an automated weather station</option>
            <?php echo $selectOptions; ?>
        </select>
    </form>
</div>
<div style="width: 100%; height: 100%; position: relative;">
    <div id="chartdiv" style="width: 645px; height: 437px; position: absolute; bottom: 0; right: 0; z-index: 100;" onclick="return hide();">
        <a href="#"><img src="Resources/Public/Images/close.png" onclick="return hide();" class="close_button" /></a>
        <img src="Resources/Public/Images/chart-example.png" /></div>
    <div id="map" style="width: 100%; height: 1285px; position: absolute; top: 0; left: 0;"></div>
</div>


</body>
</html>