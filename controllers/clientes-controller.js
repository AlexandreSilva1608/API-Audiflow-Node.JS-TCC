const mysql = require('../mysql.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const login = require('../middleware/login');

exports.getClientes = async (req, res, next) => {
    try {
        const result = await mysql.execute("SELECT * FROM cliente;");
        const response = {
            quantidade: result.length,
            clientes: result.map(clientes => {
                return {
                    id: clientes.id,
                    nome: clientes.nome,
                    email: clientes.email,
                    apelido: clientes.apelido
                }
            })
        }
        return res.status(200).send({ status: 200, response });
    } catch (error) {
        return res.status(500).send({ status: 500, error: error });
    }
}

exports.postClientes = async (req, res, next) => {
    try {

        var query = 'SELECT * FROM cliente WHERE email = ?';
        var result = await mysql.execute(query, [req.body.email]);

        if (result.length > 0) {
            return res.status(409).send({ status: 409, userExists: true})
        }

        const hash = await bcrypt.hashSync(req.body.senha, 10);
        const querys = 'INSERT INTO cliente (email, senha, apelido, createdAt) VALUES (?, ?, ?, ?)';
        const results = await mysql.execute(querys, [
            req.body.email,
            hash,
            req.body.apelido,
            new Date()
        ]);

        const response = {
            status: 201,
            idCliente: results.insertId,
            success: true,
        }
        return res.status(201).send(response);
    } catch (error) {
        console.log(error)
        return res.status(500).send({ status: 500, error: error});
    }
}


exports.getClientesById = async (req, res, next) => {
    try {
        const query = 'SELECT * FROM cliente  WHERE id = ?';
        const result = await mysql.execute(query, [
            req.params.id
        ]);
        const response = {
            quantidade: result.length,
            clientes: result.map(clientes => {
                return {
                    id: clientes.id,
                    nome: clientes.nome,
                    email: clientes.email,
                    apelido: clientes.apelido,
                    imagem_perfil: process.env.URL + clientes.imagemPerfil,
                }
            })
        }
        return res.status(200).send({ status: 200, response });
    } catch (error) {
        return res.status(500).send({ status: 500, error: error });
    }
}

exports.postClienteLogin = (req, res, next) => {
    mysql.pool.getConnection((error, conn) => {
        if (error) { return res.status(500).send({ status: 500, error: error }) }
        const query = 'SELECT * FROM cliente WHERE email = ?';
        conn.query(query, [req.body.email], (error, resultado, fields) => {
            conn.release();
            if (error) { return res.status(500).send({ status: 500, error: error }) }
            if (resultado.length < 1) {
                return res.status(401).send({
                    status: 401,
                    login: false,
                    mensagem: 'Falha na autenticação'
                });
            }
            bcrypt.compare(req.body.senha, resultado[0].senha, (err, result) => {
                if (err) {
                    return res.status(401).send({
                        status: 401,
                        login: false,
                        mensagem: 'Falha na autenticação'
                    })
                }
                if (result) {
                    const token = jwt.sign({
                        id_cliente: resultado[0].id,
                        email: resultado[0].email,
                        created_at: resultado[0].createdAt,
                        apelido: resultado[0].apelido
                    }, process.env.JWT_KEY,
                        {
                            expiresIn: "24h"
                        })
                    return res.status(200).send({
                        status: 200,
                        idCliente: resultado[0].id,
                        login: true,
                        mensagem: 'Autenticado com sucesso',
                        token: token
                    })
                }

                return res.status(401).send({
                    status: 401,
                    login: false,
                    mensagem: 'Falha na autenticação'
                })
            });
        });
    });
}

exports.putClienteImagem = async (req, res, next) => {
    try {
        const query = 'UPDATE cliente SET imagemPerfil = ? WHERE id = ?';
        let imagem = req.file.path.replace('\\', "/");
        const result = await mysql.execute(query, [
            imagem,
            req.params.id
        ]);
        const response = {
            status: 200,
            success: true,
        }
        
        return res.status(200).send(response);
    } catch (error) {
        console.log(error);
        return res.status(500).send({ status: 500, error: error });
    }
}

