var RDS_PORT = 5472;
var RDS_HOST = '127.0.0.1';
var RDS_PWD = '123456';
 
const opts = {
    auth_pass: RDS_PWD,
  }
 
const redis = require('redis');
const client = redis.createClient(RDS_PORT, RDS_HOST,opts);
 
client.on('connect',function(){
  console.log('redis connect success!');
});
client.on('end',function(err){
  console.log('end');
});
client.on('error', function (err) {
  console.log('err' + err);
});
client.on('ready', function () {
  client.publish('testFirst', 'hi! first!');
  client.publish('testSecond', 'hi! second!');
  client.publish('message', 'hi! message!');
});