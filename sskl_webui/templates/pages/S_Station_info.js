<script>
        var device_total = {{vsn|length}};
        var current_dev = 0;
        var symlinkdev = "{{sn}}";
        var vdevices = {{vsn}};
        var refflag = 0;
        var Battery_No = { value: "null" };
        var Env_Temp = { value: "null" };
        var gatewaytime = { value: "null" };
        var symts = {{symtagsjson}};
        var tagsjson = {{tagsjson}};
        var batterypack_count = {{batterypack_count}};
        var batterypack = {{batterypack}};
        //console.log(tagsjson);
        //console.log(batterypack_count);
        //console.log(batterypack);

        //获取随机数函数
        function GetRandomNum(Min,Max)
        {
            var Range = Max - Min;
            var Rand = Math.random();
            return(Min + Math.round(Rand * Range));
        }

        //UTC转本地时间格式（24小时格式）
        function utctolocaltime(tm){
            var unixTimestamp = new Date(parseInt(tm/1000)*1000);
            var commonTime = unixTimestamp.toLocaleString('chinese',{hour12:false});
            return commonTime;
        }

	    //解析URL的函数
        function parseURL(url) {
             var a =  document.createElement('a');
             a.href = url;
             return {
             source: url,
             protocol: a.protocol.replace(':',''),
             host: a.hostname,
             port: a.port,
             query: a.search,
             params: (function(){
                 var ret = {},
                     seg = a.search.replace(/^\?/,'').split('&'),
                     len = seg.length, i = 0, s;
                 for (;i<len;i++) {
                     if (!seg[i]) { continue; }
                     s = seg[i].split('=');
                     ret[s[0]] = s[1];
                 }
                 return ret;
             })(),
             file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
             hash: a.hash.replace('#',''),
             path: a.pathname.replace(/^([^\/])/,'/$1'),
             relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
             segments: a.pathname.replace(/^\//,'').split('/')
             };
            }

        //获取实时数据的函数
         function GetRtvalue(vueobj, sn, vsn)
        {
            if(vsn){
                var dataurl = "/api/method/iot.hdb.iot_device_data?sn="+sn+"&vsn="+vsn;
            }
            else{
                var dataurl = "/api/method/iot.hdb.iot_device_data?sn="+sn;
            }
            //console.log(dataurl);
            $.ajax({url:dataurl,async:true,success:function(r)
            {
                //console.log(r);
                var arr=r.message;

                //################################################
                //console.log(symts.tags);
                var bb = batterypack[current_dev];
                var tagprelen = 0;
                if(vsn && bb.hasOwnProperty('groupname')){
                    tagprelen = batterypack[current_dev]['groupname'].length+1
                }
                //console.log(tagprelen);
                $.each(arr, function (i, v) {
                    if(tagprelen){
                        var ii = i.substring(tagprelen).replace(/\./g, "_");
                        //console.log(ii);
                    }
                    else{
                        var ii = i.replace(/\./g, "_");
                    }


                    function setvmvalue(vueobj)
                    {
                         if(ii=='Tenv'){
                             Env_Temp.value = v.PV;
                         }
                         else if(ii=='BNo'){
                             Battery_No.value = v.PV;
                         }
                         else if(ii=='KnUptime'){
                             //console.log(v.TM);
                             gatewaytime.value = utctolocaltime(v.TM);
                         }

                        vueobj.RTvalue[ii].value = v.PV;


                          if(v.Q=='1'){
                              vueobj.RTvalue[ii].isA = true;
                              vueobj.RTvalue[ii].isB = false;
                              vueobj.RTvalue[ii].isC = false;
                              vueobj.RTvalue[ii].isD = false;
                          }
                          else if(v.Q=='0'){
                              vueobj.RTvalue[ii].isA = false;
                              vueobj.RTvalue[ii].isB = false;
                              vueobj.RTvalue[ii].isC = true;
                              vueobj.RTvalue[ii].isD = false;
                          }
                          else if(v.Q=='256'){
                              vueobj.RTvalue[ii].isA = false;
                              vueobj.RTvalue[ii].isB = false;
                              vueobj.RTvalue[ii].isC = false;
                              vueobj.RTvalue[ii].isD = true;
                          }
                          else{
                              vueobj.RTvalue[ii].isA = false;
                              vueobj.RTvalue[ii].isB = true;
                              vueobj.RTvalue[ii].isC = false;
                              vueobj.RTvalue[ii].isD = false;
                          }
                    }

                    if(vsn) {
                        for (var i = 0; i < tagsjson.tags.length; i++) {
                            if (tagsjson.tags[i].name == ii) {
                                setvmvalue(vueobj);
                            }
                        }
                    }
                    else{
                        for(var i=0;i<symts.tags.length;i++){
                            nm = symts.tags[i].name.replace(/\./g, "_");
                         if(nm==ii){
                             //console.log(symts.tags[i].name);
                            setvmvalue(vueobj);
                         }
                        }
                    }
                });


                //################################################

            },
                error : function() {
            console.log("SN或VSN错误");
            if(refflag){
                window.clearInterval(refflag);
            }

        }
            });
        }

        //生成本地时间格式的函数
        Date.prototype.Format = function(fmt)
        { //author: meizz
            var o = {
                "M+" : this.getMonth()+1,                 //月份
                "d+" : this.getDate(),                    //日
                "h+" : this.getHours(),                   //小时
                "m+" : this.getMinutes(),                 //分
                "s+" : this.getSeconds(),                 //秒
                "q+" : Math.floor((this.getMonth()+3)/3), //季度
                "S"  : this.getMilliseconds()             //毫秒
            };
            if(/(y+)/.test(fmt))
                fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));
            for(var k in o)
                if(new RegExp("("+ k +")").test(fmt))
                    fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));
            return fmt;
        }

        //执行函数
       function executeJs() {
            try {
                window.vm.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
                window.vm.value = GetRandomNum(1,50);
                if(symlinkdev){
                    GetRtvalue(window.vm, symlinkdev, batterypack[current_dev]['vsn']);
                    GetRtvalue(window.symvm, symlinkdev);
                }

                //console.log(vdevices);
            } catch (e) {}
            return false;
        }

        $(function(){
            //判断当前URL设置页面中的哪一个菜单被激活
            var myURL = parseURL(document.referrer);
            //var y = $("ul.breadcrumb").children().last().text();
            mypath = myURL.path.split("/");
            //console.log(mypath);
            if(mypath[1]=='S_Station_List'){
                $("ul.breadcrumb").children().last().remove();
                $("ul.breadcrumb").append('<li><a href="/'+mypath[1]+'">{{_('S_Station_List')}}</a></li>');
                $("ul.breadcrumb").append('<li class="active">{{ doc.station_name }}</li>');
            }
            else if(mypath[1]=='S_Station_Map'){
                $("ul.breadcrumb").children().last().remove();
                $("ul.breadcrumb").append('<li><a href="/'+mypath[1]+'">{{_('S_Station_Map')}}</a></li>');
                $("ul.breadcrumb").append('<li class="active">{{ doc.station_name }}</li>');
            }
            else{
                $("ul.breadcrumb").append('<li class="active">{{ doc.station_name }}</li>');
            }

            if(mypath[1]=="S_Station_List"){
                console.log($("ul.nav-list li:eq(0) a").attr("href"));
                $("ul.nav-list li:eq(0)").addClass('active');
            }
            else if(mypath[1]=="S_Station_Map"){
                console.log($("ul.nav-list li:eq(1) a").attr("href"));
                $("ul.nav-list li:eq(1)").addClass('active');
            }
            //判断当前URL设置页面中的哪一个菜单被激活

            //定义显示模板中设备点表的VUE变量
            var vm = new Vue({
                el: '#vm',
                data: {
                    time: new Date().Format("yyyy-MM-dd hh:mm:ss"),
                    gatewaytime: gatewaytime,
                    B_No: Battery_No,
                    E_Temp: Env_Temp,

                    RTvalue: {
                        {% for tag in tags.tags %}
                            {{tag.name}}:{value: 'null',isA:false,isB:false,isC:false,isD:false},
                        {% endfor %}
                        },
                        styleA:{
                            color:'red'
                                },
                        styleB:{
                            color:'blue'
                        },
                        styleC:{
                            color:'green'
                        },
                        styleD:{
                            color:'brown'
                        }

                }
            });
            window.vm = vm;
            //定义显示模板中设备点表的VUE变量

            //定义显示模板中网关点表的VUE变量
            var symvm = new Vue({
                el: '#symvm',
                data: {
                    RTvalue: {
                        {% for tag in symtags.tags %}
                            {{ tag.name|replace('.', '_', 2) }}:{value: 'null',isA:false,isB:false,isC:false,isD:false},
                        {% endfor %}
                        },

                        styleA:{
                            color:'red'
                                },
                        styleB:{
                            color:'blue'
                        },
                        styleC:{
                            color:'green'
                        },
                        styleD:{
                            color:'brown'
                        }
                }
            });
            window.symvm = symvm;
            //定义显示模板中网关点表的VUE变量

            executeJs();
            refflag = setInterval(executeJs,5000);

            if(batterypack_count<=1){
                $("a.left").hide();
                $("a.right").hide();
            }
            else if(current_dev==0){
                $("a.left").hide();
                $("a.right").show();
            }

          //点击左边的箭头图标
          $("a.left").click(function(){
            if(current_dev==0){
                console.log(current_dev);
            }
            else{
                current_dev=current_dev-1;
                console.log(current_dev);
                executeJs();
                if(current_dev==0){
                    $("a.left").hide();
                    $("a.right").show();
                }
                else{
                    $("a.left").show();
                    $("a.right").show();
                }
            }
          });
            //点击左边的箭头图标

            //点击右边的箭头图标
          $("a.right").click(function(){
              if(current_dev==(batterypack_count-1)){
                console.log(current_dev);
            }
            else{
                current_dev=current_dev+1;
                console.log(current_dev);
                executeJs();
                if(current_dev<(batterypack_count-1)){
                $("a.left").show();
                $("a.right").show();
                }
                else if(current_dev==(batterypack_count-1)){
                    $("a.left").show();
                    $("a.right").hide();
                }

            }
          });
            //点击右边的箭头图标

            //点击数据显示的DIV
          $("div .device_datas").each(function(){
              $(this).click(function(){
              //window.open("http://baidu.com");
                  var tnm = $(this).attr("data-tagname");
                  var devsn = $(this).attr("data-devsn");
                  console.log(tnm,devsn);
                  //var tnmnew = tnm.replace(/\_/g, ".");
                  if(devsn=='vsn'){
                    var bb = batterypack[current_dev];
                    if(bb.hasOwnProperty('groupname')){
                        tnm = batterypack[current_dev]['groupname'] + "." + tnm;
                    }
                    dataurl = "/S_Tag_His?sn="+symlinkdev+"&vsn="+batterypack[current_dev]['vsn']+"&tag="+tnm.toLowerCase();
                  }
                  else{
                    dataurl = "/S_Tag_His?sn="+symlinkdev+"&tag="+tnm.toLowerCase();
                  }
                  console.log(dataurl);
                  window.open(dataurl);
/*                    $.ajax({url:dataurl,async:true,success:function(r){
                        console.log(r.message[0].series[0].values);
                    }});*/


              });
          });
            //点击数据显示的DIV
        });

</script>

