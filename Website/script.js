/*eslint no-undef: "error"*/
/*global google*/

google.charts.load('current', {'packages':['corechart']});
google.charts.setOnLoadCallback(drawChart); 

var tooltips = []
var markers= []
var map;
var toggleSensor1 = true;
var toggleSensor2 = true;

var icons={
    redCircle:{
        name: " : Red ('Wet')",
        icon: "red-light-icon.png"
    },
    greenCircle:{
        name: " : Green ('Dry')",
        icon: "green-light-icon.png"
    },
    blueBox:{
        name: " : Time Series Stream Level Gauge",
        icon: "blue-box-icon.png"
    },
    redBox:{
        name: " : Likely Overtipping roadway",
        icon: "red-box-icon.png"
    }
};

function initMap(){
    map = new google.maps.Map(document.getElementById("map"),{
        center: {lat: 30.596833, lng: -96.305661},
        zoom: 14                
    });
    

    //var coord = {lat: 30.6280, lng: -96.3344}
    createGraphMarker(map, {lat: 30.598021, lng: -96.299730} , true); 
    createGraphMarker(map, {lat: 30.580748, lng: -96.316813} ,true);
    createGraphMarker(map, {lat: 30.611681, lng: -96.287835} , false);
    createGraphMarker(map, {lat: 30.594548, lng: -96.323512} , false);
    createGraphMarker(map, {lat: 30.609880, lng: -96.339530} ,true);

    
    createBinaryMarker(map, {lat: 30.601721, lng: -96.276516}, false, 100, "Briarcrest @ Wolf Pen Creek", "10/09/2019, 8:09am"); 
    createBinaryMarker(map, {lat: 30.579531, lng: -96.266886}, true, 101, "Rellis Parkway Complex", "10/09/2019, 8:09am");
    createBinaryMarker(map, {lat: 30.606628, lng: -96.296342}, false, 102, "Texas A&M University Complex", "10/09/2019, 8:09am");
    createBinaryMarker(map, {lat: 30.580885, lng: -96.328749}, false, 103, "Tanglewood Park", "10/09/2019, 8:09am");
    
    createBinaryMarker(map, {lat: 30.563045, lng: -96.330127}, false, 104, "Sienna Springs Dr", "10/09/2019, 8:09am");
    createBinaryMarker(map, {lat: 30.617757, lng: -96.327249}, false, 105, "University Driving Range", "10/09/2019, 8:09am");
//    createBinaryMarker(map, , true, 106, , "10/09/2019, 8:09am");
    createBinaryMarker(map, {lat: 30.584994, lng: -96.361820}, true, 107, "Easterwood Airport", "10/09/2019, 8:09am");
    createBinaryMarker(map, {lat: 30.594017, lng: -96.281624}, false, 108, "Woodcreek Park", "10/09/2019, 8:09am");
    createBinaryMarker(map, {lat: 30.600269, lng: -96.301644}, false, 109,  "Harvey Mitchell Parkway S", "10/09/2019, 8:09am");
    createBinaryMarker(map, {lat: 30.617659, lng: -96.283883}, false, 110, "Carter's Crossing Park", "10/09/2019, 8:09am");
    createBinaryMarker(map, {lat: 30.599895, lng: -96.346062}, false, 111, "Penberthy Sports Complex", "10/09/2019, 8:09am");
    
//    createBinaryMarker(map, {lat: 30.649007, lng: -96.289159}, true, 112, "Cresent Pointe park", "10/09/2019, 8:09am");
//    createBinaryMarker(map, {lat: 30.622713, lng: -96.422067}, true, 113, "Linda Lake", "10/09/2019, 8:09am");
    
    
    var legend = document.getElementById('legend');
    for(var key in icons){
        var name = icons[key].name;
        var icon = icons[key].icon;
        var div = document.createElement('div');
        div.innerHTML= '<div style="margin:10px"><img src="img/' + icon + '"> ' + name + '</div>';
        legend.appendChild(div);
    }
    
    map.controls[google.maps.ControlPosition.LEFT_BOTTOM].push(legend);
    
    var i;
    for (i = 0 ; i < floodList.length ; i++){
        var floodplain = new google.maps.Polygon({
        path: floodList[i],
        strokeColor: '#00ccff',
        strokeOpacity: 0.5,
        strokeWeight: 2,
        fillColor: '#99ebff',
        fillOpacity: 0.25
    });
    
    floodplain.setMap(map);
    }

}

function createBinaryMarker(map, coord, isDry, sensorid,loc,time){
    var iconSrc;
    if(isDry){
        iconSrc = "img/green-icon.png"
    }else{
        iconSrc = "img/red-icon.png"
    }
    
    var marker = new google.maps.Marker({
        position: coord,
        map:map,
        icon: iconSrc,
        title: "Binary Sensor"
    });
    
    markers.push(marker);

    marker.addListener('click', function(){
        drawIndicator(this, map, isDry, sensorid, loc, time);
    });

}

