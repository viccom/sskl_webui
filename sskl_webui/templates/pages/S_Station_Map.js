<script type="text/javascript">
	var map = new BMap.Map("l-map");
	map.centerAndZoom("广州市", 10);
	map.enableScrollWheelZoom();

	var opts = {
		width : 250,     // 信息窗口宽度
		height: 145,     // 信息窗口高度
		//title : "设备信息" , // 信息窗口标题
		enableMessage:true//设置允许信息窗发送短息
	};
	function addClickHandler(content,marker){
		marker.addEventListener("click",function(e){
			openInfo(content,e)}
		);
	}
	function openInfo(content,e){
		var p = e.target;
		var point = new BMap.Point(p.getPosition().lng, p.getPosition().lat);
		var infoWindow = new BMap.InfoWindow(content,opts);  // 创建信息窗口对象
		map.openInfoWindow(infoWindow,point); //开启信息窗口
	}



$(function(){
	console.log(parseInt($(window).height())-86);
	console.log($(document.body).height());
	console.log(parseInt($('div.main-container').offsetHeight));
	$('#l-map').height(parseInt($(window).height())-86);
	$(window).resize(function() {
	  $('#l-map').height(parseInt($(window).height())-86);
	});
    $("#footerandfooter").remove();
    var dataurl = "/api/method/tieta.tieta.doctype.cell_station.cell_station.list_station_map";
    $.ajax({url:dataurl,async:true,success:function(r){
        //console.log(r.exc);

        //################################################
        if(!r.exc) {
				if(r._server_messages)
					console.log(r._server_messages);
				else {
					var markers = [];
					var stations = r.message;
					for (var cs in stations) {
						pt = new BMap.Point(stations[cs].longitude, stations[cs].latitude);
						var myIcon = new BMap.Icon("/files/cell_station_icon.png", new BMap.Size(32,32));
						var marker = new BMap.Marker(pt,{icon:myIcon});
						var gourl = "/S_Station_infox/"+stations[cs].name;
						var content = "<div class='widget-box'><div class='widget-header'><h4 class='widget-title'>"+ stations[cs].station_name +"</h4><div class='widget-toolbar'></div></div><div class='widget-body'><div class='widget-main'><div><a class='header smaller lighter black' style='text-decoration:none;' href='/S_Station_infox/"+ stations[cs].name +"'>" + "<p> 编号 : " + stations[cs].code + "</p>" +"<p> 地址 : " + stations[cs].address_text + "</p></a></div></div></div></div>"
							addClickHandler(content, marker);
						markers.push(marker);
					}
					//最简单的用法，生成一个marker数组，然后调用markerClusterer类即可。
					var markerClusterer = new BMapLib.MarkerClusterer(map, {markers: markers});
				}
			}

        //################################################

            }});
        });

</script>
