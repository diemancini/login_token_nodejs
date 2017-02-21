var jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {

    var token = req.body.token || req.query.token || req.headers['x-access-token'];

    if (token) {

        jwt.verify(token, 'BD_DIEGO', function(err, decoded) {
            if (err) {
                return res.json({ success: false, message: 'Falha de autenticação do token.' });    
            } else {
                req.decoded = decoded;
                console.log(req.decoded);  
                next();
            }
        });

    } else {
        return res.status(403).send({ 
            success: false, 
            message: 'Nenhum token foi dado.' 
        });
    }
};

