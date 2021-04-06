const CommonHelper = require("../helpers/CommonHelper");
const TokenHelper = require("../helpers/TokenHelper");

// global variables
const dataPath = "./data/shoppingCarts.json";
const userPath = "./data/users.json";

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
  app.get("/shoppingCart/:user_id", (req, res) => {
    let user_id = req.params.user_id;
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

  app.post("/shoppingCart/", async (req, res) => {
    let token = req.body.token;
    if (!token) return res.json({ error: "token is missing" });

    let result = TokenHelper.verifyToken(token, "front");
    if (result.error) return res.send(result);

    let user_id = result.success.id;

    // START validate user====================================================================
    let users = fs.readFileSync(userPath, "utf8", (err, data) => {
      if (err) {
        // throw err;
        return res.send({
          error: "server_error:unable to read db",
          detail: err,
        });
      }
      return data;
    });
    try {
      users = JSON.parse(users);
    } catch (error) {
      return res.send({ error: "db_error:unable to read users data" });
    }
    users = users["front"];
    if (!users)
      return res.send({ error: "db_error:unable to read front user data" });
    if (Object.keys(users).indexOf(user_id) == -1)
      return res.send({ error: "req_error:invalid user data" });

    let user = users[user_id];
    // END validate user====================================================================

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
        cart = req.body;
        data.push(cart);
      } else {
        // update cart
        let new_cart = JSON.parse(JSON.stringify(req.body));
        if (!new_cart.items) return res.json({ error: "req_error:cart is empty" });

        let old_items = JSON.parse(JSON.stringify(cart.items));
        let new_items = JSON.parse(JSON.stringify(new_cart.items));
        delete new_items.token;

        let output_items = CommonHelper.mergeObjArr(
          old_items,
          new_items,
          "product_id"
        );
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
};

module.exports = shoppingCartRoutes;
