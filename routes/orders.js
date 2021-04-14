const CommonHelper = require("../helpers/CommonHelper");
const TokenHelper = require("../helpers/TokenHelper");
const moment = require('moment');

const editJsonFile = require("edit-json-file");
const dbPath = require("../data/dbPath");

const orders = (app, fs) => {
  app.get('/cp/orders/all',(req,res)=>{

    let token = req.headers.authorization;
    if (!token) return res.json({ error: "token is missing" });
    let result = TokenHelper.verifyToken(token, "cp");
    if (result.error) return res.send(result);
    
    let orders = editJsonFile(dbPath.orders);
    
    return res.json(orders.data);

  });
  app.get('/order/user',(req,res)=>{

    let token = req.headers.authorization;
    if (!token) return res.json({ error: "token is missing" });
    let result = TokenHelper.verifyToken(token, "front");
    if (result.error) return res.send(result);

    let user_id = result.success.id;
    if (!user_id) {
      res.send({ error: "user_id is missing" });
      return;
    }
    let orders = editJsonFile(dbPath.orders);
    
    let order_user = orders.data.filter((v)=>v.user_id==user_id);
    return res.json(order_user);

  });
  app.post("/order/add", (req, res) => {
    let token = req.headers.authorization;
    if (!token) return res.json({ error: "token is missing" });
    let result = TokenHelper.verifyToken(token, "front");
    if (result.error) return res.send(result);

    let user_id = result.success.id;
    if (!user_id) {
      res.send({ error: "user_id is missing" });
      return;
    }
    let orders = editJsonFile(dbPath.orders);

    let new_id = 0;
    let new_order_number = Date.now().toString();
    if(!orders.data){
      orders.data=[];
      orders.save();
      orders = editJsonFile(dbPath.orders);
    }
    orders.data.forEach((v) => {
      if (v.order_id > new_id) new_id = v.order_id;
    });
    new_id++;
    let new_order = {
      order_id: new_id,
      order_number: new_order_number,
      user_id: user_id,
      total:req.body.total,
      status:'pending',
      order_details: req.body.order_details,
      recpient_details: req.body.recpient_details,
      created_at: moment().format('YYYY-MM-DD')
    };

    orders.data.push(new_order);

    orders.save();

    return res.json(new_order);
  });

  app.delete("/order/remove/:order_id", (req, res) => {
    
    let token = req.headers.authorization;
    if (!token) return res.json({ error: "token is missing" });
    
    let result = TokenHelper.verifyToken(token, "front");
    if (result.error) return res.send(result);
    
    let user_id = result.success.id;
    if (!user_id) {
      res.send({ error: "user_id is missing" });
      return;
    }

    let order_id = req.params.order_id;
    let orders = editJsonFile(dbPath.orders);
    let orderIdx = orders.data.findIndex(v=>v.order_id = order_id);
    let orderToRemove = orders.data[orderIdx];
    orders.data.splice(orderIdx,1);
    orders.save();

    return res.json(orderToRemove);


  })

};

module.exports = orders;
