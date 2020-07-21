const knex = require("../model/knex");

exports.tax = (req,res)=>{
    knex.select().from("tax")
        .then(result=>{
            res.status(202).send(result)
        })
}

exports.taxid = (req,res)=>{
    knex.select().from("tax").where("tax_id",req.params.tax_id)
        .then(result=>{
            res.status(202).send(result);
        })
}