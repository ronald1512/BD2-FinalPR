const express = require('express');
const app = express();
const morgan = require('morgan'); /**morgan en realidad es un middleware. 
Es una funcion que procesa datos antes de que nuestro servidor lo reciba.  */


// settings
app.set('port', process.env.PORT || 3000);  // lo hago de esta forma para que esta declaración la pueda consultar en toda la app. Verifico si hay en el sistema un puerto especificado. 


//middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
    next();
});


app.use(morgan('dev')); //nos permitirá ver en consola lo que va llegando al servidor. 
        // puede ser dev(informacion corta), combined (más informacion). 
app.use(express.urlencoded({extended:false})); // es para que entienda datos que reciba a través de un formulario (inputs). 
app.use(express.json());// es para que nuestro servidor entienda json

//routes
app.use(require('./routes/index.js'));

//starting server
app.listen(app.get('port'),()=>{
    console.log(`Server on port ${app.get('port')}`);
});