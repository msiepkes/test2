//var db = window.sqlitePlugin.openDatabase({name: "recheck"});
var _t = null; 
var _isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var Valid = null;
var _code = null;
var _url = 'http://64sws.symsys.nl/signalr';
var _questionid = null;



// Wait for Cordova to load
    document.addEventListener("deviceready", onDeviceReady, false);

    // Cordova is ready
    function onDeviceReady() {
      var db = window.sqlitePlugin.openDatabase({name: "DB"});

      db.transaction(function(tx) {
        tx.executeSql('DROP TABLE IF EXISTS test_table');
        tx.executeSql('CREATE TABLE IF NOT EXISTS test_table (id integer primary key, data text, data_num integer)');

        // demonstrate PRAGMA:
        db.executeSql("pragma table_info (test_table);", [], function(res) {
          alert("PRAGMA res: " + JSON.stringify(res));
        });

        tx.executeSql("INSERT INTO test_table (data, data_num) VALUES (?,?)", ["test", 100], function(tx, res) {
          alert("insertId: " + res.insertId + " -- probably 1");
          alert("rowsAffected: " + res.rowsAffected + " -- should be 1");

          db.transaction(function(tx) {
            tx.executeSql("select count(id) as cnt from test_table;", [], function(tx, res) {
              alert("res.rows.length: " + res.rows.length + " -- should be 1");
              alert("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
            });
          });

        }, function(e) {
          alert("ERROR: " + e.message);
        });
      });
	  
	  
		//$(document).on("pageshow","#home",function(){
			alert('home');
		//});
    }




 
$.fn.blink = function(options) {
	var defaults = {
		delay: 500
	};
	var options = $.extend(defaults, options);

	return this.each(function() {
		var obj = $(this);
		setInterval(function() {
			if ($(obj).css("visibility") == "visible") {
				$(obj).css('visibility', 'hidden');
			}
			else {
				$(obj).css('visibility', 'visible');
			}
		}, options.delay);
	});
};

