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
		localStorage.setItem('firstname', 'Martin');
				
				   
	   	
	  
	  
		$(document).on("pageshow","#aanmelden",function(){
			alert(localStorage.getItem('firstname'));
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

