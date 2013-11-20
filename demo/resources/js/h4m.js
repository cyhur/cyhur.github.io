var map;
var directionsService;
var geocodeServie;

function getGeocode(address) {
    geocodeServie = new olleh.maps.Geocoder('T77FD54672E1161F');
    var mapOptions = {
        center: new olleh.maps.Coord(959996, 1946554),
        zoom: 5,
        mapTypeId: olleh.maps.MapTypeId.BASEMAP
    };
    map = new olleh.maps.Map(document.getElementById("canvas_map"), mapOptions);
    var GeocoderRequest = {
        addr: address,
        type: 0
    };
    geocodeServie.geocode(GeocoderRequest, "geocodeService_callback");
}

function geocodeService_callback(data) {
    var geocodeResult = geocodeServie.parseGeocode(data);

    var str_result = "";
    if (geocodeResult.count != "0") {
        var infoArr = geocodeResult.infoarr;
        /*for(var i=0; i< infoArr.length; i++){
			var marker = new olleh.maps.Marker({
			position: new olleh.maps.Coord(infoArr[i].x, infoArr[i].y),
			map: map,
			title:infoArr[i].address
			});
		}*/
        console.log(infoArr[0].address + "," + infoArr[0].x + "," + infoArr[0].y);
    } else {
        console.log("ERRRRRR");
    }
}

function getroute(o, d) {
    var mapOptions = {
        center: new olleh.maps.Coord(o.x, o.y),
        zoom: 10,
        mapTypeId: olleh.maps.MapTypeId.BASEMAP
    };
    map = new olleh.maps.Map(document.getElementById("canvas_map"), mapOptions);

    directionsService = new olleh.maps.DirectionsService('T77FD54672E1161F');
    var DirectionsRequest = {
        origin: new olleh.maps.Coord(o.x, o.y),
        destination: new olleh.maps.Coord(d.x, d.y),
        projection: olleh.maps.DirectionsProjection.UTM_K,
        travelMode: olleh.maps.DirectionsTravelMode.DRIVING,
        priority: olleh.maps.DirectionsDrivePriority.PRIORITY_0
    };
    directionsService.route(DirectionsRequest, "directionsServiceRender_callback");
}

function directionsServiceRender_callback(data) {
    var directionsResult = directionsService.parseRoute(data);
    var DirectionsRendererOptions = {
        directions: directionsResult,
        map: map,
        keepView: true,
        offMarkers: false,
        offPolylines: false
    };
    var DirectionsRenderer = new olleh.maps.DirectionsRenderer(DirectionsRendererOptions);
    DirectionsRenderer.setMap(map);
}

function directionsService_callback(data) {
    var directionsResult = directionsService.parseRoute(data);
    //console.debug(directionsResult);
    var result = directionsResult.result;
    var no = directionsResult.no;
    if (result !== null) {
        var total_di = result.total_distance.value;
        var total_du = result.total_duration.value;

        console.debug(no + ", " + total_di + "," + total_du);

    } else {
        console.debug("ERRRR," + getTimestamp());
    }
}

function getTimestamp() {
    var d = new Date();
    var mon = d.getMonth() + 1;
    return d.getFullYear() + "0" + mon + "" + d.getDate() + "" + d.getHours() + "" + d.getMinutes() + "" + d.getSeconds();
}

function sleep(ms) {
    var start = new Date().getTime(),
        expire = start + ms;
    while (new Date().getTime() < expire) {}
    return;
}




function getroutefrom() {
  $.ajax({
        type: "GET",
        url: "http://127.0.0.1:1337/getroute",
        dataType: "jsonp",
    data: { s : 'h01',
           d: 'h02'
    },
        success: function (data) {
            
            //for (var i = 0; i < data.length; i++) {
                //$.each( data, function( key, val ) {
                getroute(data.o, data.d);
                //});
           // }

        }
    });
    
}




function gethospital(qf) {
  var self = this;
        $.ajax({
        type: "GET",
        url: "http://127.0.0.1:1337/gethospital",
          data : {fvector:qf},
        dataType: "jsonp",
        success: function (data) {
            self.hlist = data;
            for (var i = 0; i < data.length; i++) {
                //$.each( data, function( key, val ) {
                display_hospital(data[i]);
                //});
            }

        }
    });
    return self.hlist;
}
function qfasString(qf) {
    q0 = '<img src="q0b.png" height="10px">'
    q1 = '<img src="q1b.png" height="10px">'
    q2 = '<img src="q2b.png" height="10px">'
    q3 = '<img src="q3b.png" height="10px">'
    q4 = '<img src="q4b.png" height="10px">'
    q5 = '<img src="q5b.png" height="10px">'
  //[7,24,22,105,29,31]
  //impression  service process popularity  environment professional
  return q0+qf[0] +  ', '+q1+qf[1] +', '+q2+qf[2] +q3+qf[3] +', '+q4+qf[4] +', '+q5+qf[5];
}
function display_hospital(hdata) {
    var contentString = "";

    var contentString2 = '<div class="m_window"> <div class="m_h_meta"> <ul class="m_h_meta_ul"> <li class="m_h_name">' + hdata.hname_eng + '</li> <li class="m_h_name2"></li> <li class="m_h_name2">' + hdata.addr_eng + '</li>'+
    ' <li class="m_h_name2">'+qfasString(hdata.qf)+'</li><li class="m_h_name2"><a href="#two">Trend graph</a></li> '+
    '<li class="m_h_name2"><a href="#route">Route</a></li> </ul> </div></div> ';


    var infowindow = new olleh.maps.InfoWindow({
        content: contentString2,
        maxWidth: 260
    });


    var marker = new olleh.maps.Marker({
        position: new olleh.maps.Coord(hdata.x, hdata.y),
        map: global_map,
        title: hdata.hname
    });

    olleh.maps.event.addListener(marker, 'click', function () {
        infowindow.open(global_map, marker);
    });

}
var global_map;

function init() {
    var mapOptions = {
        center: new olleh.maps.Coord(952298.70, 1945481.52),
        //center: new olleh.maps.Coord(h01[0], h01[1]),
        zoom: 7,
        mapTypeId: olleh.maps.MapTypeId.BASEMAP
    };
    global_map = new olleh.maps.Map(document.getElementById("canvas_map"), mapOptions);

    gethospital();
    //getroutefrom();
  $("#btnQf").click(function(e){
    var qfstatus =    $('input[type="checkbox"]').filter('.custom').map(function(){
      return $(this).is(':checked') ? 1 : 0;
    });
    console.log("qf");console.log(qfstatus[0]);
    
    //gethospital(qfstatus);
  });
//  $("#btnRoute").click(function(e){
    /*var routestatus =    $('input[type="checkbox"]').filter('.route').map(function(){
      return $(this).is(':checked') ? 1 : 0;
    });
    console.log("r");console.log(routestatus);*/
//  });
  
}