<script>
        device_total = {{vsn|length}};
        current_dev = 0;
        symlinkdev = "{{sn}}";
        vdevices = {{vsn}};
        refflag = 0;


        symts = {{symtagsjson}};
        tagsjson = {{tagsjson}};
        function GetRandomNum(Min,Max)
        {
            var Range = Max - Min;
            var Rand = Math.random();
            return(Min + Math.round(Rand * Range));
        }

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
                $.each(arr, function (i, v) {
                    var ii = i.replace(/\./g, "_");
                            //console.log(symts.tags.length);
                    function setvmvalue(vueobj)
                    {
                         vueobj.RTvalue[ii].value = v.PV;
                          if(v.Q=='1'){
                              vueobj.RTvalue[ii].isA = true;
                              vueobj.RTvalue[ii].isB = false;
                              vueobj.RTvalue[ii].isC = false;
                          }
                          else if(v.Q=='0'){
                              vueobj.RTvalue[ii].isA = false;
                              vueobj.RTvalue[ii].isB = false;
                              vueobj.RTvalue[ii].isC = true;
                          }
                          else{
                              vueobj.RTvalue[ii].isA = false;
                              vueobj.RTvalue[ii].isB = true;
                              vueobj.RTvalue[ii].isC = false;
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


       function executeJs() {
            try {
                window.vm.time = new Date().Format("yyyy-MM-dd hh:mm:ss");
                window.vm.value = GetRandomNum(1,50);
                if(symlinkdev){
                    GetRtvalue(window.vm, symlinkdev, vdevices[current_dev]);
                    GetRtvalue(window.symvm, symlinkdev);
                }

                //console.log(vdevices);
            } catch (e) {}
            return false;
        }

        $(function(){
            var myURL = parseURL(document.referrer);
            //var y = $("ul.breadcrumb").children().last().text();
            mypath = myURL.path.split("/");
            //console.log(mypath);
            if(mypath[1]=='S_Station_List'){
                $("ul.breadcrumb").children().last().remove();
                $("ul.breadcrumb").append('<li><a href="/'+mypath[1]+'">{{_('S_Station_List')}}</a></li>');
                $("ul.breadcrumb").append('<li class="active">{{Station_name}}</li>');
            }
            if(mypath[1]=='S_Station_Map'){
                $("ul.breadcrumb").children().last().remove();
                $("ul.breadcrumb").append('<li><a href="/'+mypath[1]+'">{{_('S_Station_Map')}}</a></li>');
                $("ul.breadcrumb").append('<li class="active">{{Station_name}}</li>');
            }

            if(mypath[1]=="S_Station_List"){
                console.log($("ul.nav-list li:eq(0) a").attr("href"));
                $("ul.nav-list li:eq(0)").addClass('active');
            }
            else if(mypath[1]=="S_Station_Map"){
                console.log($("ul.nav-list li:eq(1) a").attr("href"));
                $("ul.nav-list li:eq(1)").addClass('active');
            }


            var vm = new Vue({
                el: '#vm',
                data: {
                    time: new Date().Format("yyyy-MM-dd hh:mm:ss"),

                    RTvalue: {
                        {% for tag in tags.tags %}
                            {{tag.name}}:{value: 'null',isA:false,isB:false,isC:false},
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
                        }

                }
            });
            window.vm = vm;

            var symvm = new Vue({
                el: '#symvm',
                data: {
                    RTvalue: {
                        {% for tag in symtags.tags %}
                            {{ tag.name|replace('.', '_', 2) }}:{value: 'null',isA:false,isB:false,isC:false},
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
                        }
                }
            });
            window.symvm = symvm;

            executeJs();
            refflag = setInterval(executeJs,3000);

            if(device_total<=1){
                $("a.left").hide();
                $("a.right").hide();
            }
            else if(current_dev==0){
                $("a.left").hide();
                $("a.right").show();
            }



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
            }
          });

          $("a.right").click(function(){
              if(current_dev==(device_total-1)){
                console.log(current_dev);
            }
            else{
                current_dev=current_dev+1;
                console.log(current_dev);
                executeJs();
                if(current_dev<(device_total-1)){
                $("a.left").show();
                $("a.right").show();
                }
                else if(current_dev==(device_total-1)){
                    $("a.left").show();
                    $("a.right").hide();
                }

            }
          });


          $("div .profile-info-value").each(function(){
              $(this).click(function(){
              //window.open("http://baidu.com");
                  var tnm = $(this).attr("data-tagname");
                  //var tnmnew = tnm.replace(/\_/g, ".");
                  console.log(tnm);
              });
          });

        });

</script>

