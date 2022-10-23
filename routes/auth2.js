const express = require('express');
const passport = require('passport');
exports.isUser =  function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == false) {
         next();
    }
    else
    res.redirect('/everygreen/login')
}

exports.isNotUser  = function (req, res, next) {
    if (req.isAuthenticated()) {
         res.redirect('/everygreen')
    }
    else
    next()
}

exports.isAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == true) {
         next();
    }
    else
    res.redirect('/admin/login');
}

exports.isNotAdmin = function (req, res, next) {
    if (req.isAuthenticated() && req.user.isAdmin == true) 
        res.redirect('/admin');
    else
    next();
}