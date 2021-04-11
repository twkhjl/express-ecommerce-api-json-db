const CommonHelper = require("../helpers/CommonHelper");
const TokenHelper = require("../helpers/TokenHelper");

const editJsonFile = require("edit-json-file");
const dbPath = require("../data/dbPath");


// global variables

const dataPath = "./data/shoppingCarts.json";
const userPath = "./data/users.json";

const verifyToken = (req)=>{
  let token = req.headers.authorization;
  if (!token) return { error: "token is missing" };
  let result = TokenHelper.verifyToken(token, "front");
  return result;
}

const shoppingCartRoutes = (app, fs) => {
  app.get("/shoppingCarts/", (req, res) => {
    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        // throw err;
        res.send({ error: err });
        return;
      }
      data = JSON.parse(data);

      res.send(data);
      return;
    });
  });
  app.get("/shoppingCart/show/", (req, res) => {
    let token = req.headers.authorization;
    if (!token) return res.json({ error: "token is missing" });

    let result = TokenHelper.verifyToken(token, "front");
    if (result.error) return res.send(result);

    let user_id = result.success.id;
    if (!user_id) {
      res.send({ error: "user_id is blank" });
      return;
    }

    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        // throw err;
        res.send({ error: err });
        return;
      }

      data = JSON.parse(data);
      data = data.filter((o) => o.user_id == user_id)[0];
      if (!data) return res.send([]);

      res.send(data);
      return;
    });
  });

  // add single item to cart
  app.post("/shoppingCart/item/add", async(req, res) => {

    let result = verifyToken(req);
    if (result.error) return res.send(result);

    // let token = req.body.token;
    // if (!token) return res.json({ error: "req_error:token is missing" });

    // let result = TokenHelper.verifyToken(token, "front");
    // if (result.error) return res.send(result);

    let user_id = result.success.id;
    let item = req.body.item;
    if(!item) return res.json({ error: "req_error:item is missing" });
    if(item.length>1) return res.json({ error: "req_error:only one item allowed" });
    if(!item.product_id) return res.json({ error: "req_error:item.product_id is missing" });

    let cart = editJsonFile(dbPath.shoppingCarts);
    let idx = cart.data.findIndex(o=>o.user_id==user_id);
    let user_cart={};
    if(idx==-1){
      user_cart = {'user_id':user_id,'items':[]};
      cart.data.push(user_cart);
      cart.save();
    }else{
      user_cart = cart.data[idx];
    }
    
    let isItemExist = user_cart.items.some(o=>o.product_id ==item.product_id);

    if(isItemExist) return res.json({ 
      error: true,
      type:'exist_error',
      description:'item already exists in cart'
     });
     user_cart.items.push(item);
     cart.save();
    //  return res.json({
    //    cart: user_cart
    // }) 
    return res.json(user_cart);
  });
  // update items in cart
  app.post("/shoppingCart/items/update", async (req, res) => {

    let token = req.body.token;
    if (!token) return res.json({ error: "token is missing" });

    let result = TokenHelper.verifyToken(token, "front");
    if (result.error) return res.send(result);

    let user_id = result.success.id;

    fs.readFile(dataPath, "utf8", (err, data) => {
      if (err) {
        // throw err;
        return res.send({ error: err });
      }

      try {
        data = JSON.parse(data);
      } catch (error) {
        data = [];
      }
      let cart = data.filter((v) => {
        return v.user_id == user_id;
      })[0];

      if (!cart) {
        // create new cart
        let new_cart = {
          'user_id': user_id,
          'items': req.body.items
        };
        
        data.push(new_cart);
      } else {
        // update cart
        let new_items =CommonHelper.copyObject(JSON.parse(req.body.items));
        if (!new_items) return res.json({ error: "req_error:cart item is empty" });
        delete new_items.token;

        let old_items = JSON.parse(JSON.stringify(cart.items));
        if(!old_items) cart.items=[];

       
        let output_items = CommonHelper.mergeObjArr(
          old_items,
          new_items,
          "product_id"
        );

        let required_fields=["product_id","name","imgs","qty","price"];
        output_items.forEach(o=>{

           for(k of Object.keys(o)){
             if(!required_fields.includes(k)) delete o[k];
           }
        })
        cart.items = output_items;

      }
      // return res.json(cart);
      fs.writeFile(dataPath, JSON.stringify(data, null, 2), "utf8", (err) => {
        if (err) {
          throw err;
        }
        let cart = data.find(v=>v.user_id==user_id);
        return res.json(cart);
      });
    });
  });
  // remove single item from cart
  app.delete("/shoppingCart/item/remove/:product_id", async(req, res) => {
    
    // let token = req.body.token;
    let token = req.headers.authorization;
    token = token.replace('Bearer ','');
    
    if (!token) return res.json({ error: "token is missing" });

    let result = TokenHelper.verifyToken(token, "front");
    if (result.error) return res.send(result);

    let user_id = result.success.id;
    let product_id = req.params.product_id;
    if(!product_id) return res.json({error: 'params product_id is missing'});

    let cart = editJsonFile(dbPath.shoppingCarts);
    user_cart = cart.data.find(o=>o.user_id==user_id);
    if(!user_cart) {
      cart.data.push({'user_id':user_id});
      cart.save();
      return res.json({ error: "cart is empty" });
    }
    else if(!user_cart.items) {

      user_cart.items = [];
      cart.save();
      return res.json({ error: "cart is empty" });
    }else if(user_cart.items.length<=0){

      return res.json({ error: "cart is empty" });
    }
    let isItemExist = user_cart.items.some(o=>o.product_id ==product_id);

    if(!isItemExist) return res.json({ 
     error:'item not found'
     });

     let item_index = user_cart.items.findIndex(o=>o.product_id ==product_id);

     user_cart.items.splice(item_index,1);
     cart.save();
     return res.json(user_cart) 
  });
  // remove all items from cart
  app.delete("/shoppingCart/cart/items/remove/all", async(req, res) => {
    
    // let token = req.body.token;
    let token = req.headers.authorization;
    token = token.replace('Bearer ','');
    if (!token) return res.json({ error: "token is missing" });

    let result = TokenHelper.verifyToken(token, "front");
    if (result.error) return res.send(result);

    let user_id = result.success.id;

    try {
      
      let cart = editJsonFile(dbPath.shoppingCarts);
      let cart_idx = cart.data.findIndex(o=>o.user_id==user_id);
      if(cart_idx!==-1) cart.data[cart_idx].items=[];
      cart.save();
      return res.json(cart.data);

    } catch (error) {
      return res.json({ 'error': error });
    }


    return res.json({ 'success': 'cart removed' });

    
    
  });

};

module.exports = shoppingCartRoutes;
