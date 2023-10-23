const { getSequelize } = require("../data/index");


const findAll = async()=> {
     return getSequelize().models.Fruitsoort
}



 module.exports = {
     findAll
 };

