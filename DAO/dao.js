var pg = require('pg');
var jwt = require('jsonwebtoken');
var linkDB = "postgres://diego:123456@localhost/sign_in_up";

module.exports = {

    login: function(nome, senha, app, callback) {

        pg.connect(linkDB, function(err, client, done) {

            if (err) {
                return console.error('Erro ao procurar usuário na nossa base de dados..', err);
            }

            client.query("SELECT * FROM usuarios where nome='"+ nome +"'and senha='"+ senha +"';", [], function(err, result) {
                done();

                if (err) {
                    callback({ success: false, message: 'Erro na query'});
                }
                else if (result.rows.length == 0) {
                    callback({ success: false, message: 'Usuário '+ nome +' já cadastrado'});
                }
                else if (!result.rows[0].nome) {
                    callback({ success: false, message: 'Falha na autenticação! Nome '+ nome +' incorreto'});
                }
                else if (!result.rows[0].senha) {
                    callback({ success: false, message: 'Falha na autenticação! senha' + senha +' incorreta'});
                }
                else if(result.rows[0].nome == nome && result.rows[0].senha == senha) {
                    var token = jwt.sign(result.rows[0], app.get('secret'), {
                        expiresIn: "1h"//60*60*24
                    });
                    callback({ 
                        success: true,
                        message: 'Logado com sucesso!',
                        nome: result.rows[0].nome,
                        senha: result.rows[0].senha,
                        token: token
                    });
                }
                else {
                    callback({ success: false, message: 'Falha na autenticação! Usuário ou senha incorreta'});
                }
            });
        });
    },

    insertUser: function(req, callback) {

        pg.connect(linkDB, function(err, client, done) {

            if (err) {
                return console.error('Erro ao procurar usuário na nossa base de dados..', err);
            }

            var endereco = '{"logradouro": "'+ req.body.logradouro+'"}';

            var insertUsuario = "INSERT INTO usuarios (nome, email, senha, data_criacao, data_atualizacao, endereco) VALUES ('";
            //insert += req.body.id +", '";
            insertUsuario += req.body.nome +"', '";
            insertUsuario += req.body.email +"', '";
            insertUsuario += req.body.senha +"', '";
            insertUsuario += req.body.data_criacao +"', '";
            insertUsuario += req.body.data_atualizacao +"', '";
            insertUsuario += endereco +"');";

            client.query(insertUsuario, [], function(err, result) {
                done();

                if (err) {
                    callback({ success: false, message: 'Erro na query: '+ err});
                }
                else {
                    callback({ success: true, message: 'Usuário cadastrado!' });
                }
            });

        });
    },

    insertWishList: function(data, callback) {

        pg.connect(linkDB, function(err, client, done) {
            if (err) {
                return console.error('Erro ao procurar usuário na nossa base de dados..', err);
            }

            var dc = new Date(data.data_criacao);
            var data_criacao = dc.getFullYear() +"-"+ dc.getMonth() +"-"+ dc.getDay();

            var da = new Date(data.data_atualizacao);
            var data_atualizacao = da.getFullYear() +"-"+ da.getMonth() +"-"+ da.getDay();

            var insertListaDesejo = "INSERT INTO lista_desejo (id_usuario, nome, descricao, valor_medio, data_criacao, data_atualizacao) VALUES ('";
            insertListaDesejo += data.id +"', '";
            insertListaDesejo += data.nome +"', '";
            insertListaDesejo += data.descricao +"', '";
            insertListaDesejo += data.valor_medio +"', '";
            insertListaDesejo += data_criacao +"', '";
            insertListaDesejo += data_atualizacao +"');";

            client.query(insertListaDesejo, [], function(err, result) {
                done();
                
                if (err) {
                    callback({ success: false, message: 'Erro na query: '+ err});
                }
                else {
                    callback({ success: true, message: 'Usuário cadastrado!' });
                }
            });
        })
    },

    getWishList: function(nome, id, callback) {

        pg.connect(linkDB, function(err, client, done) {

            if (err) {
                return console.error('Erro ao procurar usuário na nossa base de dados..', err);
            }

            var wishList = "SELECT * FROM lista_desejo where nome='"
            wishList += nome +"'and id='";
            wishList += id +"';";

            client.query(wishList, [], function(err, result) {
                done();

                if (err) {
                    callback({ success: false, message: 'Erro na query: '+ err, json: null});
                }
                else {
                    callback({ success: true, message: 'Retornou a lista de desejos do banco de dados com sucesso!', json: result.rows[0]});
                }
            });
        });
    },

    getUser: function(req, callback) {
        pg.connect(linkDB, function(err, client, done) {

            if (err) {
                return console.error('Erro ao procurar usuário na nossa base de dados..', err);
            }

            var usuarios = "SELECT * FROM usuarios where nome='";
            usuarios += req.body.nome +"'and senha='"
            usuarios += req.body.senha +"';";

            client.query(usuarios, [], function(err, result) {
                done();

                if (err) {
                    callback({ success: false, message: 'Erro na query: '+ err, json: null});
                }
                else {
                    callback({ success: true, message: 'Usuário cadastrado!', json: result.rows[0]});
                }
            });
        });
    }

}
