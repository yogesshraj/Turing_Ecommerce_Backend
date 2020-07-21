const knex = require("../model/knex");

exports.uniqueid = (req,res)=>{
    const id ="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890";
    const new_Id=id.split("")
    var k = "";
    for (var i=0;i<=10;i++){
        k = k+(new_Id[Math.floor(Math.random()*(new_Id.length-1))])
    }
    res.status(202).send("Your Free unique cart ID is => "+k)
}

// ______________________________________________________________________________________________________________________________

exports.addproductcart = async(req,res)=>{
    const cart_id = req.body.cart_id;
    const product_id = req.body.product_id;
    const attributes = req.body.attributes;
    var obj = {};
    var arr =[];
    await knex.select("product_id","name","image","price","discounted_price").from("product").where("product_id",product_id)
    .then(result=>{
        obj.product_id = result[0].product_id;
        obj.name = result[0].name;
        obj.image = result[0].image;
        if(result[0].discounted_price==0){
            obj.price = result[0].price;
        }else{
            obj.price = result[0].discounted_price;
        }
    })
    await knex.select()
    .from("shopping_cart")
    .where("product_id",obj.product_id)
    .andWhere("cart_id",req.body.cart_id)
    .andWhere("attributes",req.body.attributes)
    .then(async result=>{
        if(result.length==0){
            await knex("shopping_cart")
            .insert({"cart_id":cart_id,
                    "name":obj.name,
                    "attributes":attributes,
                    "product_id":obj.product_id,
                    "price":obj.price,
                    "quantity": 1 ,
                    "image":obj.image,
                    "subtotal": obj.price ,
                    "added_on": new Date()})
            .then(async data=>{
                await knex.select("item_id","name","attributes","product_id","price","quantity","image","subtotal")
                .from("shopping_cart")
                .where("item_id",data[0])
                .then(added=>{
                    arr.push(added[0])
                })
            })
        }else if(result.length!=0){
            let q=result[0].quantity+1;
            let sb = (parseFloat(result[0].subtotal)+obj.price).toString();
            console.log(sb)
            await knex("shopping_cart")
            .update({"quantity":q,"subtotal":sb,"added_on":new Date()})
            .where("cart_id",cart_id)
            .andWhere("product_id",product_id)
            .andWhere("attributes",attributes)
            .then(async upto=>{
                await knex.select("item_id","name","attributes","product_id","price","quantity","image","subtotal")
                .from("shopping_cart")
                .where("cart_id",cart_id)
                .andWhere("product_id",product_id)
                .andWhere("attributes",attributes)
                .then(soon=>{
                    arr.push(soon[0])
                    
                })
            })
        }
    })
    res.status(404).send(arr)
}

// _______________________________________________________________________________________________________________________________-

exports.getid = (req,res)=>{
    knex.select("item_id","name","attributes","product_id","price","quantity","image","subtotal")
    .from("shopping_cart")
    .where("cart_id",req.params.cart_id)
    .then(result=>{
        res.status(202).send(result)
    })
}

// __________________________________________________________________________________________________________________________________

exports.updating = (req,res)=>{
    var q = req.body.quantity
    knex.select().from("shopping_cart").where("item_id",req.params.item_id)
    .then(result=>{
        let sb = (parseFloat(result[0].price)*q).toString();
        knex("shopping_cart").update({"quantity":q,"subtotal":sb}).where("item_id",req.params.item_id)
        .then(data=>{
            knex.select("item_id","name","attributes","product_id","price","quantity","image","subtotal")
            .from("shopping_cart")
            .where("item_id",req.params.item_id)
            .then(datas=>{
                res.status(202).send(datas)
            })
        })
    })
}

// _____________________________________________________________________________________________________________________

exports.deleting = (req,res)=>{
    knex("shopping_cart").where("cart_id",req.params.cart_id).del()
    .then(result=>{
        res.status(202).send("deleted")
    })
}

// ___________________________________________________________________________________________________________________________________

exports.totalcost = (req,res)=>{
    var arr = [];
    var totalcost = 0;
    var resultant = []
    knex.select("subtotal").from("shopping_cart").where("cart_id",req.params.cart_id)
    .then(result=>{
        for (var i of result){
            arr.push(parseFloat(i.subtotal))
        }
        for (var j of arr){
            totalcost =totalcost+j
        }
        resultant.push(totalcost)
        res.status(202).send(resultant[0].toString())
    })
}

// __________________________________________________________________________________________________________________________________________________

exports.removingprod =(req,res)=>{
    knex("shopping_cart").where("item_id",req.params.item_id).del()
    .then(result=>{
        res.status(202).send("successfully deleted")
    })
}

// _______________________________________________________________________________________________________________________________________-------

// Here I created an another table named "save_later" just to save a product for later use
exports.savelater= (req,res)=>{
    const item_id = req.params.item_id;
    knex.schema.hasTable("save_later")
    .then(exists=>{
        console.log("yes")
        if(!exists){
            console.log("no")
            return knex.schema.createTable("save_later",insert=>{
                insert.integer("item_id");
                insert.string("cart_id");
                insert.integer("product_id");
                insert.string("attributes");
                insert.string("name");
                insert.string("image");
                insert.dateTime("added_on");
                insert.string("price");

                knex
                .select()
                .from("shopping_cart")
                .where("item_id",item_id)
                .then(result=>{
                    knex("save_later").insert({"item_id":result[0].item_id,
                                               "cart_id":result[0].cart_id,
                                               "product_id":result[0].product_id,
                                               "attributes":result[0].attributes,
                                               "name":result[0].name,
                                               "image":result[0].image,
                                               "added_on":new Date(),
                                               "price":result[0].price})
                    .then(()=>{
                        knex("shopping_cart").where("item_id",item_id).del()
                        .then(()=>{
                            res.status(202).send("Your product has been saved later");
                        })
                    })
                })
            })
            
        }else{
            knex
            .select()
            .from("shopping_cart")
            .where("item_id",item_id)
            .then(result=>{
                knex("save_later")
                .insert({"item_id":result[0].item_id,
                        "cart_id":result[0].cart_id,
                        "product_id":result[0].product_id,
                        "attributes":result[0].attributes,
                        "name":result[0].name,
                        "image":result[0].image,
                        "added_on":new Date(),
                        "price":result[0].price})
                .then(()=>{
                    knex("shopping_cart").where("item_id",item_id).del()
                    .then(()=>{
                        res.status(202).send("Your product has been saved later");
                    })
                })
            })
        }
    })
}

// ____________________________________________________________________________________________________________________________

exports.getsaved = (req,res)=>{
    knex.select("item_id","name","attributes","price")
    .from("save_later")
    .where("cart_id",req.params.cart_id)
    .then(result=>{
        res.status(202).send(result)
    })
}

// ___________________________________________________________________________________________________________________

exports.movetoproduct =(req,res)=>{
    knex.select().from("save_later").where("item_id",req.params.item_id)
    .then(result=>{
        knex("shopping_cart")
        .insert({"cart_id":result[0].cart_id,
                "product_id":result[0].product_id,
                "attributes":result[0].attributes,
                "quantity":1,
                "name":result[0].name,
                "image":result[0].image,
                "added_on":new Date(),
                "price":result[0].price,
                "subtotal":result[0].price})
        .then(()=>{
            knex("save_later").where("item_id",req.params.item_id).del()
            .then(()=>{
                res.status(202).send("Your product moved to cart")
            })
        })
    })
}

// _________________________________________________________________________________________________________________________