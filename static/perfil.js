$(function(){

	$('#image-perfil').attr('name', $.cookie('userName')+'perfil');
	$('#image-portada').attr('name', $.cookie('userName')+'portada');
	$('.email').text('Email: '+$.cookie('email'));
/*******Cargar foto de perfil y portada del usuario*******/
	var nameUser={nombre: $.cookie('userName')};

	$('fb-image-profile').attr("src",'./static/'+nameUser+'-perfil.jpg');
	$('fb-image-profile').attr("alt",'./static/anonimoperfil.jpg');

	$('fb-image-lg').attr("src",'./static/'+nameUser+'-portada.jpg');
	$('fb-image-lg').attr("alt",'./static/anonimoportada.jpg');

/*******Cargar eventos del usuario*******/
	var sel = $("#sel_categ").val();

	$('.refresh').click(function(){
		location.reload();
	});

	$('#profile-name').text(nameUser.nombre);

	$.post('/eventSubscribe',nameUser,function(data){
	    for (var i = 0; i < data.length; i++) {
            if(sel==data[i].category || sel=='Todos'){

                fechaOK=fechaCorrecta(data[i].date);
                hour=(data[i].date).substring(11, 19);
                var mensaje=days_between(fechaOK,hour);
                addEvent(data[i].title,data[i].description,fechaOK,mensaje);
            }
        };

	});

/****************************************/

/*******Animacion del menu*******/
	//abre menu
	var animated = false;
	$('#config').click(function() {
		if(animated == false) {
			$('.menu').animate({
				left: '0px'
			}, 200);
			$('#wrapper').animate({
				left: '380px'
			}, 200);
			animated = true;
		}
	});

	//cierra menu
	$('.icon-close').click( function(){
		$('.menu').animate({
			left: '-380px'
			}, 200);
		$('#wrapper').animate({
			left: '0px'
		}, 200);
		animated = false;
	});

	$('.foto-perfil').click(function(){
		$('.perfil-guardar-foto').toggle();
		$('#image-perfil').toggle();
	});
	$('.foto-portada').click(function(){
		$('.portada-guardar-foto').toggle();
		$('#image-portada').toggle();
	});
	$('.image-perfil').on('submit', function(e){
		e.preventDefault();
		if (checkValue($('#image-perfil').val(),'image1')) {
			if (checkIfFileIsImage($('.image1-perfil').val(),'image1')) {
				$.ajax( {
			      url: '/changeImage',
			      type: 'POST',
			      data: new FormData(this),
			      processData: false,
			      contentType: false,
					success : function( data ){
						// Receive answer with OK (if the user is in the DB) or ERROR (if  isn't in the DB)
						if (data == 'OK') {
							$('#event-success').text("¡Enhorabuena! Ha modificado el parámetro correctamente");
							$("#load-alert").load("header-footer.html #perfil-success");
							window.setTimeout(function() { $("#perfil-success").alert('close'); }, 2000);
							location.reload();
						}
					}
				});
			}
		}
	});
	$('.image-portada').on('submit', function(e){
		e.preventDefault();
		if (checkValue($('#image-portada').val(),'image2')) {
			if (checkIfFileIsImage($('.image2-perfil').val(),'image2')) {
				$.ajax( {
			      url: '/changeImage',
			      type: 'POST',
			      data: new FormData(this),
			      processData: false,
			      contentType: false,
					success : function( data ){
						// Receive answer with OK (if the user is in the DB) or ERROR (if  isn't in the DB)
						if (data == 'OK') {
							$('#event-success').text("¡Enhorabuena! Ha modificado el parámetro correctamente");
							$("#load-alert").load("header-footer.html #perfil-success");
							window.setTimeout(function() { $("#perfil-success").alert('close'); }, 2000);
							location.reload();
						}
					}
				});
			}
		}
	});
	$('.perfil-guardar-usuario').click(function(){
		if (checkValue($('#usuario-perfil').val(),'usuario')) {
			var datos = {name_userOld:$.cookie('userName'), name_userNew:$('#usuario-perfil').val()};
			$.post( "/changeUser", datos, function( data ) {
				// Receive answer with OK (if the event isn't in the DB) or ERROR (if  is in the DB)
				if (data == 'ERROR') {
					$('.usuario-perfil-error .text').text("ERROR: El nombre de usuario ya existe");
					$('.usuario-perfil-error').show();
				}else{
					$('.usuario-perfil-error .sr-only').text("");
					$('.usuario-perfil-error').hide();
					$('#event-success').text("¡Enhorabuena! Ha modificado el parámetro correctamente");
					$("#load-alert").load("header-footer.html #perfil-success");
					window.setTimeout(function() { $("#perfil-success").alert('close'); }, 2000);
					$.removeCookie('userName');
					$.cookie('userName',datos.name_userNew);
					location.reload();
				}
			});
		}
	});
	$('.perfil-guardar-password').click(function(){
		if (checkValue($('#password1-perfil').val(),'password') && checkValue($('#password2-perfil').val(),'password')) {
			var datos = {name_userOld:$.cookie('userName'), newPassword:$('#password2-perfil').val()};
			$.post( "/changePassword", datos, function( data ) {
				if (data == 'OK'){
					$('#event-success').text("¡Enhorabuena! Ha modificado el parámetro correctamente");
					$("#load-alert").load("header-footer.html #perfil-success");
					window.setTimeout(function() { $("#perfil-success").alert('close'); }, 2000);
					location.reload();
				}
			});
		}
	});
	$('.perfil-guardar-mail').click(function(){
		if (checkValue($('#mail-perfil').val(),'mail')) {
			var datos = {name_userOld:$.cookie('userName'), newEmail:$('.mail-perfil').val()};
			$.post( "/changeMail", datos, function( data ) {
				if (data == 'OK'){
					$('#event-success').text("¡Enhorabuena! Ha modificado el parámetro correctamente");
					$("#load-alert").load("header-footer.html #perfil-success");
					window.setTimeout(function() { $("#perfil-success").alert('close'); }, 2000);
					$.cookie('email', $('#mail-perfil').val());
					location.reload();
				}
			});
		}
	});
	$('.usuario-perfil').click(function(){
		$('.perfil-guardar-usuario').show();
		$('#usuario-perfil').show();
	});
	$('.password-perfil').click(function(){
		$('.perfil-guardar-password').toggle();
		$('#password1-perfil-label').toggle();
		$('#password1-perfil').toggle();
		$('#password2-perfil-label').toggle();
		$('#password2-perfil').toggle();
	});
	$('.email-perfil').click(function(){
		$('.perfil-guardar-mail').toggle();
		$('#mail-perfil').toggle();
	});
	// When focus out the email input
	$('.mail-perfil').on('focusout',function(){
		validateEmail($(this).val());
	});
	$('.image1-perfil').on('change',function(){
		checkIfFileIsImage($(this).val(),'image1');
	});
	$('.image2-perfil').on('change',function(){
		checkIfFileIsImage($(this).val(),'image2');
	});
	$('#password2-perfil').on('focusout',function(){
		checkPassword($(this).val());
	});
/********************************/
});

