var sequelize = require('./../dbconnection');
var mail = sequelize.import('./../models/mail.model');
mail.sync()