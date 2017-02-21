var pg = require('pg');
var dao = require('../../DAO/dao');
var linkDB = "postgres://diego:123456@localhost/sign_in_up";

module.exports = {

    login: function(nome, senha, app, callback) {
        dao.login(nome, senha, app, callback);
    },

    logout: function(nome, senha, app, callback) {

    },

    register: function(req, callback) {
        dao.insertUser(req, callback);
    },

    getUser: function(req, callback) {
        dao.getUser(req, callback);
    },

    getWishList : function(nome, id, callback) {
        dao.getWishList(nome, id, callback);
    },

    insertWishList: function(req, callback) {
        this.getUser(req, function(result) {
            if (result.success == true) {
                dao.insertWishList(result.json, callback);
            } 
        });
        
    }
}