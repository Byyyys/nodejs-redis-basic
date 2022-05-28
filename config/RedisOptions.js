const options = {
    host: '127.0.0.1',
    port: 6379,
    db: 3,
    detect_buffers: true // 传入buffer 返回也是buffer 否则会转换成String
  }
   
  module.exports = options