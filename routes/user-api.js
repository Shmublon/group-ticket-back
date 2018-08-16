/**
 * Created by artemk on 4/12/16.
 */
const models = require('../models');
const express = require('express');
const router = express.Router();
const log = require('../log')(module);

router.post('/user', function (req, res) {
    models.User.findOne({
        where: {
            social_id: req.body.social_id
        }
    }).then(function (user) {
        if (!user) {
            models.User.create({
                group_id: req.body.group_id,
                social_id: req.body.social_id,
                email: req.body.email,
                name: req.body.name
            }).then(function (newUser) {
                res.send(newUser)
            });
        } else {
            res.send(user)
        }
    });
});

router.get('/users', function (req, res) {
    models.User.findAll().then(function (users) {
        return res.send(users);
    });
});

router.get('/user/:id', function (req, res) {
    models.User.findById(req.params.id).then(function (user) {
        if (!user) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return res.send(user);
    });
});

router.get('/userBySocialId/:social_id', function (req, res) {
    models.User.findOne({
        where: {
            social_id: req.params.social_id
        }
    }).then(function (user) {
        if (!user) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return res.send(user);
    });
});

router.put('/user/:id', function (req, res) {
    models.User.findById(req.params.id).then(function (user) {
        if (!user) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return user.update({
            group_id: req.body.group_id,
            social_id: req.body.social_id,
            email: req.body.email,
            name: req.body.name
        }).then(function (user) {
            res.send(user)
        });
    });
});

router.delete('/user/:id', function (req, res) {
    models.User.findById(req.params.id).then(function (user) {
        if (!user) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return user.destroy().then(function () {
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;
