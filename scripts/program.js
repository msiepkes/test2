var _t = null; 
var _isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;
var Valid = null;
var Person = new Object();
var _url = 'http://64sws.symsys.nl/signalr';
//var _url = 'http://localhost:4406/signalr';
var _questionid = null;
var _firstname = '';
var _lastname = '';
var _email = '';
var _aanmeldcode = '';
var _customname = '';
var _checkbox = false;
var returnDateTime;
	
	
    document.addEventListener("deviceready", onDeviceReady, false);
    function onDeviceReady() {  
		window.setTimeout(function() {
			//test();	
			loadProgram();
		}, 800);
	  
		$(document).on("pageshow","#aanmelden",function(){ 
			if($('#aanmelden').attr('geladen') == null) {
				loadAanmelden();
				$('#aanmelden').attr('geladen', true);
			}
		});
		$(document).on("pageshow","#gegevens",function(){  
			loadGegevens(); 
		});
		$(document).on("pageshow","#statistieken",function(){ 
			loadStatistieken();
		});
    }

function test() { 
	Person.Firstname = 'Martin';
	Person.Lastname = 'Siepkes';
	Person.Email = 'martin.siepkes@quicknet.nl';
	Person.Code = 'e0872374-c965-49fc-8b4f-c3af2d636e4f';//'7aafaa3f-ff25-4a5a-91c6-753f30a5a03b';
	 
	localStorage.setItem('Person', JSON.stringify(Person)); 
}



function loadStatistieken() {
	var LogArray = new Array();
	if(localStorage.getItem('ClientLog') != null) {
		LogArray = JSON.parse(localStorage.getItem('ClientLog'));
	}
	var i = 0;
	var li = null;
	
	$('#stats').empty();
	LogArray.forEach(function(item) {
		if(item.Name) {
			if(li != null) {
				li.removeClass('ui-last-child');
			}
			li = $('<li />').attr('data-icon', 'false').html('<a href="#" class="ui-btn">' + item.Name + '&nbsp;&nbsp;&nbsp;&nbsp;<span style="font-size: 70%">' + item.Geweigerd + 'x geweigerd, ' + item.TeLaat + 'x te laat, ' + item.Toegestaan + 'x toegestaan</span></a>').appendTo($('#stats')); 
			if(i == 0) { li.addClass('ui-first-child'); } 
			li.addClass('ui-last-child');
			i++;
		}
	}); 
}


function loadGegevens() {
	if($.connection.hub.state != 1) {
		$('#BtnHome3').click();
		return;
	}
	$('#firstname2').val(Person.Firstname);
	$('#lastname2').val(Person.Lastname);
	$('#email2').val(Person.Email);
	
	$('#BtnChangeForm').click(function(e){           
		e.preventDefault(); 
		_firstname = $.trim($('#firstname2').val());
		_lastname = $.trim($('#lastname2').val());
		_email = $.trim($('#email2').val());
		_checkbox = $('#checkbox2').is(':checked');
		
		if(_checkbox) { 
			Valid.server.removeAccount(Person.Code); 
		} else {
			Valid.server.changeAccount(_firstname, _lastname, _email, Person.Code); 
		} 
	}); 
}

