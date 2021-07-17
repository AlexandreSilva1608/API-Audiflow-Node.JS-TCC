const express = require('express');
const router = express.Router();
const mysql = require('../mysql.js').pool;
const multer = require('multer');
const login = require('../middleware/login')
require('dotenv/config');

const produtosController = require('../controllers/produtos-controller');

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        console.log(file);
        callback(null, './uploads/');
    },
    filename: function(req, file, callback){
        callback(null, file.originalname);
    }
})

const upload = multer({ storage: storage})

router.get('/', login.obrigatorio, produtosController.getProdutos);


router.get('/:id', login.obrigatorio, produtosController.getProdutosById);

router.get('/audio/:id', login.obrigatorio, produtosController.getAudioByIdProduto);

router.post('/', login.obrigatorio, (upload.single('produto_imagem')), produtosController.postProduto);

router.post('/audio/:id', login.obrigatorio, (upload.single('produto_audio')), produtosController.postAudio);

module.exports = router;