var addEvent = function(title, description,date,mensaje){
    var eventToDom = $('.event.prototype').clone();

    var fechaImg = date.split('/');
    var year = fechaImg[2];
    var monthName = monthToName(fechaImg[1]);
    var day = fechaImg[0];

    eventToDom.removeClass('prototype');

    eventToDom.removeClass('prototype');
    eventToDom.find('.event-image').attr("src", "./static/"+title+".jpg");
    eventToDom.find('#title').text(title);
    eventToDom.find('#description').text(description);
    eventToDom.find('#year').text(year);
    eventToDom.find('#month').text(monthName);
    eventToDom.find('#day').text(day);
    eventToDom.find('#infoDate').text(mensaje);
    eventToDom.find('#calendario').text(date);
    eventToDom.find('.verEvento').attr("onclick","goToEvent(\'"+title+"\')");

    $('#startEvents').after(eventToDom);
    eventToDom.after('<hr>');
}

function goToEvent(title){
    $.removeCookie('evento');
    $.cookie('evento',title);
    //href="evento.html"
}


function monthToName(month){
    var monthText = parseInt(month);
    switch(monthText){
        case 1:
            monthText = "Enero";
            break;
        case 2:
            monthText = "Febrero";
            break;
        case 3:
            monthText = "Marzo";
            break;
        case 4:
            monthText = "Abril";
            break;
        case 5:
            monthText = "Mayo";
            break;
        case 6:
            monthText = "Junio";
            break;
        case 7:
            monthText = "Julio";
            break;
        case 8:
            monthText = "Agosto";
            break;
        case 9:
            monthText = "Septiembre";
            break;
        case 10:
            monthText = "Octubre";
            break;
        case 11:
            monthText = "Noviembre";
            break;
        case 12:
            monthText = "Diciembre";
            break;
    }
    return monthText;
}



