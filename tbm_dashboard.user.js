// ==UserScript==
// @name        TBM Dashboard
// @description TBM Stat Dashboard
// @namespace   Elitepvpers
// @include     *//www.elitepvpers.com/theblackmarket/*
// @downloadURL https://github.com/Der-Eddy/epvp-tbm-dashboard/raw/master/tbm_dashboard.user.js
// @author      Der-Eddy
// @license     GNU General Public v3 <http://www.gnu.org/licenses/>
// @version     1.0b3
// @grant       none
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

  $("td.cbbg:eq(2)").prepend('<div class="cb2h"><img src="https://www.elitepvpers.com/images/tbm/trades.gif" style="float:left" alt="" height="16" width="16"> &nbsp; <a href="https://www.elitepvpers.com/theblackmarket/api/paymentwall/#dashboard" rel="nofollow">TBM Dashboard</a></div>');

  if(hash == "#dashboard"){
    document.title = "TBM Dashboard";
    $("td.contentwhite").empty();
    $("td.contentwhite").append('<div><div class="cw1h"></div><div class="cwhead"><table border="0" cellpadding="0" cellspacing="0" width="100%"><tbody><tr><td><h2>TBM Dashboard</h2></td></tr></tbody></table></div><div class="cwalt"></div>');

    $.ajax({url:tbmapi,type:"GET",dataType:"json", success:function(jdata)
            {
              var userid = tbmapi.match(/u=(\d+)/);
              //console.log(userid);
              userid = userid[1];
              var r=0;
              var s=0;
              var hr=0;
              var hrobj;
              var hs = 0;
              var hsobj;
              for(var i=0;i<jdata.length;i++)
              {
                if(parseInt(jdata[i].eg_from) == userid)
                {
                  s+=parseInt(jdata[i].amount);
                  if(parseInt(jdata[i].amount) > hs){ hs = parseInt(jdata[i].amount); hsobj = jdata[i]}
                }else{
                  r+=parseInt(jdata[i].amount);
                  if(parseInt(jdata[i].amount) > hr){ hr = parseInt(jdata[i].amount); hrobj = jdata[i]}
                }
              }

              $("div.cwalt").append('Received: <span class="green">' + r + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');
              $("div.cwalt").append('Sent: <span class="red">' + s + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"><br>');

              $("div.cwalt").append('<br>Highest amount received: <span class="green">' + hrobj.amount + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> from ' + hsobj.eg_tousername + '<br>');
              $("div.cwalt").append('Highest amount sent: <span class="red">' + hsobj.amount + '</span> <img src="https://www.elitepvpers.com/images/tbm/gold.gif"> to ' + hsobj.eg_tousername + '<br>');
            }
    });
  }
})(jQuery);