function loadAanmelden() {	
	$('#aanmeldcode').val('');
	$('#aanmeldcode').prop('disabled', true);
		
	$('#checkbox1').click(function() { 
		if($(this).is(':checked')){
			if($('#aanmeldcode').attr('_val') != null) { $('#aanmeldcode').val($('#aanmeldcode').attr('_val')); } 
			$('#aanmeldcode').prop('disabled', false);
		} else {
			$('#aanmeldcode').attr('_val', $('#aanmeldcode').val());
			$('#aanmeldcode').val('');
			$('#aanmeldcode').prop('disabled', true);
		}
	});

	$('#BtnRegisterForm').click(function(e){           
		e.preventDefault(); 
		_firstname = $.trim($('#firstname1').val());
		_lastname = $.trim($('#lastname1').val());
		_email = $.trim($('#email1').val());
		_aanmeldcode = $.trim($('#aanmeldcode').val());
		_checkbox = $('#checkbox1').is(':checked');
		
		if(!isValidEmailAddress(_email)) {  
			navigator.notification.alert("Alle velden moeten gevuld zijn!", function () { }, "Aanmelding niet mogelijk", 'OK');
			return;
		}
		
		if(_checkbox) { 
			if(isNaN(_aanmeldcode) || _aanmeldcode.length < 6){ 
				navigator.notification.alert("Alle velden moeten gevuld zijn!", function () { }, "Aanmelding niet mogelijk", 'OK');
				return;
			} 
			
			if (_firstname === "" || _lastname === "" || _email === "" || _aanmeldcode === "") { 
				navigator.notification.alert("Alle velden moeten gevuld zijn!", function () { }, "Aanmelding niet mogelijk", 'OK');
				return;
			} 
			
			$.connection.hub.start({jsonp: _isChrome}).done(function () {
				Valid.server.registerWithCode(_email, _aanmeldcode); 
			});
		} else {
			if (_firstname === "" || _lastname === "" || _email === "") { 
				navigator.notification.alert("Alle velden moeten gevuld zijn!", function () { }, "Geen aanmelding mogelijk", 'OK');
				return;
			}
			
			$.connection.hub.start({jsonp: _isChrome}).done(function () {
				Valid.server.registerWithoutCode(_firstname, _lastname, _email); 
			});
		}
	});
	
	Valid.client.returnRegisterWithCode = function (errorcode, returnguid) {
		var Answers = new Array();
		Answers[0] = '';
		Answers[1] = 'Er kon geen connectie gemaakt worden #01';
		Answers[2] = 'Er kon geen connectie gemaakt worden #02';
		Answers[3] = 'E-mail adres in combinatie met aanmeldcode onbekend #03';
		
		$.connection.hub.stop(); 
		
		if(errorcode != 0) { 
			navigator.notification.alert(Answers[errorcode], function () { }, "Fout tijdens aanmelden", 'OK');
		} else {
			Person = new Object();
			Person.Firstname = _firstname;
			Person.Lastname = _lastname;
			Person.Email = _email;
			Person.Code = returnguid;
			localStorage.setItem('Person', JSON.stringify(Person));
			
			window.setTimeout(function() {
				$('#BtnHome1').click();
				loadProgram();
			}, 800);
		}
	};
		
	Valid.client.returnRegisterWithoutCode = function (errorcode, returnguid) {
		var Answers = new Array();
		Answers[0] = '';
		Answers[1] = 'Er kon geen connectie gemaakt worden #04';
		Answers[2] = 'E-mail adres bestaat al #05';
		Answers[3] = 'Er kon geen connectie gemaakt worden #06';
		Answers[4] = 'Er kon geen connectie gemaakt worden #07';
		
		$.connection.hub.stop(); 
		
		if(errorcode != 0) { 
			navigator.notification.alert(Answers[errorcode], function () { }, "Fout tijdens aanmelden", 'OK');
		} else {
			Person = new Object();
			Person.Firstname = _firstname;
			Person.Lastname = _lastname;
			Person.Email = _email;
			Person.Code = returnguid;
			localStorage.setItem('Person', JSON.stringify(Person));
			 
			window.setTimeout(function() {
				$('#BtnHome1').click();
				loadProgram();
			}, 800);
		} 
	};
}

