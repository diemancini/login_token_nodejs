var models = require("../models/users");
var jwt    = require('jsonwebtoken');
var views = require("../views/views");
var validateToken = require("../models/validate-token");

var json = {};

module.exports = function(app, express) {

    var apiRoutes = express.Router();
    app.use('/api', apiRoutes);

    apiRoutes
        .route('/login')
        .get(function(req, res) {

            views.login(req, res, app);
        })
        .post(function(req, res) {
            models.login(req.body.nome, req.body.senha, app, function(result) {
                if (result.success == true) {
                    
                    res.set('x-access-token', result.token);
                    res.redirect('/api/lista_desejo?token='+ result.token);
                }
                else {
                    res.json(result.message);
                }
            });  
        });

    apiRoutes
        .route('/logout')
        .post(function(req, res) {
            models.logout(req.body.nome, req.body.senha, app, function(result) {
                res.json(result);
            });
        });

    apiRoutes
        .route('/register')
        .get(function(req, res) {
            views.register(req, res);
        })
        .post(function(req, res) {
            models.register(req, function(result) {
                if (result.success == true) {
                    req.descricao = '';
                    req.valor_medio = '';
                    models.insertWishList(req, function(result) {
                        if (result.success == true) {
                            res.redirect('/api/login');
                        }
                        else {
                            res.send(result.message);
                        }
                    });
                }
                else {
                    res.send(result.message);
                }
            })
        })

    apiRoutes
        .route('/update')
        .get(function(req, res) {
            views.register(req, res);
        })
        .post(function(req, res) {
            models.register(req, function(result) {
                res.redirect('/api/login');
            })
        })


    apiRoutes
        .route('/lista_desejo')
        .get(validateToken, function(req, res) {
            models.getWishList(req.decoded.nome, req.decoded.id, function(result) {
                if (result.success == true) {
                    views.lista_desejo(req, res, result.json);
                }
                else {
                    res.json(result.message);
                }
            });
        })
        .post(validateToken, function(req, res) {
            models.insertWishList(req, function(result) {
                if (result.success == true) {
                    views.lista_desejo(req, res, result.json);
                }
                else {
                    res.json(result.message);
                }
            })
        })
}