var fechaCorrecta = function(date){
	date=date.substring(0, 10);
	var fecha=date.split('-');
	var fechaOK=fecha[2]+'/'+fecha[1]+'/'+fecha[0];
	return fechaOK;
}

//Devuelve un mensaje con los días que faltan para el evento
function days_between(date1,hour) {
    var hoy=new Date();
    var arrayDate1=date1.split('/');
    var arrayHour=hour.split(':');
    var oneDay = 1000 * 60 * 60 * 24; // hours*minutes*seconds*milliseconds
    var firstDate = new Date(arrayDate1[2],arrayDate1[1]-1,arrayDate1[0],arrayHour[0],arrayHour[1],arrayHour[2]);
    var dias=Math.round(Math.abs((hoy.getTime() - firstDate.getTime())/(oneDay)));
    var mensaje;
    if(dias==0){
        mensaje='¡El evento es hoy!';
    }else if(dias==1){
        mensaje='El evento es mañana!';
    }else{
        mensaje='¡Faltan '+dias+' días!';
    }
    return mensaje;
}

// Validate/show/hide the email input and date error
var validateEmail = function(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    if (!re.test(email)){
    	$('.email-perfil-error .text').text("ERROR: Mail incorrecto");
		$('.email-perfil-error').show();
	}else{
		$('.email-perfil-error .sr-only').text("");
		$('.email-perfil-error').hide();
    }
}

// Validate/show/hide the email input and date error
var checkValue = function(param,value) {
	var parametersOk = false;
    if (param==''){
    	if (value == 'image1'){
    		value1 = 'imagen de perfil';
    	}
    	else if (value == 'image2'){
    		value1 = 'imagen de portada';
    	}
    	else {
    		value1 = value;
    	}
    	$('.'+value+'-perfil-error .text').text("ERROR: Debe introducir "+value1);
		$('.'+value+'-perfil-error').show();
	}else{
		parametersOk = true;
		$('.'+value+'-perfil-error .sr-only').text("");
		$('.'+value+'-perfil-error').hide();
    }
    return parametersOk;
}

// Check if the file uploaded is an image
var checkIfFileIsImage = function(img, nImg){
	var ext = img.split('.').pop().toLowerCase();
	var isImage = false;
	if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
		if (ext != "") {
			$('.'+nImg+'-perfil-error .text').text("ERROR: Por favor, debe subir únicamente archivos que sean imágenes");
			$('.'+nImg+'-perfil-error').show();
		}
	}else{
		isImage = true;
		$('.'+nImg+'-perfil-error .sr-only').text("");
		$('.'+nImg+'-perfil-error').hide();
	}
	return isImage;
}

// Validate/show/hide the password input and date error
var checkPassword = function(){
	var pass1 = $('#password1-perfil').val();
	var pass2 = $('#password2-perfil').val();
	if(pass1!=pass2){
		$('.passwordcheck-perfil-error .text').text("ERROR: Las contraseñas no coinciden");
		$('.passwordcheck-perfil-error').show();
	}else{
		$('.passwordcheck-perfil-error .sr-only').text("");
		$('.passwordcheck-perfil-error').hide();
	}
}
