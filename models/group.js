/**
 * Created by artemk on 4/14/16.
 */
"use strict";

module.exports = function (sequelize, DataTypes) {
    const Group = sequelize.define("group", {
        train_id: DataTypes.STRING,
    });

    Group.associate = function (models) {
        Group.hasMany(models.User, {
            foreignKey: 'group_id',
            constraints: false,
        });
    };
    return Group;
};