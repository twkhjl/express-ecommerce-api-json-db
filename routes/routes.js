// import other routes
const testRoutes = require('./test');

const userCpRoutes = require('./users_cp');
const userFrontRoutes = require('./users_front');
const productRoutes = require('./products');
const catRoutes = require('./cats');
const shoppingCartRoutes = require('./shoppingCarts');
const ordersRoutes = require('./orders');
const statisticsRoutes = require('./statistics');




const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    userCpRoutes(app, fs);
    userFrontRoutes(app, fs);
    productRoutes(app, fs);
    catRoutes(app, fs);
    shoppingCartRoutes(app,fs);
    ordersRoutes(app,fs);
    statisticsRoutes(app,fs);

    // test
    testRoutes(app, fs);



};

module.exports = appRouter;