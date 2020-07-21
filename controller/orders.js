const knex = require("../model/knex");

exports.porder = async (req,res)=>{
    const cart_id  = req.body.cart_id;
    const shipping_id = req.body.shipping_id;
    const tax_id = req.body.tax_id;
    var order_arr = [];
    var orders = {};  //This obj is for posting in order table
    var subtotal = [];
    var allSubtotal = [];
    var total_cost_tax = []
    await knex.select("customer_id").from("customer").where("email",req.email)
    .then(data=>{
        orders.customer_id = data[0].customer_id
    })
    await knex.select().from("shopping_cart").where("cart_id",cart_id)
    .then(result=>{
        for (var i of result){
            var order_detail = {}; 
            subtotal.push(parseFloat(i.subtotal))
            order_detail.product_id = i.product_id;
            order_detail.attributes = i.attributes;
            order_detail.product_name = i.name;
            order_detail.quantity = i.quantity;
            order_detail.unit_cost = i.price;
            order_arr.push(order_detail)
        }
    })
    var a = 0;
    for (var i of subtotal){
        a=a+i;
    }
    allSubtotal.push(a)
    await knex.select().from("tax").where("tax_id",tax_id)
    .then(taxings=>{
        total_cost_tax.push(allSubtotal[0]+(allSubtotal[0]*(taxings[0].tax_percentage/100)))
    })
    await knex("orders")
    .insert([{total_amount:total_cost_tax[0],
            created_on:new Date(),
            customer_id:orders.customer_id,
            shipping_id:shipping_id,
            tax_id:tax_id,}])
    .then(async uploaded=>{
        for(var j of order_arr){
            await knex("order_detail")
            .insert([{order_id:uploaded[0],
                    product_id:j.product_id,
                    attributes:j.attributes,
                    product_name:j.product_name,
                    quantity:j.quantity,
                    unit_cost:j.unit_cost}])
            .then(()=>{
                console.log("inserted")
            })
        }
        await knex("shopping_cart").where("cart_id",cart_id).del()
        .then(()=>{
            console.log("also deleted")
        })
        res.status(202).send(uploaded)
    })
} 

// _____________________________________________________________________________________________________

exports.orderCustomer =async (req,res)=>{
    await knex.select().from("customer").where("email",req.email)
    .then(async result=>{
        await knex.select().from("orders").where("customer_id",result[0].customer_id)
        .then(data=>{
            res.status(202).send(data)
        })
    })
}


// ___________________________________________________________________________________________________________
exports.getall =async (req,res)=>{
    var toSend = [];
    await knex.select().from("orders").where("order_id",req.params.order_id)
    .then(async result=>{
        await knex.select().from("order_detail").where("order_id",req.params.order_id)
        .then(data=>{
            for (var i of data){
                var id_obj = {};
                id_obj.order_id= i.order_id;
                id_obj.product_id = i.product_id;
                id_obj.attributes = i.attributes;
                id_obj.quantity = i.quantity;
                id_obj.unit_cost = i.unit_cost;
                id_obj.subtotal = result[0].total_amount;
                toSend.push(id_obj)
            }
        })
    })
    res.status(202).send(toSend)
}

// _______________________________________________________________________________________________

exports.shortdetail = async(req,res)=>{
    var toSend = []
    await knex
    .select("order_id","total_amount","created_on","shipped_on","status")
    .from("orders")
    .where("order_id",req.params.order_id)
    .then(async result=>{
        await knex.select().from("customer").where("email",req.email)
        .then(data=>{
            var short_obj = {};
            short_obj.order_id = result[0].order_id;
            short_obj.total_amount = result[0].total_amount;
            short_obj.created_on = result[0].created_on;
            short_obj.shipped_on = result[0].shipped_on;
            short_obj.status = result[0].status;
            short_obj.name = data[0].name;
            toSend.push(short_obj)
        })
    })
    res.status(202).send(toSend)
}