const knex = require("../model/knex");
const jwt = require("jsonwebtoken");
const { token } = require("morgan");


//Search all products
exports.product = (req,res)=>{
    knex.select("product_id","name","description","price","discounted_price","thumbnail").from("product")
        .then(result=>{
            var dict_data = {};
            dict_data.count = result.length;
            dict_data.rows = result
            res.status(202).send(dict_data)
        })
}


//searching all products using simple query string--------------eg:--localhost:8000/products/search?query_string=arc
exports.product_query = (req,res)=>{
    var string = req.query.query_string
    knex.select("product_id","name","description","price","discounted_price","thumbnail").from("product").where("name","like","%"+string+"%").orWhere("description","like","%"+string+"%")
        .then(result=>{
            var dict_data = {};
            dict_data.count = result.length;
            dict_data.rows = result;
            res.status(202).send(dict_data)
        })
}


//get products with IDs of the product
exports.product_with_id = (req,res)=>{
    knex.select().from("product").where("product_id",req.params.product_id)
        .then(result=>{
            res.status(202).send(result)
        })
}


//Get a list of Products of Categories
exports.product_category_id = (req,res)=>{
    knex.select("product_id").from("product_category").where("category_id",req.params.category_id)
        .then(result=>{
            var new_arr = []
            for(var i of result){
                new_arr.push(i.product_id)
            }
            console.log(new_arr)
            var start_at = new_arr[0];
            var end_at = new_arr[(new_arr.length)-1]
            knex.select("product_id","name","description","price","discounted_price","thumbnail").from("product").whereBetween("product_id",[start_at,end_at])
                .then(result=>{
                    res.status(202).send(result)
                })
        })
}


exports.product_department_id = async(req,res)=>{
    var product_obj={};
    var product_arr = [];
    await knex.select("category_id").from("category").where("department_id",req.params.department_id)
        .then(async result=>{
            for(var i of result){
                await knex.select("product_id").from("product_category").where("category_id",i.category_id)
                    .then(async data=>{
                        for (var j of data ){
                            await knex.select("product_id","name","description","price","discounted_price","thumbnail").from("product").where("product_id",j.product_id)
                                .then(datas=>{
                                    for (var k of datas){
                                        product_arr.push(k)
                                    }
                                })
                        }
                    })
            }
        }) 
    product_obj.count = product_arr.length
    product_obj.rows = product_arr 
    res.status(202).send(product_obj)
}

exports.product_details = (req,res)=>{
    knex.select("product_id","name","description","price","discounted_price","image","image_2").from("product").where("product_id",req.params.product_id)
        .then(result=>{
            res.status(202).send(result)
        })
}

exports.product_location =async (req,res)=>{
    var total_obj = {};
    await knex.select("category_id").from("product_category").where("product_id",req.params.product_id)
        .then(async result=>{
            await knex.select().from("category").where("category_id",result[0].category_id)
                .then(data=>{
                    if(data[0].department_id==1){
                        total_obj.category_id = data[0].category_id;
                        total_obj.category_name = data[0].name;
                        total_obj.department_id = data[0].department_id
                        total_obj.department_name = "Regional"
                    }else if(data[0].department_id==2){
                        total_obj.category_id = data[0].category_id;
                        total_obj.category_name = data[0].name;
                        total_obj.department_id = data[0].department_id
                        total_obj.department_name = "Nature"
                    }else if (data[0].department_id==3){
                        total_obj.category_id = data[0].category_id;
                        total_obj.category_name = data[0].name;
                        total_obj.department_id = data[0].department_id
                        total_obj.department_name = "Seasonal"
                    }
                        
                })
        })
    res.status(202).send(total_obj)
}

exports.review = (req,res)=>{
    knex.select("name","review","rating","created_on").from("review").where("product_id",req.params.product_id)
        .then(result=>{
            if(result.length==0){
               return res.status(404).send("Oops!!! unfortunately there are no reviews posted")
            }
            return res.status(202).send(result)
        })
}


exports.reviewpost = (req,res)=>{
    knex.select("name","customer_id").from("customer").where("email",req.email)
        .then(result=>{
            knex("review").insert([{name:result[0].name,
                                    customer_id:result[0].customer_id,
                                    product_id:req.params.product_id,
                                    review:req.body.review,
                                    rating: req.body.rating,
                                    created_on:new Date()}])
                .then(data=>{
                    res.status(202).send("Thanks for your review")
                })
        })
}