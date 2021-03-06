/**
 * Created by artem-kalantay on 11.05.16.
 */

const models = require('../models');
const express = require('express');
const router = express.Router();
const log = require('../log')(module);
const pusherConfig = require('../config/pusher');
const Pusher = require('pusher');

const pusher = new Pusher(pusherConfig);

router.post('/group', function (req, res) {
    models.Group.create({
        train_id: req.body.train_id,
    }).then(function (group) {
        pusher.trigger('groups', 'created', {
            "message": "group created"
        });
        return res.send(group);
    });
});

router.get('/groups', function (req, res) {
    models.Group.findAll(
        {
            include: [
                models.User,
            ]
        }
    ).then(function (groups) {
        return res.send(groups);
    });
});

router.get('/groups/:train_id', function (req, res) {
    models.Group.findAll(
        {
            where: {
                train_id: req.params.train_id,
            },
            include: [
                models.User,
            ]
        }
    ).then(function (groups) {
        return res.send(groups);
    });
});

router.get('/group/:id', function (req, res) {
    models.Group.findById(req.params.id,
        {
            include: [
                models.User,
            ]
        }
    ).then(function (group) {
        if (!group) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }
        return res.send(group);
    });
});

router.put('/group/:id', function (req, res) {
    models.Group.findById(req.params.id).then(function (group) {
        if (!group) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return group.update({
            train_id: req.body.train_id,
        }).then(function (group) {
            pusher.trigger('groups', 'updated', {
                "message": "group updated"
            });
            res.send(group)
        });
    });
});

router.delete('/group/:id', function (req, res) {
    models.Group.findById(req.params.id).then(function (group) {
        if (!group) {
            res.statusCode = 404;
            return res.send({error: 'Not found'});
        }

        return group.destroy().then(function () {
            pusher.trigger('groups', 'deleted', {
                "message": "group deleted"
            });
            return res.send({status: 'REMOVED'});
        });
    });
});

module.exports = router;
