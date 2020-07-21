const knex = require("../model/knex");

//Get categories
exports.categories = (req,res)=>{
    knex.select().from("category")
        .then(result=>{
            var dic_data ={};
            dic_data.count = result.length;
            dic_data.rows = result;
            res.status(202).send(dic_data);
        })
};


//Get category by ID
exports.categoriesid = (req,res)=>{
    knex.select().from("category").where("category_id",req.params.category_id)
        .then(result=>{
            res.status(202).send(result);
        })
}

//Get Categories of a Product
exports.productid =(req,res)=>{
    knex.select("category_id").from("product_category").where("product_id",req.params.product_id)
        .then(result=>{
            var p_id=result[0].category_id;
            knex.select("category_id","department_id","name").from("category").where("category_id",p_id)
                .then(data=>{
                    res.status(202).send(data);
                })
        });
};

//Get Categories of a Department
exports.departmentid = (req,res)=>{
    knex.select("department_id").from("department").where("department_id",req.params.department_id)
        .then(result=>{
            knex.select().from("category").where("department_id",result[0].department_id)
                .then(data=>{
                    res.status(202).send(data);
                })
        })
    }