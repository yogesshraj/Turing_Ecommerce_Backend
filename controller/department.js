const knex = require("../model/knex");

//Get all deparments
exports.getall = (req,res)=>{
    knex.select().from("department")
        .then(result=>{
            res.status(202).send(result)
        })
};

//Get departments with IDs
exports.getid = (req,res)=>{
    knex.select().from("department").where("department_id",req.params.department_id)
        .then(result=>{
            res.status(202).send(result);
        })
};