/**
 * Created by artemk on 4/12/16.
 */

"use strict";

module.exports = function (sequelize, DataTypes) {
    const User = sequelize.define("user", {
        name: DataTypes.STRING,
        social_id: DataTypes.STRING,
        email: DataTypes.STRING
    });

    User.associate = function (models) {
        User.belongsTo(models.Group, {
            foreignKey: 'group_id',
            constraints: false,
        });
    };

    return User;
};