function loadProgram() { 

	$.connection.hub.url = _url;  
	Valid = $.connection.valid;    
	
	if($.connection.hub.__proto__.__proto__ == null) { 
		navigator.notification.alert(Answers[errorcode], function () { }, "Server offline", 'OK');
		return;
	} else { 
		Valid.client.returnWelcomeMessage = function (response) {
			$('#existinguser').html(response);
		}
		Valid.client.returnAskClient = function (response) {
			returnDateTime = response;
			loadStatistieken();
		}
		
		Valid.client.returnChangeAccount = function (errorcode) {
			var Answers = new Array();
			Answers[0] = '';
			Answers[1] = 'Er kon geen connectie gemaakt worden #01';
			Answers[2] = 'Kon gebruiker niet bijwerken #02'; 
					
			if(errorcode != 0) { 
				navigator.notification.alert(Answers[errorcode], function () { }, "Fout tijdens aanmelden", 'OK');
			} else {
				Person = new Object();
				Person.Firstname = _firstname;
				Person.Lastname = _lastname;
				Person.Email = _email; 
				localStorage.setItem('Person', JSON.stringify(Person));
				$('#username').text(Person.Firstname + ' ' + Person.Lastname);
				
				window.setTimeout(function() {
					$('#BtnHome3').click();
				}, 800);
			}
		}
		
		Valid.client.returnRemoveAccount = function (errorcode) {
			var Answers = new Array();
			Answers[0] = '';
			Answers[1] = 'Er kon geen connectie gemaakt worden #01';
			Answers[2] = 'Account kon niet verwijderd worden #02'; 
			
			$.connection.hub.stop(); 
			
			if(errorcode != 0) { 
				navigator.notification.alert(Answers[errorcode], function () { }, "Fout tijdens aanmelden", 'OK');
			} else {
				localStorage.removeItem('Person');
				localStorage.removeItem('ClientLog');
				
				$('#BtnAccount').hide();
				$('#BtnChart').hide();
				$('#username').text('Nieuwe gebruiker');
				$('#welcometext').text('Welkom');
				$('#newuser').show();
				$('#existinguser').hide(); 
				$('#BtnRegisterNewUser').show();
				
				window.setTimeout(function() {
					$('#BtnHome3').click();
					loadProgram();
				}, 800);
			}
		};
		
		Valid.client.askClient = function (customername, question, questionid) {                
			var now = new Date();
			_questionid = questionid;
			_customname = customername;
			
			$('#alert').find('.timer').attr('src', 'images/timer.gif?nocache=' + now.getTime());
			$('#alertbg').show();
			$('#alert').show();
			
			if(question == null) {
				$('#alert').find('.vraag').text('Op de website van ' + customername + ' probeert iemand in te loggen met u gegevens, klopt dit?');
			} else {
				$('#alert').find('.vraag').text(question);
			}
			navigator.vibrate([500, 200, 500]); 
			
			_t = window.setTimeout(function() {
				window.clearTimeout(_t);
				_t = null;
				
				_questionid = null;
				$('#alertbg').hide();
				$('#alert').hide();
				 
				AddAccessLog(_customname, false, true, false); 
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
	
			AddAccessLog(_customname, false, false, true);  
		});
		
		$('#BtnFalse').click(function (e) {
			e.preventDefault();
			Valid.server.clientSendAnswer(_questionid, false);
			_questionid = null;
			 window.clearTimeout(_t);
			_t = null; 
			$('#alertbg').hide();
			$('#alert').hide();
			
			AddAccessLog(_customname, true, false, false);  
		}); 
		
		Person = JSON.parse(localStorage.getItem('Person'));
		if(Person != null){
			$('#BtnAccount').show();
			$('#BtnChart').show();
			$('#username').text(Person.Firstname + ' ' + Person.Lastname);
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
			$('#newuser').show();
			$('#existinguser').hide(); 
			$('#BtnRegisterNewUser').show();
		}
	} 
}


function AddAccessLog(client, geweigerd, telaat, toegestaan) {
	var num = -1;
	var LogArray = new Array();
	if(localStorage.getItem('ClientLog') != null) {
		LogArray = JSON.parse(localStorage.getItem('ClientLog'));
	}
	
	LogArray.forEach(function(item, i) {
		if(item.Name == client) { num = i; }
	});
	
	if(num > -1){
		var Regel = LogArray[num];
		if(geweigerd) { Regel.Geweigerd++; }
		if(telaat) { Regel.TeLaat++; }
		if(toegestaan) { Regel.Toegestaan++; } 
	} else {
		var Regel = new Object();
		Regel.Name = client;
		if(geweigerd) { Regel.Geweigerd = 1; } else { Regel.Geweigerd = 0; }
		if(telaat) { Regel.TeLaat = 1; } else { Regel.TeLaat = 0; }
		if(toegestaan) { Regel.Toegestaan = 1; } else { Regel.Toegestaan = 0; }
		LogArray.push(Regel);
	}
	
	localStorage.setItem('ClientLog', JSON.stringify(LogArray)); 
};

function isValidEmailAddress(emailAddress) {
	var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
	return pattern.test(emailAddress);
};

	
function existingUser() {  
	if(Person.Code != null) {
		$.connection.hub.stateChanged(connectionStateChanged);
		$.connection.hub.start({jsonp: _isChrome}).done(function () {
			Valid.server.registerClient(Person.Code); 
			Valid.server.getWelcomeMessage(); 
		});
		
		function connectionStateChanged(state) {
			var stateConversion = {0: 'connecting', 1: 'connected', 2: 'reconnecting', 4: 'disconnected'};
			/*
			if(state.newState == 0) { $('#status').css('background-color', 'blue'); }
			if(state.newState == 1) { $('#status').css('background-color', 'green'); }
			if(state.newState == 2) { $('#status').css('background-color', 'orange'); }
			if(state.newState == 4) { $('#status').css('background-color', 'red'); } 
			*/
		};
	}
};


$.fn.blink = function(options) {
	var defaults = { delay: 500 };
	var options = $.extend(defaults, options);

	return this.each(function() {
		var obj = $(this);
		setInterval(function() {
			if ($(obj).css("visibility") == "visible") {
				$(obj).css('visibility', 'hidden');
			} else {
				$(obj).css('visibility', 'visible');
			}
		}, options.delay);
	});
};


$().ready(function () {
	//test();	
	//localStorage.removeItem('ClientLog');
	//localStorage.removeItem('Person');
	onDeviceReady();
});


 
