// ==UserScript==
// @name        TBM Dashboard
// @description TBM Stat Dashboard
// @namespace   Elitepvpers
// @include     *//www.elitepvpers.com/theblackmarket/*
// @downloadURL https://github.com/Der-Eddy/epvp-tbm-dashboard/raw/master/tbm_dashboard.user.js
// @author      Der-Eddy
// @license     GNU General Public License v3 <http://www.gnu.org/licenses/>
// @version     1.2b8
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

    Chart.js is licensed under MIT: https://github.com/chartjs/Chart.js
*/
console.log(GM_info['scriptWillUpdate']);

Array.prototype.getDate = function() {
	return this.map(function (obj) {
		return new Date(obj * 1000); //WTF Javascript??
	});
};

(function($){
  var hash = window.location.hash;
  var tbmapi = $('a[href*="type=all"]').attr('href');
  console.log(hash);
  //console.log(tbmapi);

  //$("td.cbbg:eq(2)").prepend('<div class="cb2h"><img src="https://www.elitepvpers.com/images/tbm/trades.gif" style="float:left" alt="" height="16" width="16"> &nbsp; <a href="https://www.elitepvpers.com/theblackmarket/api/paymentwall/#dashboard" rel="nofollow">TBM Dashboard</a></div>');
  $('a[href*="www.elitepvpers.com/theblackmarket/namechange/"]').parent().parent().prepend('<div class="cb2h"><img src="https://www.elitepvpers.com/images/tbm/trades.gif" style="float:left" alt="" height="16" width="16"> &nbsp; <a href="https://www.elitepvpers.com/theblackmarket/api/paymentwall/#dashboard" rel="nofollow">TBM Dashboard</a></div>');

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
                $("td.contentwhite").append('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>Last 30 days TBM Dashboard</h2></td></tr></tbody></table></div><div class="cwalt"></div>');
                $("td.contentwhite").append('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>Graphical Analysis (DEMO)</h2></td></tr></tbody></table></div><div class="cwalt"></div>');
				$("td.contentwhite").append('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>elite*gold converter</h2></td></tr></tbody></table></div><div class="cwalt"></div>');
				$("td.contentwhite").append('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>About & Support</h2></td></tr></tbody></table></div><div class="cwalt"></div>');


                var userid = tbmapi.match(/u=(\d+)/);
                console.log(userid);
                userid = userid[1];
                var r = 0;
                var s = 0;
                var rmonth = 0;
                var smonth = 0;
                var amonth = 0;
                var hr=0;
                var hrobj;
                var hs = 0;
                var hsobj;
                var rchart = [];
                var schart = [];

                var dateobj = [];
                var dateamount = [];
                for (var i = 0; i < Math.min(jdata.length, 10); i++)
                {
                    dateobj.push(jdata[i].dateline);
                    dateamount.push(jdata[i].amount);
                }

                var dmonth = new Date();
                dmonth.setMonth(dmonth.getMonth() - 1);
                dmonth.setHours(0,0,0);
                var lastMonth = dmonth/1000|0;

                for(var i=0;i<jdata.length;i++)
                {
                  if(parseInt(jdata[i].eg_from) == userid)
                  {
                    s+=parseInt(jdata[i].amount);
                    if(parseInt(jdata[i].amount) > hs){ hs = parseInt(jdata[i].amount); hsobj = jdata[i]; }
                    if(parseInt(jdata[i].dateline) > lastMonth){ smonth+=parseInt(jdata[i].amount); amonth++; }
                  }else{
                    r+=parseInt(jdata[i].amount);
                    if(parseInt(jdata[i].amount) > hr){ hr = parseInt(jdata[i].amount); hrobj = jdata[i]; }
                    if(parseInt(jdata[i].dateline) > lastMonth){ rmonth+=parseInt(jdata[i].amount); amonth++; }
                  }
                }

                $("div.cwalt:eq(0)").append('Received: <span class="green">' + r + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
                $("div.cwalt:eq(0)").append('Sent: <span class="red">' + s + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
                $("div.cwalt:eq(0)").append('Total transactions: ' + jdata.length + '<br>');
                $("div.cwalt:eq(0)").append('<br>Highest amount received: <span class="green">' + hrobj.amount + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> from <a href="//www.elitepvpers.com/theblackmarket/profile/' + hrobj.eg_from + '">' + hrobj.eg_fromusername + '</a> (<a href="//www.elitepvpers.com/theblackmarket/transaction/' + hrobj.eg_transactionid + '">#' + hrobj.eg_transactionid + '</a>)<br>');
                $("div.cwalt:eq(0)").append('Highest amount sent: <span class="red">' + hsobj.amount + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> to <a href="//www.elitepvpers.com/theblackmarket/profile/' + hsobj.eg_to + '">' + hsobj.eg_tousername + '</a> (<a href="//www.elitepvpers.com/theblackmarket/transaction/' + hsobj.eg_transactionid + '">#' + hsobj.eg_transactionid + '</a>)<br>');

                $("div.cwalt:eq(1)").append('Received last month: <span class="green">' + rmonth + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
                $("div.cwalt:eq(1)").append('Sent last month: <span class="red">' + smonth + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
                $("div.cwalt:eq(1)").append('Transactions last month: ' + amonth + '<br>');

                //$("div.cwalt:eq(2)").append('<canvas id="tbmchart" height="200"></canvas>');
				$("div.cwalt:eq(2)").append('Demo deativated, sorry');

				$("div.cwalt:eq(3)").append('<div style="text-align: center;">Insert current exchange rate<br><br>10€ = <input id="ex_rate" size="5" type="text"> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"></div><br>');
				$("div.cwalt:eq(3)").append('<div style="text-align: center;">Converter<br><input id="euro" size="5" type="text" disabled> € <span style="font-size: 2em; margin: 10px;">&#8596</span> <input id="eg" size="5" type="text" disabled> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"></div><br>');

                $("div.cwalt:eq(4)").append('<img src="https://www.elitepvpers.com/images/tbm/trades.gif"> Your version: <i>' + GM_info['script']['version'] + '</i> | Current version: <i>' + 'n/a' + '</i> <a href="https://github.com/Der-Eddy/epvp-tbm-dashboard/raw/master/tbm_dashboard.user.js">(Instant Update)</a><br>');
                $("div.cwalt:eq(4)").append('<img src="https://www.elitepvpers.com/images/tbm/profile.gif"> Created by <a href="//www.elitepvpers.com/forum/members/984054-der-eddy.html"><span style="color: green;">Der-Eddy</span></a> and released under <a href="http://www.gnu.org/licenses/">GNU General Public License v3</a> on <a href="https://github.com/Der-Eddy/epvp-tbm-dashboard">GitHub</a><br>');
                $("div.cwalt:eq(4)").append('<img src="https://www.elitepvpers.com/images/tbm/middleman.gif"> <a href="//www.elitepvpers.com/forum/coding-releases/4059303-elite-gold-dashboard-deine-elite-gold-statistik.html">Elitepvpers Thread about this Project</a><br>');
                $("div.cwalt:eq(4)").append('<img src="https://www.elitepvpers.com/images/tbm/namechange.gif"> <a href="https://discord.gg/0ZbfSaE2dpVjIIBu">Discord Support Channel</a> (no registration needed) or send me a <a href="//www.elitepvpers.com/forum/private.php?do=newpm&u=984054">private message</a><br>');
                $("div.cwalt:eq(4)").append('<img src="https://www.elitepvpers.com/images/tbm/premium.gif"> Donate with <a href="//www.elitepvpers.com/theblackmarket/sendeg/984054">elite*gold</a> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> or via Bitcoin <a href="https://blockchain.info/de/address/33vL2Cv4bwDPDUgahcurng5ey35ditqBZc"><i>33vL2Cv4bwDPDUgahcurng5ey35ditqBZc</i></a><br>');
                $("div.cwalt:eq(4)").append('<br>Donation list:<ul><li><a href="//www.elitepvpers.com/forum/members/4232675-afrozilla.html"><span style="color: green;">Afrozilla</span></a> (93 elite*gold)</li><li><a href="//www.elitepvpers.com/forum/members/2074798-shura.html"><span style="color:#0099ff;">Shura</span></a> (1$)</li><li><a href="//www.elitepvpers.com/forum/members/5589432-dr-heisenberg.html"><span style="color:#0099ff;">Dr Heisenberg</span></a> (15 elite*gold)</li><li><a href="//www.elitepvpers.com/forum/members/5474128-anonymous-.html">Anonymous™</a> (25 elite*gold)</li><li><a href="//www.elitepvpers.com/forum/members/4000999--endlos.html">.ENDLOS</a> (100 elite*gold)</li></ul>');

				//e*gold converter
				$('#ex_rate').bind('input', function() {
					$('#euro').removeAttr('disabled');
				    $('#euro').val('');
				    $('#eg').removeAttr('disabled');
				    $('#eg').val('');
				});

				$('#euro').bind('input', function() {
				    $('#eg').val(Math.round((parseInt($('#ex_rate').val()) / 10) * parseInt($(this).val())));
				});

				$('#eg').bind('input', function() {
				    $('#euro').val(Math.round(((10 / parseInt($('#ex_rate').val())) * parseInt($(this).val())) * 100) / 100);
				});

				//canvas
                var ctx = document.getElementById("tbmchart");
                var tbmChart = new Chart(ctx, {
                    type: 'line',
                    data: {
                        //labels: ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
                        labels: dateobj.getDate(),
                        datasets: [{
                            label: 'elite*gold received',
                            borderColor: "rgba(0,205,0,1)",
                            backgroundColor: "rgba(0,205,0,0.3)",
                            lineTension: 0,
                            fill: true,
                            data: [12, 19, 3, 5, 2, 3]
                        },{
                            label: 'DEMO',
                            borderColor: "rgba(255,0,0,1)",
                            backgroundColor: "rgba(255,0,0,0.3)",
                            lineTension: 0,
                            fill: true,
                            data: [2, 9, 1, 0, 4, 10, 0, 5]
                        },{
                            label: 'DEMO',
                            borderColor: "rgba(255,150,0,1)",
                            backgroundColor: "rgba(255,150,0,0.3)",
                            lineTension: 0,
                            fill: true,
                            data: dateamount
                        }]
                    },
                    options: {
                        responsive: true
                    },
                    scales: {
                        yAxes: [],
                        xAxes: [{
                            type: 'time',
                            ticks: {
                                fontSize: 10,
                                maxRotation: 0,
                                maxTicksLimit: 8
                            },
                            time: {
                                unit: 'week',
								parse: true,
                                round: true,
                                format: true,
                                displayFormats: {
                                    'week': '[W]WW - YYYY' // Week 46, or maybe "[W]WW - YYYY" ?
                                },
                                min: new Date(dateobj[0] * 1000),
                                max: new Date(dateobj[-1] * 1000)
                            }
                        }]
                    }
                });
              }
      });
    }
  }
})(jQuery);
