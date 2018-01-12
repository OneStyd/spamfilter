var sequelize = require('./../dbconnection');

module.exports = function(sequelize, DataType){
	return sequelize.define('mail',{
        typemail: DataType.INTEGER,
        recipients:DataType.STRING,
        subject:DataType.STRING,
        content: DataType.TEXT,
        frommail : DataType.STRING,
        date: DataType.DATE
    },{
		timestamps: false
    });
}