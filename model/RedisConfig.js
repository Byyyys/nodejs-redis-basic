const redis = require('redis');
const redisOptions = require('../config/RedisOptions')
///****  redisOptions  ->   { host: '127.0.0.1', port: 6379, db: 3, detect_buffers: true }

const options = {
  host: redisOptions.host,
  port: redisOptions.port,
  db: redisOptions.db,
  detect_buffers: redisOptions.detect_buffers, // 传入buffer 返回也是buffer 否则会转换成String
  retry_strategy: function (options) {
    // 重连机制
    if (options.error && options.error.code === "ECONNREFUSED") {
      // End reconnecting on a specific error and flush all commands with
      // a individual error
      return new Error("The server refused the connection");
    }
    if (options.total_retry_time > 1000 * 60 * 60) {
      // End reconnecting after a specific timeout and flush all commands
      // with a individual error
      return new Error("Retry time exhausted");
    }
    if (options.attempt > 10) {
      // End reconnecting with built in error
      return undefined;
    }
    // reconnect after
    return Math.min(options.attempt * 100, 3000);
  }
}
///****  options  ->   { host: '127.0.0.1', port: 6379, db: 3, detect_buffers: true, retry_strategy: [Function: retry_strategy] }


// 生成redis的client
const client = redis.createClient(options)
///****  client  ->   RedisClient {}  -->   redisClient 客户端的配置


/**
 * 存储值 string | object 类型的值
 * @param {*} key 
 * @param {*} value 
 */
const setValue = (key, value) => {
  if (typeof value === 'string') {
    client.set(key, value)
  } else if (typeof value === 'object') {///****    ->   如果value是 对象类型  则存储哈希格式 到  (域-值)对设置到哈希表key中
    for (let item in value) {
      client.hmset(key, item, value[item], redis.print)
    }
  }
}

// 获取 string 值
const getValue = (key) => {
  return new Promise((resolve, reject) => {
    client.get(key, (err, res) => {
      if (err) {
        reject(err)
      }else{
        resolve(res)
      }
    })
  })
}
 
/**
 * 获取 hash 值
 * @param {*} key
 * @returns Promise
 */
const getHValue = (key) => {
  return new Promise((resolve, reject) => {
    client.hgetall(key, function (err, value) {
      if (err) {
        reject(err)
      } else {
        resolve(value)
      }
    })
  })
}
 





const set_value = (key, val, callback) => {
    client.set(key, val, function(err, data){
      callback(data)
    })
}
const get_value = (key) => {
  return new Promise( (resolve, reject) => {
    client.get(key, function(err, data){
      if( err ) reject(err)
      resolve(data) 
    })
  })
}
const del_value = (key) => {
  return new Promise( (resolve, reject) => {
    client.del(key, function(err, data){
      if( err ) reject(err)
      resolve(data) 
    })
  })
}

const mset_value = (val1, val2, val3) => {
  client.mset( ["key1",val1, "key2",val2, "key3",val3 ],  redis.print)
}

const mget_value = (key) => {///****  key  ->   ["key1", "key2", "key3"]
  return new Promise( (resolve, reject) => {
    client.mget(key, function(err, data){
      if(err) reject(err)
      resolve(data) 
    })
  })
}
const incr = (key) => {
  client.incr(key, redis.print)
}
const decr = (key) => {
  client.decr(key, redis.print)
}
const setex = (key, seconds, value) => {
  client.setex(key, seconds, 'zhangsan', redis.print)   
}
const hset = (key,fiels, value) => {
  client.hset(key,fiels, value, redis.print)///****    ->   Reply: 1
}
const hget = (key, fiels) => {
  client.hget(key, fiels, redis.print)///****    ->   Reply: zhangsan
}
const hgetall = (key) => {
  client.hgetall(key, redis.print)///****    ->   Reply: [object Object]
}
/**hdel key field1 [field2]   eg: hdel('user', [username, age, sex]) */
const hdel = (key, arg) => {
  client.hdel(key, arg, redis.print)
}
/* hmset key field1 value1 field2 calue2 */
const hmset = (key, val) => {
  client.hmset(key, val, redis.print)
}
/* hmget key field1 field2 … */
const hmget = (key, val1, val2) => {
  client.hmget(key, [val1, val2], redis.print)
}
const hlen = (key) => {
  client.hlen(key, redis.print)
}
const hexists = (key, field) => {
  client.hexists(key, field, redis.print)
}



module.exports = {
  hexists,
  hlen,
  hmget,
  hmset,
  hdel,
  hgetall,
  hget,
  hset,
  setex,
  decr,
  incr,
  mget_value,
  mset_value,
  del_value,
  get_value,
  set_value,
  setValue,
  getValue,
  getHValue
} 