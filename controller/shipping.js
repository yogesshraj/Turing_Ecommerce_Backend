const knex = require("../model/knex");

exports.shipregion = (req,res)=>{
    knex.select().from("shipping_region")
        .then(result=>{
            res.status(202).send(result)
        })
};

exports.shipregionid = (req,res)=>{
    knex.select().from("shipping").where("shipping_region_id",req.params.shipping_region_id)
        .then(result=>{
            res.status(202).send(result)
        })
}