// MODULES
var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var http = require('http');
var mysql = require('mysql');
var routes = require('./routes/index');
var users = require('./routes/users');
var multer = require('multer');

// APPLICATION
var app = express();

//VIEW ENGINE SETUP
app.engine('html', require('ejs').renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/');

app.use('/' ,express.static(path.join(__dirname, '/')));
app.use('/static' ,express.static(path.join(__dirname, '/static')));
app.use(favicon(__dirname + '/static/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(multer({ dest: __dirname + '/static',
 rename: function (fieldname, filename) {
    return fieldname;
  }
}));
app.use(cookieParser());

app.use('/', routes);
app.use('/users', users);

app.listen(1000);

// DATABASE
var connection = mysql.createConnection({
    host     : 'localhost',
    user     : 'root',
    password : '',
    port     : 3306,
    database : 'erasmus_madrid',
});

//Inserta un usuario en la base de datos
global.insertUser = function(id_user, name_user, password, email, birthDate, callback) {
    connection.query("INSERT INTO user(id_user,name_user,password,email,date_birth) VALUES ("+id_user+",'"+name_user+"','"+password+"','"+email+"','"+birthDate+"');", function(err, rows, fields) {
        callback(err, rows);
    });
};

//Devuelve el usuario que tenga el nombre pasado como parametro y null si no lo encuentra
global.getUser = function(name_user, callback) {
    connection.query("SELECT * FROM user WHERE name_user='"+ name_user +"';", function(err, rows, fields) {
        callback(err, rows);
    });
};

//Devuelve el id_user según el nombre de usuario
global.getIdUser = function(name_user, callback) {
    connection.query("SELECT id_user FROM user WHERE name_user='"+name_user+"';", function(err, rows, fields) {
        callback(err, rows);
    });
};

//Devuelve el max(id_event) para que se inserte un evento con el siguiente id al obtenido
global.maxIdUser = function(callback) {
    connection.query("SELECT max(id_user) FROM user", function(err, rows, fields) {
        callback(err, rows);
    });
};

//Devuelve el max(id_event) para que se inserte un evento con el siguiente id al obtenido
global.maxIdEvent = function(callback) {
    connection.query("SELECT max(id_event) FROM event", function(err, rows, fields) {
        callback(err, rows);
    });
};

//Devuelve el max(id_event) para que se inserte un evento con el siguiente id al obtenido
global.maxId = function(callback) {
    connection.query("SELECT max(id_event) FROM event", function(err, rows, fields) {
        callback(err, rows);
    });
};

//Inserta un evento nuevo creado por el usuario
global.insertNewEvent = function(id_event,title,category,description,address,date,comment,callback) {
    connection.query("INSERT INTO event(id_event,title,category,description,address,date,comment) VALUES ("+id_event+",'"+title+"','"+category+"','"+description+"','"+address+"','"+date+"','"+comment+"');", function(err, rows, fields) {
        callback(err, rows);0
    });
};

//Devuelve el titulo que tenga el title pasado como parametro y null si no lo encuentra
global.getTitle = function(title, callback) {
    connection.query("SELECT * FROM event WHERE title='"+ title +"';", function(err, rows, fields) {
        callback(err, rows);
    });
};

//Devuelve la información de todos los eventos
global.getEvent = function(callback) {
    connection.query("SELECT title,description,category,date FROM event ORDER BY date DESC", function(err, rows, fields) {
        callback(err, rows);
    });
};

//Devuelve la información correspondiente al evento pasado como parámetro
global.getOneEvent = function(titulo,callback) {
    connection.query("SELECT title,description,category,address,date,comment FROM event WHERE title='"+ titulo +"';", function(err, rows, fields) {
        callback(err, rows);
    });
};

//Devuelve los eventos a los que esta subscrito un usuario segun el id_user que se le pasa como entrada, ordenados por fecha
global.subscribeEvent = function(id_user,callback) {
    connection.query("SELECT title, category, description, address,date,comment FROM event INNER JOIN user_event ON event.id_event=user_event.id_event WHERE id_user='"+ id_user +"'ORDER BY date DESC" , function(err, rows, fields) {
        callback(err, rows);
    });
};

global.userSubscribe = function(id_user,id_event,callback) {
    connection.query("INSERT IGNORE INTO user_event(id_user,id_event) VALUES ('"+id_user+"','"+id_event+"');",function(err, rows, fields) {
        callback(err, rows);
    });
};

//perfil
global.changeUser = function(name_userNew,name_userOld,callback) {
    connection.query("UPDATE user SET name_user='"+name_userNew+"' WHERE name_user='"+name_userOld+"';" , function(err, rows, fields) {
        callback(err, rows);
    });
};

global.changePassword = function(name_userOld,newPassword,callback) {
    connection.query("UPDATE user SET password='"+newPassword+"' WHERE name_user='"+name_userOld+"';" , function(err, rows, fields) {
        callback(err, rows);
    });
};

global.changeMail = function(name_userOld,newEmail,callback) {
    connection.query("UPDATE user SET email='"+newEmail+"' WHERE name_user='"+name_userOld+"';" , function(err, rows, fields) {
        callback(err, rows);
    });
};

global.getIdEvent = function(name_event, callback) {
    connection.query("SELECT id_event FROM event WHERE title='"+ name_event +"';", function(err, rows, fields) {
        callback(err, rows);
    });
};

global.getIdEventFromUserEventTable = function(id_event,user, callback) {
    console.log(id_event);
    connection.query("SELECT * FROM user_event WHERE id_event='"+id_event+"' AND id_user='"+ user +"';", function(err, rows, fields) {
        callback(err, rows);
    });
};

// ERROR HANDLERS
// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});
// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}
// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


var router = express.Router();

module.exports = app;
