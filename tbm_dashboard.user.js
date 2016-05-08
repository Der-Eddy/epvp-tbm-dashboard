// ==UserScript==
// @name        TBM Dashboard
// @description TBM Stat Dashboard
// @namespace   Elitepvpers
// @include     *//www.elitepvpers.com/theblackmarket/*
// @downloadURL https://github.com/Der-Eddy/epvp-tbm-dashboard/raw/master/tbm_dashboard.user.js
// @author      Der-Eddy
// @license     GNU General Public v3 <http://www.gnu.org/licenses/>
// @version     1.2b1
// @grant       none
// @require     https://cdnjs.cloudflare.com/ajax/libs/Chart.js/2.1.2/Chart.bundle.min.js
// ==/UserScript==

/*
    Copyright (C) 2016 Eduard Nikoleisen (Der-Eddy)

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

(function($){
  var hash = window.location.hash;
  var tbmapi = $('a[href*="type=all"]').attr('href');
  //console.log(hash);
  //console.log(tbmapi);
  
  //$("td.cbbg:eq(2)").prepend('<div class="cb2h"><img src="https://www.elitepvpers.com/images/tbm/trades.gif" style="float:left" alt="" height="16" width="16"> &nbsp; <a href="https://www.elitepvpers.com/theblackmarket/api/paymentwall/#dashboard" rel="nofollow">TBM Dashboard</a></div>');
  $('a[href*="https://www.elitepvpers.com/theblackmarket/namechange/"]').parent().parent().prepend('<div class="cb2h"><img src="https://www.elitepvpers.com/images/tbm/trades.gif" style="float:left" alt="" height="16" width="16"> &nbsp; <a href="https://www.elitepvpers.com/theblackmarket/api/paymentwall/#dashboard" rel="nofollow">TBM Dashboard</a></div>');
  
  if(hash == "#dashboard"){
    document.title = "TBM Dashboard";
    $("td.contentwhite").empty();
    
    if(typeof tbmapi == "undefined"){
      $("td.contentwhite").append('You must set a <a href="https://www.elitepvpers.com/theblackmarket/api/secretword/">TBM API secretword</a> (to anything you want)');
    } else {
      $("td.contentwhite").append('Loading ... <img src="https://www.elitepvpers.com/forum/images/misc/progress.gif">');


      $.ajax({url:tbmapi,type:"GET",dataType:"json", success:function(jdata)
              {
                $("td.contentwhite").empty();
                $("td.contentwhite").append('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>Total TBM Dashboard</h2></td></tr></tbody></table></div><div class="cwalt"></div>');
                $("td.contentwhite").append('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>Last Month TBM Dashboard</h2></td></tr></tbody></table></div><div class="cwalt"></div>');
                $("td.contentwhite").append('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>Graphical Analysis (DEMO)</h2></td></tr></tbody></table></div><div class="cwalt"></div>');
                $("td.contentwhite").append('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>About</h2></td></tr></tbody></table></div><div class="cwalt"></div>');

                
                var userid = tbmapi.match(/u=(\d+)/);
                //console.log(userid);
                userid = userid[1];
                var r = 0; 
                var s = 0;
                var rmonth = 0;
                var smonth = 0;
                var hr=0;
                var hrobj;
                var hs = 0;
                var hsobj;
                var d = new Date();
                d.setMonth(d.getMonth() - 1);
                d.setHours(0,0,0);
                var date = d/1000|0;

                for(var i=0;i<jdata.length;i++)
                {
                  if(parseInt(jdata[i].eg_from) == userid)
                  {
                    s+=parseInt(jdata[i].amount);
                    if(parseInt(jdata[i].amount) > hs){ hs = parseInt(jdata[i].amount); hsobj = jdata[i] }
                    if(parseInt(jdata[i].dateline) > date){ smonth+=parseInt(jdata[i].amount); }
                  }else{
                    r+=parseInt(jdata[i].amount);
                    if(parseInt(jdata[i].amount) > hr){ hr = parseInt(jdata[i].amount); hrobj = jdata[i] }
                    if(parseInt(jdata[i].dateline) > date){ rmonth+=parseInt(jdata[i].amount); }
                  }
                } 

                $("div.cwalt:eq(0)").append('Received: <span class="green">' + r + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
                $("div.cwalt:eq(0)").append('Sent: <span class="red">' + s + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
                $("div.cwalt:eq(0)").append('<br>Highest amount received: <span class="green">' + hrobj.amount + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> from ' + hsobj.eg_tousername + '<br>');
                $("div.cwalt:eq(0)").append('Highest amount sent: <span class="red">' + hsobj.amount + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> to ' + hsobj.eg_tousername + '<br>');

                $("div.cwalt:eq(1)").append('Received last month: <span class="green">' + rmonth + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
                $("div.cwalt:eq(1)").append('Sent last month: <span class="red">' + smonth + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');

                //$("div.cwalt:eq(2)").append('<canvas id="tbmchart" height="200"></canvas>');
                
                $("div.cwalt:eq(3)").append('Created by <a href="https://www.elitepvpers.com/forum/members/984054-der-eddy.html"><span style="color: green;">Der-Eddy</span></a> and released under <a href="http://www.gnu.org/licenses/">GNU General Public License v3</a> on <a href="https://github.com/Der-Eddy/epvp-tbm-dashboard">GitHub</a><br>');
                $("div.cwalt:eq(3)").append('<a href="https://www.elitepvpers.com/forum/coding-releases/4059303-elite-gold-dashboard-deine-elite-gold-statistik.html">Elitepvpers Thread about this Project</a><br>');
                $("div.cwalt:eq(3)").append('Donate with <a href="https://www.elitepvpers.com/theblackmarket/sendeg/984054">elite*gold</a> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> or via Bitcoin <i>33vL2Cv4bwDPDUgahcurng5ey35ditqBZc</i><br>');
                $("div.cwalt:eq(3)").append('<br>Donation List:<ul><li>Be the first!</li></ul>');
                
                var ctx = document.getElementById("tbmchart");
                var tbmChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        datasets: [{
                            label: 'elite*gold earned',
                            borderColor: "rgba(0,205,0,1)",
                            backgroundColor: "rgba(0,205,0,0.3)",
                            lineTension: 0,
                            fill: true,
                            data: [12, 19, 3, 5, 2, 3]
                        },{
                            label: 'elite*gold spent',
                            borderColor: "rgba(255,0,0,1)",
                            backgroundColor: "rgba(255,0,0,0.3)",
                            lineTension: 0,
                            fill: true,
                            data: [2, 9, 1, 0, 4, 10]
                        }]
                    },
                    options: {
                        responsive: true
                    }
                });
              }
      });
    }
  }
})(jQuery);