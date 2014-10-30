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
        tx.executeSql('CREATE TABLE IF NOT EXISTS gebruiker (firstname text, lastname text, email text, code text)');
 
        tx.executeSql("INSERT INTO gebruiker (firstname, lastname, email, code) VALUES (?,?)", ["Martin", "Siepkes", "martin.siepkes@quicknet.nl", "7aafaa3f-ff25-4a5a-91c6-753f30a5a03b"], function(tx, res) {
          alert("insertId: " + res.insertId + " -- probably 1");
          alert("rowsAffected: " + res.rowsAffected + " -- should be 1");

          db.transaction(function(tx) {
            tx.executeSql("select count(*) as cnt from gebruiker;", [], function(tx, res) {
              alert("res.rows.length: " + res.rows.length + " -- should be 1");
              alert("res.rows.item(0).cnt: " + res.rows.item(0).cnt + " -- should be 1");
            });
          }); 

        }, function(e) {
          alert("ERROR: " + e.message);
        });
      });
	  
	  alert('s1');
  
	  db.transaction(function(tx) {
		tx.executeSql("select firstname, lastname from gebruiker;", [], function(tx, res) {
		  if(res.rows.length > 0) { 
			alert("voornaam: " + res.rows.item(0).firstname);
			alert("achternaam: " + res.rows.item(0).lastname);
		  }
		});
	  });
	  
	  alert('s1');
	  
		$(document).on("pageshow","#aanmelden",function(){
			alert('aanmelden');
		});
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

