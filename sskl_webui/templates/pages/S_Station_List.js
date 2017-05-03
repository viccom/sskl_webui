		<script type="text/javascript">
			$(document).ready(function() {

				$('#example').DataTable( {
					"dom": 'lfrtp',
					//"bInfo" : false,
					//"pagingType": "full_numbers" ,
					"ajax": {
						//"url": "/api/method/tieta.tieta.doctype.cell_station.cell_station.search_station?rgn=RGN000023",
						"url": "/api/method/tieta.tieta.doctype.cell_station.cell_station.list_station_map",
						"dataSrc":"message",
                    },
					"columns": [
										{ "data": "code" },
										{ "data": "station_name" },
										{ "data": "station_type" },
										{ "data": "address_text" },


									]


				} );

				var table = $('#example').DataTable();
				    $('#example tbody').on('click', 'tr', function () {
						var data = table.row( this ).data();
						console.log(data['name']);
						window.location.href="/S_Station_infox/"+data['name'];
						//alert( 'You clicked on '+data[0]+'\'s row' );
                        //href="/S_Station_infox/"+data['name'],/S_Station_infox/CELL00000002


					} );

					if ((screen.width<=500) && (screen.height<=800)) {
						console.log('移动设备：',screen.width,'*',screen.height);
/*				$('#example').DataTable( {
					bLengthChange: false,
					    "language": {
                            "info": "",
                            "paginate": {
                                "previous": "<<",
                                "next": ">>"
                            },
                        }
				});*/
						//table.column(2).visible(false);
						//table.column(3).visible(false);
					} else {
						console.log('桌面设备：',screen.width,'*',screen.height);

					}


			} );
		</script>