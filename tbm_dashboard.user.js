// ==UserScript==
// @name        TBM Dashboard
// @description TBM Stat Dashboard
// @namespace   Elitepvpers
// @include     *//www.elitepvpers.com/theblackmarket/*
// @downloadURL https://github.com/Der-Eddy/epvp-tbm-dashboard/raw/master/tbm_dashboard.user.js
// @author      Der-Eddy
// @license     GNU General Public License v3 <http://www.gnu.org/licenses/>
// @version     1.3.0
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
//console.log(GM_info['scriptWillUpdate']);

Array.prototype.getDate = function() {
	return this.map(function (obj) {
		return new Date(obj * 1000); //WTF Javascript??
	});
};

(function($){
  var url = window.location.pathname;
  var lastbit = url.substring(url.indexOf('theblackmarket/')+15);
  var hash = window.location.hash;
  var tbmapi = $('a[href*="type=all"]').attr('href');
  //console.log(hash);
  //console.log(tbmapi);

  //$("td.cbbg:eq(2)").prepend('<div class="cb2h"><img src="https://www.elitepvpers.com/images/tbm/trades.gif" style="float:left" alt="" height="16" width="16"> &nbsp; <a href="https://www.elitepvpers.com/theblackmarket/api/paymentwall/#dashboard" rel="nofollow">TBM Dashboard</a></div>');
  $('a[href*="www.elitepvpers.com/theblackmarket/namechange/"]').parent().parent().prepend('<div class="cb2h"><img src="https://www.elitepvpers.com/images/tbm/trades.gif" style="float:left" alt="" height="16" width="16"> &nbsp; <a href="https://www.elitepvpers.com/theblackmarket/api/paymentwall/#dashboard" rel="nofollow">TBM Dashboard</a></div>');
  $('a[href*="www.elitepvpers.com/theblackmarket/treasures/"]').html('Treasures / Treasure Creator');

  if(hash == "#dashboard"){
	document.title = "TBM Dashboard";
	$("td.contentwhite").empty();

	if(typeof tbmapi == "undefined"){
	  $("td.contentwhite").append('You must set a <a href="https://www.elitepvpers.com/theblackmarket/api/secretword/">TBM API secretword</a> (to anything you want)');
	} else {
	  $("td.contentwhite").append('Loading ... <img src="https://www.elitepvpers.com/forum/images/misc/progress.gif">');


	  $.ajax({ url: tbmapi, type: 'GET', dataType: 'json', success: function (jdata)
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
				var hr = 0;
				var hrobj;
				var hs = 0;
				var hsobj;
				var rchart = [];
				var schart = [];
				var version;

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

				$("div.cwalt:eq(0)").append('Received: <span class="green">' + r.toLocaleString() + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
				$("div.cwalt:eq(0)").append('Sent: <span class="red">' + s.toLocaleString() + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
				$("div.cwalt:eq(0)").append('Total transactions: ' + jdata.length + '<br>');
				$("div.cwalt:eq(0)").append('<br>Highest amount received: <span class="green">' + parseInt(hrobj.amount).toLocaleString() + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> from <a href="//www.elitepvpers.com/theblackmarket/profile/' + hrobj.eg_from + '">' + hrobj.eg_fromusername + '</a> (<a href="//www.elitepvpers.com/theblackmarket/transaction/' + hrobj.eg_transactionid + '">#' + hrobj.eg_transactionid + '</a>)<br>');
				$("div.cwalt:eq(0)").append('Highest amount sent: <span class="red">' + parseInt(hsobj.amount).toLocaleString() + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> to <a href="//www.elitepvpers.com/theblackmarket/profile/' + hsobj.eg_to + '">' + hsobj.eg_tousername + '</a> (<a href="//www.elitepvpers.com/theblackmarket/transaction/' + hsobj.eg_transactionid + '">#' + hsobj.eg_transactionid + '</a>)<br>');

				$("div.cwalt:eq(1)").append('Received last month: <span class="green">' + parseInt(rmonth).toLocaleString() + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
				$("div.cwalt:eq(1)").append('Sent last month: <span class="red">' + parseInt(smonth).toLocaleString() + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
				$("div.cwalt:eq(1)").append('Transactions last month: ' + amonth + '<br>');

				//$("div.cwalt:eq(2)").append('<canvas id="tbmchart" height="200"></canvas>');
				$("div.cwalt:eq(2)").append('Demo deactivated, sorry');

				$("div.cwalt:eq(3)").append('<div style="text-align: center;">Insert current exchange rate<br><br><input id="ex_euro" size="5" value="10" type="text"> € = <input id="ex_rate" size="5" type="text"> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"></div><br>');
				$("div.cwalt:eq(3)").append('<div style="text-align: center;">Converter<br><input id="euro" size="5" type="text" disabled> € <span style="font-size: 2em; margin: 10px;">&#8596</span> <input id="eg" size="5" type="text" disabled> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"></div><br>');

				$.ajax({ url: 'https://raw.githubusercontent.com/Der-Eddy/epvp-tbm-dashboard/master/version.json', type: 'GET', dataType: 'json', success: function (jsonversion)
				{
					$("div.cwalt:eq(4)").append('<img src="https://www.elitepvpers.com/images/tbm/trades.gif"> Your version: <i>' + GM_info['script']['version'] + '</i> | Current version: <i>' + jsonversion.version + '</i> <a href="https://github.com/Der-Eddy/epvp-tbm-dashboard/raw/master/tbm_dashboard.user.js">(Instant Update)</a><br>');
					$("div.cwalt:eq(4)").append('<img src="https://www.elitepvpers.com/images/tbm/profile.gif"> Created by <a href="//www.elitepvpers.com/forum/members/984054-der-eddy.html"><span style="color: green;">Der-Eddy</span></a> and released under <a href="http://www.gnu.org/licenses/">GNU General Public License v3</a> on <a href="https://github.com/Der-Eddy/epvp-tbm-dashboard">GitHub</a><br>');
					$("div.cwalt:eq(4)").append('<img src="https://www.elitepvpers.com/images/tbm/middleman.gif"> <a href="//www.elitepvpers.com/forum/coding-releases/4059303-elite-gold-dashboard-deine-elite-gold-statistik.html">Elitepvpers Thread about this Project</a> | <a href="https://trello.com/b/6NaxsoVr/tbm-dahsboard">Trello Board (vote upcomming features!)</a><br>');
					$("div.cwalt:eq(4)").append('<img src="https://www.elitepvpers.com/images/tbm/namechange.gif"> <a href="https://discord.gg/0ZbfSaE2dpVjIIBu">Discord Support Channel</a> (no registration needed) or send me a <a href="//www.elitepvpers.com/forum/private.php?do=newpm&u=984054">private message</a><br>');
					$("div.cwalt:eq(4)").append('<img src="https://www.elitepvpers.com/images/tbm/premium.gif"> Donate with <a href="//www.elitepvpers.com/theblackmarket/sendeg/984054">elite*gold</a> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> or via Bitcoin <a href="https://blockchain.info/de/address/33vL2Cv4bwDPDUgahcurng5ey35ditqBZc"><i>33vL2Cv4bwDPDUgahcurng5ey35ditqBZc</i></a><br>');
					$("div.cwalt:eq(4)").append('<br>Donation list:<ul id="donation-list"></ul>');
					for (var name in jsonversion.donations){
						$("#donation-list").append('<li><a href="' + jsonversion.donations[name].url + '"><span style="' + jsonversion.donations[name].color + '">' + name + '</span></a> (' + jsonversion.donations[name].amount + ')</li>');
					}
				}});

				//e*gold converter
				$('#ex_rate').bind('input', function() {
					$('#euro').removeAttr('disabled');
					$('#euro').val('');
					$('#eg').removeAttr('disabled');
					$('#eg').val('');
				});

				$('#euro').bind('input', function() {
				  $('#eg').val(Math.round((parseInt($('#ex_rate').val()) / parseInt($('#ex_euro').val())) * parseFloat($(this).val().replace(',', '.'))));
				});

				$('#eg').bind('input', function() {
					$('#euro').val(Math.round(((parseInt($('#ex_euro').val()) / parseInt($('#ex_rate').val())) * parseInt($(this).val())) * 100) / 100);
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
} else if (lastbit == 'treasures/' && false) { //Currently disabled
	var form = $('form[action*="www.elitepvpers.com/theblackmarket/treasures/"]');
	document.title = "Treasures / Treasure Creator";
	form.find('tr:first').after('<tr><td><div style="cursor:help;" title="i.e. Treasure #1, Treasure #2, Treasure #3, ..."><input type="checkbox" name="checkTitle"> Add treasure number in title</div></td></tr>');
	form.find('tr:first').after('<tr><td><div>Amount</div><div><input name="amount" maxlength="85" size="40" value="1" min="1" max="50" type="number"></div></td></tr>');
	form.find('tr:last').empty();
	form.find('tr:last').after('<tr><td><input name="createtreasure" class="button" value="Create Treasures" id="treasurescript" type="submit"></td></tr>');
	form.parent().parent().after('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>Created Treasures</h2></td></tr></tbody></table></div><div class="cwalt" id="treasureTable"></div>');
	$('#treasureTable').append('<table class="stg_table tborder sortable"><thead class="thead" style="color: #FFFFFF; background: #1c1e20; border: 1px solid #1c1e20;"><tr><th> ID </th><th> Title </th><th> Cost </th><th> Link </th></tr></thead><tbody><tr class="alt2"><td>#328630 </td><td> TestTitle </td><td> 1337 </td><td> <a href="//www.elitepvpers.com/theblackmarket/treasure/328630" target="_blank">https://www.elitepvpers.com/theblack...reasure/328630</a></td></tr></tbody></table>');

	$('#treasurescript').click( function(e) {
		e.preventDefault();
		for (var i = 1; i<=parseInt(($('input[name*="amount"]').val())); i++)
		{
			if ($('input[name*="checkTitle"]').is(':checked') == true){
				treasureTitle = $('input[name*="title"]').val() + ' #' + i.toString();
			} else {
				treasureTitle = $('input[name*="title"]').val();
			}
			$.post( "//www.elitepvpers.com/theblackmarket/treasures/", { title: treasureTitle, content: $('textarea[name*="content"]').val(), cost: $('input[name*="cost"]').val(), createTreasure: 'Submit' }, function(response) {
				console.log(response);
			} );
		}
	});
} else if (lastbit.startsWith('profile/')) {
	pid = lastbit.substring(8); //amount of characters in profile/
	$("div.cwalt:eq(0)").after('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>Mutual Elite*gold Transactions</h2></td></tr></tbody></table></div><div class="cwalt" id="profiletog"></div>');
	if(typeof tbmapi == "undefined"){
		$("div#profiletog").append('You must set a <a href="https://www.elitepvpers.com/theblackmarket/api/secretword/">TBM API secretword</a> (to anything you want)');
	} else {
		$.ajax({ url: tbmapi, type: 'GET', dataType: 'json', success: function (jdata){
			$("div#profiletog").append('<h2 class="red">Sent</h2><table border="0" cellpadding="5" cellspacing="5" id="profilesent"><tr><td class="smallfont">ID / Link</td><td class="smallfont">Amount</td><td class="smallfont">Date / Comment</td></tr></table><h2 class="green">Received</h2><table border="0" cellpadding="5" cellspacing="5" id="profilerec"><tr><td class="smallfont">ID / Link</td><td class="smallfont">Amount</td><td class="smallfont">Date / Comment</td></tr></table>');

			for(var i=0;i<jdata.length;i++)
			{
				var id = jdata[i].eg_transactionid;
				var amount = jdata[i].amount + ' eg';
				var note = jdata[i].note;
				var date = new Date(jdata[i].dateline * 1000).toDateString();
				if(parseInt(jdata[i].eg_from) == pid)
			  	{
					$("table#profilerec").append('<tr><td><a href="//www.elitepvpers.com/theblackmarket/transaction/' + id + '">#' + id + '</td><td>' + amount + '</td><td><div class="smallfont gray" style="padding-bottom:5px;">' + date + '</div>' + note + '</td></tr>');
				} else if (parseInt(jdata[i].eg_to) == pid) {
					$("table#profilesent").append('<tr><td><a href="//www.elitepvpers.com/theblackmarket/transaction/' + id + '">#' + id + '</td><td>' + amount + '</td><td><div class="smallfont gray" style="padding-bottom:5px;">' + date + '</div>' + note + '</td></tr>');
			  	}
			}
		}});
	}
} else {
	console.log(lastbit);
}
})(jQuery);
