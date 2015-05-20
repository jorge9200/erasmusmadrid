// When the document is ready
$( document ).ready(function() {

	// LOAD MODAL CABECERA Y FOOTER
	$("#load-header").load("header-footer.html #header",function(){
		cargaCabecera();
	});

	$('.log-modal').on('submit', function(e){
		e.preventDefault();
		// Send log in
		$.post( "/log", $(this).serialize(), function( data ) {
			// Receive answer with OK (if the user is in the DB) or ERROR (if the user isn't in the DB)
			/*data = ...
			if (data == 'ERROR') {
				$('.log-error .text').text("ERROR: El nombre de usuario no está registrado o la contraseña no es válida");
				$('.log-error').show();
			}else{
				$('.log-error .sr-only').text("");
				$('.log-error').hide();
			}*/
		});
	});

	$("#load-registry").load("header-footer.html #formRegistryModal", function(){
		// When submit the registry modal
		$('.register-modal').on('submit', function(e){
			e.preventDefault();
			if (checkParameters()){
				$.post( "/registry", $(this).serialize(), function( data ) {});
			}
		});
		// When focus out the password 2 input
		$('.password2').on('focusout',function(){
			checkPassword();
		});
		// When focus out the email input
		$('.email').on('focusout',function(){
			validateEmail($(this).val());
		});
		// When focus out the date input
		$('.date').on('focusout',function(){
			validateDate($(this).val());
		});
		// When change the status of the checkPolicy radio button
		$('.check').on('change',function(){
			if ($('.check').prop('checked')){
				$('.check-error .sr-only').text("");
				$('.check-error').hide();
			}
		});
	});

	$("#load-log").load("header-footer.html #formLogModal");
	$("#load-footer").load("header-footer.html #footer");
	$("#load-event").load("header-footer.html #formCreateEvent", function(){
		// When submit the event modal
		$('.event-modal').on('submit', function(e){
			e.preventDefault();
			if (checkParametersEvent()){
				//First to upperCase
				//First to upperCase
				var title = firstUppercase();
				var descripcion = firstUppercase($('.descripcion').val());
				$.post( "/insertNewEvent", $(this).serialize(), function( data ) {});
			}
		});
		// When focus out the email input
		$('.descripcion').on('focusout',function(){
			checkDescription($(this).val());
		});
		// When focus out the direction input
		/*$('.direccion').on('focusout',function(){
			validateDirection($(this).val());
		});*/
		// When focus out the date input
		$('.date').on('focusout',function(){
			validateDate($(this).val());
		});
		// When change the status of the checkPolicy radio button
		$('.check').on('change',function(){
			if ($('.check').prop('checked')){
				$('.check-error .sr-only').text("");
				$('.check-error').hide();
			}
		});
	});

	// EVENTOS
	$("#config").on('click', function(){
		$("#ownEvents").slideToggle(500);
		$("#configOptions").slideToggle(500);
	});

	$("#profileEvents").on('click', function(){
		$("#ownEvents").slideToggle(500);
	});

});

// -- AUXILIAR FUNCTIONS --

// Validate/show/hide the password input and date error
var checkPassword = function(){
	var pass1 = $('.password1').val();
	var pass2 = $('.password2').val();
	if(pass1!=pass2){
		$('.password-error .text').text("ERROR: Las contraseñas no coinciden");
		$('.password-error').show();
	}else{
		$('.password-error .sr-only').text("");
		$('.password-error').hide();
	}
}

// Validate/show/hide the email input and date error
var validateEmail = function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!re.test(email)){
    	$('.email-error .text').text("ERROR: Mail incorrecto");
		$('.email-error').show();
	}else{
		$('.email-error .sr-only').text("");
		$('.email-error').hide();
    }
}

// Validate/show/hide the date input and date error
var validateDate = function(date){
    var matches = /^(\d{2})[-\/](\d{2})[-\/](\d{4})$/.exec(date);
    if (matches == null) {
    	$('.date-error .text').text("ERROR: Formato de fecha de nacimiento incorrecto, introducir dd/mm/aaaa");
		$('.date-error').show();
	}else{
		$('.date-error .sr-only').text("");
		$('.date-error').hide();
    }
}

// Check if all the inputs are filled
var checkParameters = function(){
	// Gets the input values
	var usuario = $('.usuario').val();
	var password1 = $('.password1').val();
	var password2 = $('.password2').val();
	var mail = $('.email').val();
	var date = $('.date').val();
	// Check if the policy is checked
	var checkbox = policyChecked();

	// Show a error message if remains some input to fill
	var parametersOk = false;
	if (usuario=="" || password1=="" || password2=="" || email=="" || date=="" || !checkbox){
		$('.param-error .text').text("ERROR: Por favor, rellene todos los campos");
		$('.param-error').show();
	}else{
		parametersOk = true;
		$('.param-error .sr-only').text("");
		$('.param-error').hide();
	}
	return parametersOk;
}

// Check if the policy is checked
var policyChecked = function(){
	var isChecked = $('.check').prop('checked');
	if (!isChecked) {
		$('.check-error .text').text("ERROR: Debe aceptar las condiciones y políticas de uso de la empresa");
		$('.check-error').show();
	}else{
		$('.check-error .sr-only').text("");
		$('.check-error').hide();
	}
	return isChecked;
}

// Validate/show/hide the title input and date error
var firstUppercase = function(text){
	title[0] == title[0].toUpperCase();
	return  title
}

var checkDescription = function(desc){
	var longitud = desc.size;
	if (longitud<10) {
		$('.desc-error .text').text("ERROR: La descripcion es demasiado corta");
		$('.desc-error').show();
	}if (longitud>500) {
		$('.desc-error .text').text("ERROR: La descripcion es demasiado larga");
		$('.desc-error').show();
	}
	else{
		$('.desc-error .sr-only').text("");
		$('.desc-error').hide();
	}
	return isChecked;
}
// Global variables
var cargaCabecera = function(){
	var logged=$.cookie('logged');
	if(logged=='true'){
		var userName=$.cookie('userName');
		$('.createEvent').show();
		$('.signIn').hide();
		$('.logIn').hide();
		$('.userProfile').text(userName);
		$('.userProfile').show();
	}
}
//Función para hacer log in TODO: comprobar que usuario esta en BD y almacenar en coockie 
var afterLogged = function(){
	$('#formLogModal').modal('toggle');
	var logged=$.cookie('logged');
	 $('.createEvent').show();
	 $('.signOut').show();
	 $('.signIn').hide();
	 $('.logIn').hide();	 
	 var user = $('.user').val();
	$('.userProfile').text(user);
	$('.userProfile').show();
	$.cookie('logged', 'true');
	$.cookie('userName', user);	
	var logged=$.cookie('logged');
	var userName=$.cookie('userName');
	console.log(logged)
	console.log(userName)
}
//Sign Out TODO: actualizar coockie
var signOut=function(){
	$.removeCookie('logged');
	$.removeCookie('userName');
	 $('.createEvent').hide();
	 $('.signOut').hide();
	 $('.signIn').show();
	 $('.logIn').show();	 
	 var user = $('.user').val();
	$('.userProfile').text("");
	$('.userProfile').hide();
}