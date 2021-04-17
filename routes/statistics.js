const editJsonFile = require("edit-json-file");
const dbPath = require("../data/dbPath");
const TokenHelper = require("../helpers/TokenHelper");

const statisticsRoutes = (app, fs) => {

  app.get("/statistics/orders/all", (req, res) => {

    let token = req.headers.authorization;
    if (!token) return res.json({ error: "token is missing" });

    let isUserLoggedIn = TokenHelper.verifyToken(token, "cp");
    if (isUserLoggedIn.error) return res.send(isUserLoggedIn);

    let result={};
    let orders = editJsonFile(dbPath.orders);
    let cats = editJsonFile(dbPath.cats);
    let products = editJsonFile(dbPath.products);

    let subcat1 = cats.data.subcat1;

    subcat1 = Object.keys(subcat1).map((k)=>{
      
      return {
        subcat1_id: subcat1[k].id,
        name:subcat1[k].name,
      }
    })

    let order_details = orders.data.map(el => el.order_details).flat();

    order_details.forEach((p)=>{
      let my_product = products.data.filter(o=>o.id==p.product_id)[0];
      console.log(my_product);
      if(!result[my_product.subcat1_id]){

        result[my_product.subcat1_id] = {};
        result[my_product.subcat1_id].subcat1_id = my_product.subcat1_id;
        result[my_product.subcat1_id].name = subcat1.filter(v=>v.subcat1_id==my_product.subcat1_id)[0].name;
        result[my_product.subcat1_id].qty = p.qty;
      }
      else{
        result[my_product.subcat1_id].qty += p.qty;

      }
      
    })

    

    return res.json(result);
    
  });

}


module.exports = statisticsRoutes;