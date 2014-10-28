var db = window.sqlitePlugin.openDatabase("recheck.db", "1.0", "recheck", 2 * 1024 * 1024);
var _t = null; 
var _isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var Valid = null;
var _code = null;
var _url = 'http://64sws.symsys.nl/signalr';
var _questionid = null;


document.addEventListener("deviceready", function() {     
	  db.transaction(function(tx) { 
		  tx.executeSql('CREATE TABLE IF NOT EXISTS gebruiker (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, firstname TEXT NOT NULL DEFAULT, lastname TEXT NOT NULL DEFAULT, code TEXT NOT NULL DEFAULT, email TEXT NOT NULL DEFAULT)');
	
		  tx.executeSql("INSERT INTO gebruiker (firstname, lastname, code, email) VALUES (?,?,?,?)", ['Martin', 'Siepkes', '7aafaa3f-ff25-4a5a-91c6-753f30a5a03b', 'martin.siepkes@quicknet.nl'], function (tx, res) {}, function(e) {
				///alert("ERROR: " + e.message);
		  });
	
		  tx.executeSql('CREATE TABLE IF NOT EXISTS accesslog (id INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT, client TEXT NOT NULL DEFAULT, datum DATETIME NOT NULL DEFAULT, geweigerd BIT NOT NULL DEFAULT 0, telaat BIT NOT NULL DEFAULT 0, toegestaan BIT NOT NULL DEFAULT 0)');
	  });
	   
	//navigator.vibrate([500, 200, 500]);
	//alert('test');
	//window.plugin.notification.local.add({ message: 'Great app!', autoCancel: true });
}, false);
 
 
$(document).on("pageshow","#home",function(){
	if($('#home').attr('isLoaded') == null) {
		$.connection.hub.url = _url;  
        Valid = $.connection.valid;     
		
		if($.connection.hub.__proto__.__proto__ == null) {
			alert('server offline');
			return;
        } else { 
            Valid.client.returnWelcomeMessage = function (message) {
                $('#existinguser').html(message);
            }
            
			Valid.client.askClient = function (customername, questionid) {                
                var now = new Date();
				_questionid = questionid;
                
                $('#alert').find('.timer').attr('src', 'images/timer.gif?nocache=' + now.getTime());
                $('#alertbg').show();
                $('#alert').show();
                
				$('#alert').find('.vraag').text('Op de website van ' + customername + ' probeert iemand in te loggen met u gegevens, klopt dit?');
                 
                navigator.vibrate([500, 200, 500]);
                navigator.notification.beep(2);  
                
                _t = window.setTimeout(function() {
                    window.clearTimeout(_t);
                    _t = null;
                    
                    _questionid = null;
                    $('#alertbg').hide();
                    $('#alert').hide();
                    
                    db.transaction(
                        function( transaction ){  
                            transaction.executeSql( 
                                 "INSERT INTO accesslog (client, datum, geweigerd, telaat, toegestaan) VALUES ('" + customername + "', datetime(), 0, 1, 0);"
                             );
                        }
                    ); 
                }, 10500);
			};
            
        
            $('#BtnTrue').click(function (e) {
                e.preventDefault();
                Valid.server.clientSendAnswer(_questionid, true);
                _questionid = null;
                 window.clearTimeout(_t);
                _t = null; 
                $('#alertbg').hide();
                $('#alert').hide();
                
                db.transaction(
                    function( transaction ){  
                        transaction.executeSql( 
                             "INSERT INTO accesslog (client, datum, geweigerd, telaat, toegestaan) VALUES ('" + customername + "', datetime(), 0, 0, 1);"
                         );
                    }
                ); 
            });
            
            $('#BtnFalse').click(function (e) {
                e.preventDefault();
                Valid.server.clientSendAnswer(_questionid, false);
                _questionid = null;
                 window.clearTimeout(_t);
                _t = null; 
                $('#alertbg').hide();
                $('#alert').hide();
                
                db.transaction(
                    function( transaction ){  
                        transaction.executeSql( 
                             "INSERT INTO accesslog (client, datum, geweigerd, telaat, toegestaan) VALUES ('" + customername + "', datetime(), 1, 0, 0);"
                         );
                    }
                ); 
            }); 
        }

		 db.transaction(function(tx) {
              tx.executeSql("SELECT firstname, lastname, code FROM gebruiker", [], function(tx, res) {
				  if(res.rows.length > 0) { 
					_code = results.rows.item(0).code;
					$('#BtnAccount').show();
					$('#BtnChart').show();
					$('#username').text(results.rows.item(0).firstname + ' ' + results.rows.item(0).lastname);
					$('#welcometext').text('Welkom terug');
					$('#BtnRegisterNewUser').hide();
					$('#newuser').hide();
					$('#existinguser').show(); 
					
				    $('.blink').blink({ delay: 500 });
					existingUser();
				  } else {
					$('#BtnAccount').hide();
					$('#BtnChart').hide();
					$('#username').text('Nieuwe gebruiker');
					$('#welcometext').text('Welkom');
					$('#BtnRegisterNewUser').show();
					$('#newuser').show();
					$('#existinguser').hide(); 
				  } 
              });
         });
		
		
		$('#home').attr('isLoaded', true);
	}
	
	
    function existingUser() { 
        if(_code != null) {
            $.connection.hub.stateChanged(connectionStateChanged);
            $.connection.hub.start({jsonp: _isChrome}).done(function () { 
				Valid.server.registerClient(_code); 
				Valid.server.getWelcomeMessage(); 
            });
			
            function connectionStateChanged(state) {
                var stateConversion = {0: 'connecting', 1: 'connected', 2: 'reconnecting', 4: 'disconnected'};
                 
                if(state.newState == 0) { $('#status').css('background-color', 'blue'); }
                if(state.newState == 1) { $('#status').css('background-color', 'green'); }
                if(state.newState == 2) { $('#status').css('background-color', 'orange'); }
                if(state.newState == 4) { $('#status').css('background-color', 'red'); } 
            };
        }
    }

});

 /*
$(document).on("pagebeforeshow","#pagetwo",function(){
	alert("pagebeforeshow event fired - pagetwo is about to be shown");
});
$(document).on("pagebeforehide","#pagetwo",function(){
	alert("pagebeforehide event fired - pagetwo is about to be hidden");
});
$(document).on("pagehide","#pagetwo",function(){
	alert("pagehide event fired - pagetwo is now hidden");
});*/

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

