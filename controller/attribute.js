const knex = require("../model/knex");

//Get Attribute list
exports.attributes = (req,res)=>{
    knex.select().from("attribute")
        .then(result=>{
            res.status(202).send(result);
        })
};

//Get attribute by id
exports.attributes_id = (req,res)=>{
    knex.select().from("attribute").where("attribute_id",req.params.attribute_id)
        .then(result=>{
            res.status(202).send(result);
        })
};

//Get Values Attribute from Attribute
exports.attributes_values = (req,res)=>{
    knex.select().from("attribute").where("attribute_id",req.params.attribute_id)
        .then(result=>{
            knex.select("attribute_value_id","value").from("attribute_value").where("attribute_id",result[0].attribute_id)
                .then(data=>{
                    res.status(202).send(data);
                })
        })
};

//Get all Attributes with Product ID
exports.product_id = (req,res)=>{
    knex.select().from("product_attribute").where("product_id",req.params.product_id)
        .then(result=>{
            var id_array=[];
            for (var i of result){
                id_array.push(i)
            }
            var a_b =id_array.length
            knex.select().from("attribute_value").where("attribute_value_id","<=",a_b)
                .then((data)=>{
                    var final_array = [];
                    for(var j of data){
                        var final_object ={};
                        if (j.attribute_id==1){
                            final_object.attribute_name= "size"
                            final_object.attribute_value_id=j.attribute_value_id;
                            final_object.attribute_value=j.value;
                            final_array.push(final_object)
                        }else if (j.attribute_id==2){
                            final_object.attribute_name= "color"
                            final_object.attribute_value_id=j.attribute_value_id;
                            final_object.attribute_value=j.value;
                            final_array.push(final_object)
                        }
                    }
                    res.status(202).send(final_array)
                })
        })
}