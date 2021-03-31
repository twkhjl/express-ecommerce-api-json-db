const authUser = require('../middlewares/authUser');
const verifyJWT = require('../middlewares/verifyJWT');

const testRoutes = (app, fs) => {


  // test middleware
  function middleware1(req, res, next) {
    // 錯誤發生(一)
    // throw new Error('fake error by throw'); 

    // 錯誤發生(二)
    // next(new Error('fake error by next()'));
    // return;

    //pass variables to next middleware
    req.data1 = {a:1,b:2,c:3};
    console.log('middleware1');
    // res.send('搶先送出回應'); // 這會引起錯誤，但不中斷： Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client 
    next(); // 引發下一個 middleware
  }
  function middleware2(req, res, next) {
    console.log('middleware2');
    next(); // 引發下一個 middleware
  }
  app.get('/middleware', middleware1, middleware2, function (req, res, next) {
    let obj = req.data1;
    let a = 1;
    console.log(obj["a"]);
    // res.send(Object.keys(obj)[0]);
    res.send(`${obj["a"]}`);
  });

  app.post('/testlogin',authUser);

  app.post('/testjwt',verifyJWT,function(req, res, next){
    res.send({result:'done'});
  });




};

module.exports = testRoutes;
