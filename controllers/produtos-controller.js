const mysql = require('../mysql.js');

exports.getProdutos = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT id, tipo, titulo, imagem FROM produto;");
        const response = {
            quantidade: result.length,
            produtos: result.map(produtos => {
                return {
                    id: produtos.id,
                    titulo: produtos.titulo,
                    tipo: produtos.tipo,
                    imagem: process.env.URL + produtos.imagem,
                }
            })
        }
        return res.status(200).send({ status: 200, response });
    } catch (error) {
        return res.status(500).send({ status: 500, error: error });
    }
}

exports.getProdutosById = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT p.*, a.url AS audio FROM produto p INNER JOIN audio a ON p.id = a.id_produto WHERE p.id = ?;", [
            req.params.id
        ]);
        const response = {
            produto: result.map(produtos => {
                return {
                    id: produtos.id,
                    titulo: produtos.titulo,
                    tipo: produtos.tipo,
                    descricao: produtos.descricao,
                    autor: produtos.autor,
                    editora: produtos.editora,
                    paginas: produtos.paginas,
                    isAudioBook: produtos == 1 ? true : false,
                    isEbook: produtos == 1 ? true : false,
                    imagem: process.env.URL + produtos.imagem,
                    audio: process.env.URL + produtos.audio,
                    

                }
            })
        }
        return res.status(200).send({ status: 200, response });
    } catch (error) {
        return res.status(500).send({ status: 500, error: error });
    }
}


exports.getAudioByIdProduto = async (req, res, next) => {
    try {
        const query = 'SELECT p.id AS id_produto, p.titulo, a.url FROM produto p INNER JOIN audio a ON a.id_produto = p.id WHERE a.id_produto = ?';
        const result = await mysql.execute(query, [
            req.params.id
        ]);
        const response = {
            clientes: result.map(produtos => {
                return {
                    idProduto: produtos.id,
                    titulo: produtos.titulo,
                    tipo: produtos.tipo,
                    url: process.env.URL + produtos.url,
                }
            })
        }

        return res.status(200).send({ status: 200, response });
    } catch (error) {
        return res.status(500).send({ status: 500, error: error });
    }
}

exports.postProduto = async (req, res, next) => {
    try {
        let querys = 'SELECT * FROM produto WHERE titulo = ?';
        let results = await mysql.execute(querys, [req.body.titulo]);

        if (results.length > 0) {
            return res.status(409).send({ status: 409, produtoExists: true})
        }
        
        const query = 'INSERT INTO produto (tipo, titulo, descricao, autor, editora, paginas, audio, ebook, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
        let imagem = req.file.path.replace('\\', "/");
        const result = await mysql.execute(query, [
            req.body.tipo, req.body.titulo, req.body.descricao, req.body.autor, req.body.editora, req.body.paginas, req.body.audio, req.body.ebook, imagem
        ]);

        const response = {
            status: 201,
            success: true,
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ status: 500, error: error });
    }
}

exports.postAudio = async (req, res, next) => {
    try {
        const query = 'INSERT INTO audio (url, id_produto) VALUES (?, ?)';
        let audio = req.file.path.replace('\\', "/");
        const result = await mysql.execute(query, [
            audio, req.params.id
        ]);

        const response = {
            status: 201,
            success: true,
        }
        return res.status(201).send(response);
    } catch (error) {
        return res.status(500).send({ status: 500, error: error });
    }
}