function drawIndicator(marker, map, isDry, sensorid,loc,time){
    closeTooltips();
    var code = "";
    if(isDry){
        code = "<div style='float:left'; padding: 20px;><img src='img/green-light.png' alt='Safe flood levels' width='50' height='50'></div><div style='float:right; padding: 20px;'><b>Sensor ID: "+ sensorid + "</b><br/>" + loc + "<br/>" + time +"</div>"
    }else{
        code = "<div style='float:left'; padding: 20px;><img src='img/red-light.png' alt='Safe flood levels' width='50' height='50'></div><div style='float:right; padding: 20px;'><b>Sensor ID: "+ sensorid + "</b><br/>" + loc + "<br/>" + time + "</div>"
    }
    
    var infoWindow = new google.maps.InfoWindow({
        maxWidth:800,
        height:350,
        content: code
    });

    tooltips.push(infoWindow);
    infoWindow.open(map,marker);

}

function createGraphMarker(map, coord, isDry){
    var iconSrc;
    if(isDry){
        iconSrc= "img/blue-box-icon.png";
    }else{
        iconSrc= "img/red-box-icon.png";
    }
    
    var marker = new google.maps.Marker({
        position: coord,
        map:map,
        icon: iconSrc,
        title: "Timeseries Sensor"
    });

    markers.push(marker);
    marker.addListener('click', function(){
        drawChart(this, map);
    });

}

function closeTooltips(){
    //This for loop closes every other tooltip that is currently open.(if any)
    //This ensures that only one tooltip is opened at any given time.
    for(var i = 0 ; i < tooltips.length; i++){
        tooltips[i].setMap(null);
    }
    tooltips.length = 0;
}
        
function drawChart(marker, map){
        
        closeTooltips();
    
        var data1 = new google.visualization.DataTable();
        data1.addColumn('timeofday', "Time of Day");
        data1.addColumn('number', 'Flood level');

        data1.addRows([
            [[6,0,0], 100],
            [[6,30,0], 110],
            [[7,0,0], 100],
            [[7,30,0], 130],
            [[8,0,0], 130],
            [[8,30,0], 140],
            [[9,0,0], 150],
            [[9,30,0], 160],
            [[10,0,0], 140],
            [[10,30,0], 130],
            [[11,0,0], 110],
            [[11,30,0], 90],
            [[12,0,0], 80],
            [[12,30,0], 100],
            [[13,0,0], 120],
            [[13,30,0], 140],
            [[14,0,0], 140],
            [[14,30,0], 140],
            [[15,0,0], 150],
            [[15,30,0], 150],
            [[16,0,0], 170],
            [[16,30,0], 180],
            [[17,0,0], 190],
            [[17,30,0], 200],
            [[18,0,0], 210],
            [[18,30,0], 190],
            [[19,0,0], 180],
            [[19,30,0], 170],
            [[20,0,0], 160],
            [[20,30,0], 160],
            [[21,0,0], 150],
            [[21,30,0], 140],
            [[22,0,0], 140],
            [[22,30,0], 120],
            [[23,0,0], 110],
            [[23,30,0], 100],
        ])

    // Set chart options
    var options = {
        chart: {
        title: 'Flood levels in College Station center',
        subtitle: 'Flood level (inch) over time'
        },
        width: 500,
        height: 300
    };

    var node  = document.createElement('div');
    var infoWindow = new google.maps.InfoWindow({
        maxWidth:800,
        height:350
    });
    tooltips.push(infoWindow);
    var chart = new google.charts.Line(node);

    chart.draw(data1, options);
    infoWindow.setContent(node);
    infoWindow.open(map,marker);
}

function clearMarkers(val){
//    if val is 1, then we toggle the wet/dry sensor markers
//    if val is 2, then we toggle the time series sensor markers
    if(toggleSensor1){
        setMarkersOnMap(null, val);
        toggleSensor1 = false;
    }else{
        setMarkersOnMap(map, val);
        toggleSensor1 = true;
    }
    
}

function setMarkersOnMap(map, val){
    var str ;
    if(val == 1){
        str = "Binary Sensor";
    }else{
        str = "Timeseries Sensor";
    }
    
    for (var i = 0; i < markers.length; i++) {
        if(markers[i].title == str){
            markers[i].setMap(map);      
        }
    }
}

function treeView(className){
    var toggler = document.getElementsByClassName(className);
    var i;
    
    for(i = 0;i<toggler.length;i++){
        
        toggler[i].addEventListener("click", function(){
            this.parentElement.querySelector(".nested").classList.toggle("active");
        })
    }
}
