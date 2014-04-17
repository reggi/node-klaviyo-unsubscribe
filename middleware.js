var klaviyoToken = process.env.KLAVIYO_TOKEN;
var dotty = require("dotty");
var request = require("request");
var _ = require("underscore");

var klaviyoRequest = function(data, callback){
  console.log(data);
  var dataJsonString = JSON.stringify(data);
  var dataBuffer = new Buffer(dataJsonString);
  var dataBase64 = dataBuffer.toString("base64");
  request({
      "url": "https://a.klaviyo.com/api/track",
      "qs": {
        "data": dataBase64,
      }
    }, callback
  );
}

var middleware = {};

middleware.renderUnsubscribe = function(req, res, next){
  return res.render("unsubscribe", {
    "email": req.query.email
  });
};

middleware.validatePostUnsubscribe = function(req, res, next){
  var validOptions = [
    "weekly",
    "monthly",
    "quarterly",
    "yearly",
    "never",
  ];
  if(!dotty.exists(req,"body.email")) return next(new Error("no email in body"));
  if(!dotty.exists(req,"body.newsletters.product")) return next(new Error("no newsletter.product in body"));
  if(!dotty.exists(req,"body.newsletters.mindfulmatter")) return next(new Error("no newsletter.mindfulmatter in body"));
  if(!_.contains(validOptions, req.body.newsletters.product)) return next(new Error("invalid option for newsletters.product"));
  if(!_.contains(validOptions, req.body.newsletters.mindfulmatter)) return next(new Error("invalid option for newsletters.mindfulmatter"));
  return next();
}

middleware.requestKlaviyo = function(req, res){
  klaviyoRequest({
    "token": klaviyoToken,
    "event": "Unsubscribe Submission",
    "properties":{
      "newsletter-product": req.body.newsletters.product,
      "newsletter-mindfulmatter": req.body.newsletters.mindfulmatter,
    },
    "customer_properties": {
      "$email": req.body.email,
      "newsletter-products": req.body.newsletters.product,
      "newsletter-mindfulmatter": req.body.newsletters.mindfulmatter,
    }
  }, function(err, request, body){
      if(err) return next(err);
      if(body == "0") return next(new Error("unable to communcate with klaviyo api"));
      return res.json(body);
  });
}

module.exports = middleware;
