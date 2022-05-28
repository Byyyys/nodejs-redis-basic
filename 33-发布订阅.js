// 发布和订阅
// api说明
// 1.redis.createClient(redisConfig) 创建订阅者/发布者
// 2.subscriber.subscribe(‘channel1’) 订阅者订阅频道
// 3.publisher.publish(‘channel1’, ‘msg’) 发布者发送消息到知道频道
// 4.subscriber.unsubscribe(‘channel1’) 订阅者取消订阅频道
// 5.quit() 订阅者/发布者关闭redis连接


const redis = require("redis");
const opts = {
  auth_pass: "123456",
}
// 创建订阅者
const subscriber = redis.createClient( 5472,'127.0.0.1',opts);
// 创建发布者
const publisher = redis.createClient(5472,'127.0.0.1',opts);
// 订阅者监听消息
subscriber.on("message", function(channel, message) {
  console.log(`Sub received message in ${channel}: ${message}`);
});
// 订阅者订阅频道
subscriber.subscribe("channel1");
subscriber.subscribe("channel2");
 
let count = 0;
 
let interval = setInterval(() => {
  count ++;
  // 发布者发布消息
  publisher.publish('channel1', `${count}`);
  publisher.publish('channel2', `${count}`);
  if (count >= 3) {
    clearInterval(interval);
    // 订阅者取消订阅
    subscriber.unsubscribe("channel1");
    subscriber.unsubscribe("channel2");
    // 订阅者/发布者关闭redis连接
    subscriber.quit();
    publisher.quit();
  }
}, 1000);
 
 
 
 