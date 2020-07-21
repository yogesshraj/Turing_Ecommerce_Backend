const knex = require("../model/knex");
const jwt = require("jsonwebtoken");

exports.signup = (req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let user = {email:req.body.email};
    let accesskey = jwt.sign(user,"secretkey",{expiresIn:"24h"});
    knex("customer").insert([{name:name,email:email,password:password}])
        .then((result)=>{
            knex.select().from("customer").where("email",email)
                .then(data=>{
                    var total_obj = {customer:{schema:{}},accessToken:"",expiresIn:"24h"};
                    delete data[0].password;
                    total_obj.customer.schema = data[0]
                    total_obj.accessToken = accesskey
                    res.status(202).send(total_obj)
                })

        })
        .catch(err=>{
            res.status(404).send("Your account is already being created")
        })
    }



exports.login = (req,res)=>{
    let email = req.body.email;
    let password = req.body.password;
    let user = {email:req.body.email};
    knex.select().from("customer")
    .then(result=>{
        for(var i of result){
            if (i.email==email && i.password==password){
                let accesskey = jwt.sign(user,"secretkey",{expiresIn:"24h"});
                var total_obj = {customer:{schema:{}},accessToken:"",expiresIn:"24h"};
                delete i.password;
                total_obj.customer.schema = i;
                total_obj.accessToken = accesskey
                return res.status(202).send(total_obj)
            }
        }
        res.status(404).send("Wrong email or password check it again and enter")
    })
}


exports.update = (req,res)=>{
    let name = req.body.name;
    let email = req.body.email;
    let password = req.body.password;
    let day_phone = req.body.day_phone;
    let eve_phone = req.body.eve_phone;
    let mob_phone = req.body.mob_phone;
    knex("customer")
    .where({"name":name,"email":email})
    .update({
                "password":password,
                "day_phone":day_phone,
                "eve_phone":eve_phone,
                "mob_phone":mob_phone})
    .then(result=>{
        knex.select().from("customer").where({"name":name,"email":email})
        .then(data=>{
            delete data[0].password
            res.status(202).send(data[0]);
        })
    })
}


exports.customerdet = (req,res)=>{
    knex.select().from("customer").where("email",req.email)
    .then(result=>{
        delete result[0].password
        res.status(202).send(result[0])
    })
}

exports.customeraddr = (req,res)=>{
    var address_1 = req.body.address_1;
    var address_2 = req.body.address_2;
    var city = req.body.city;
    var region = req.body.region;
    var postal_code = req.body.postal_code;
    var country = req.body.country;
    var shipping_region_id = req.body.shipping_region_id;
    if(!(address_1 && city && region && postal_code && country && shipping_region_id)){
        res.status(404).send("Enter all the details that are required!!!")
    }
    else if(address_1 && city && region && postal_code && country && shipping_region_id){
        knex("customer")
        .update({"address_1":address_1,
                "address_2":address_2,
                "city":city,
                "region":region,
                "postal_code":postal_code,
                "country":country,
                "shipping_region_id":shipping_region_id})
        .where("email",req.email)
        .then(data=>{
            knex.select().from("customer").where("email",req.email)
            .then(result=>{
                delete result[0].password
                res.status(202).send(result[0])
            })
        })
    }

}


exports.credit_cards = (req,res)=>{
    let credit_card =req.body.credit_card;
    if(!credit_card){
        res.status(404).send("Enter credit card details")
    }else if(credit_card){
        knex("customer").update("credit_card",credit_card).where("email",req.email)
        .then(result=>{
            knex.select().from("customer").where("email",req.email)
                .then(data=>{
                    delete data[0].password
                    res.status(202).send(data);
                })
        })
    }

}


