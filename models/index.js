/**
 * Created by shmublon on 7/30/15.
 */
"use strict";

const fs = require("fs");
const path = require("path");
const cls = require('continuation-local-storage'),
    namespace = cls.createNamespace('my-very-own-namespace');

if (!global.hasOwnProperty('db')) {
    const Sequelize = require('sequelize');
    let sequelize = null;

    Sequelize.useCLS(namespace);
    if (process.env.DATABASE_URL) {
        // the application is executed on Heroku ...
        sequelize = new Sequelize(process.env.DATABASE_URL, {
            dialect: 'postgres',
            protocol: 'postgres',
            logging: true
        })
    } else {
        // the application is executed on the local machine ...
        sequelize = new Sequelize("ticket", "postgres", "postgres",
            {
                dialect: "postgres",
                port: 5432
            });
    }

    global.db = {
        Sequelize: Sequelize,
        sequelize: sequelize,
        User: sequelize.import(__dirname + '/user'),
        Group: sequelize.import(__dirname + '/group'),
        // add your other models here
    };

    fs.readdirSync(__dirname)
        .filter(function (file) {
            return (file.indexOf(".") !== 0) && (file !== "index.js");
        })
        .forEach(function (file) {
            const model = sequelize["import"](path.join(__dirname, file));
            db[model.name] = model;
        });

    Object.keys(db).forEach(function (modelName) {
        if ("associate" in db[modelName]) {
            db[modelName].associate(db);
        }
    });
}

module.exports = db;
