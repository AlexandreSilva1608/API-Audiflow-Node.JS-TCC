const express = require('express');
const morgan = require('morgan');
const app = express();
const bodyParser = require('body-parser');


const rotaClientes = require('./routes/clientes');
const rotaProdutos = require('./routes/produtos');

app.use(function(req, res, next) {
    console.log('Liberando rotas: CORS')
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    
    next();
  });




app.use(morgan('dev'))
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.urlencoded({extended: false}));// apenas dados simples
app.use(bodyParser.json());

app.use('/clientes', rotaClientes);

app.use('/produtos', rotaProdutos);

app.use((req, res, next) => {
    const erro = new Error('Requisição não encontrada');
    erro.status = 404;
    next(erro);
});



app.use((error, req, res, next) =>{
   res.status(error.status || 500);
   return res.send({
       erro: {
           mensagem: error.message
       }
   }); 
});

module.exports = app;