// import other routes
const userRoutes = require('./users');
const testRoutes = require('./test');

const verifyJWT = require('../middlewares/verifyJWT');


const appRouter = (app, fs) => {

    // default route
    app.get('/', (req, res) => {
        res.send('welcome to the development api-server');
    });

    // other routes
    userRoutes(app, fs);

    // verify jwt
    app.post('/jwt',
    verifyJWT,
    function(req, res, next){
        res.send({result:'done'});
      });
    
    // test
    testRoutes(app, fs);

    

};

module.exports = appRouter;