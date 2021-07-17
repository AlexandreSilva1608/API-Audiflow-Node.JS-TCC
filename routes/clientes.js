const express = require('express');
const router = express.Router();
const multer = require('multer');
const login = require('../middleware/login');

const storage = multer.diskStorage({
    destination: function(req, file, callback){
        console.log(file);
        callback(null, './uploads/');
    },
    filename: function(req, file, callback){
        callback(null, file.originalname);
    }
})

const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
        cb(null, true);
    } else {
        cb(null, false);
    }
}

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 1024 * 1024 * 1
    },
    fileFilter: fileFilter,
    
});
const clientesController = require('../controllers/clientes-controller');

router.get('/', login.obrigatorio, clientesController.getClientes);

router.post('/', clientesController.postClientes);

router.get('/:id', login.obrigatorio, clientesController.getClientesById);

router.post('/login', clientesController.postClienteLogin);

router.put('/:id', login.obrigatorio, (upload.single('perfil_imagem')), clientesController.putClienteImagem);


module.exports = router;