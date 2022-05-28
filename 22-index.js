/**
 * nodejs操作redis总结
 */
// 本文总结常见的使用node操作redis服务,redis的key是唯一的,如果一个key所对应的存储类型是string,则不能再次覆盖式设置key为hash;
const redis = require('redis');
const client = redis.createClient( 6379, '127.0.0.1', {db: 2});
const util = require('util');

//string(字符串)
    // 1.一个字符串类型的值最大长度为512 M。
    // 2.常见操作: get,set,mget,mset,incr(计数器++),decr(--)等等;
async function fn () {
    client.set('hello', 5, function(err, obj) {
        // console.log( obj )//OK
        client.incr('hello', function(err,data) {
            // console.log(typeof data )//number
            client.get('hello', function(err,data) {
                // console.log(typeof data, data);//string 6
            })
        })
    })
    
}
// fn()




// hash(哈希)
//     hash可用来存储对象,一个Redis 列表中最多可存储232-1(40亿)个元素
function fn2 () {
    const obj = {
        uname:'sss',
        age:223
    }
    client.hset("test", obj, function(err, obj) {
        console.log( obj )
        client.hgetall('test', (err, obj) => {
            console.log(`hgetall:${JSON.stringify(obj)}`);
            // console.log(obj.age);
        })
        client.hget('test','name', function(err, name) {
            console.log('hget test name', name);
        })
    });
   
}
// fn2()




// lists(列表)
//     1.对于lists,使用send_command进行操作;
//     2.队列操作
//     3.list,常用操作, list,常用操作, lpush(首位添加),rpush(末位添加),lset(修改首位值),lindex(删除首位元素),lpop(删除末位元素)
//     4.一个Redis 列表中最多可存储232-1(40亿)个元素
function fn3 () {
    client.send_command('lset',['mylist',0,1], function(err,data) {
        console.log(data);          // OK
    })
    client.send_command('lpush',['mylist', 'one'], function(err, data) {
        console.log(data);          //OK 
    })
    
    // 使用命令行获取对应的索引下的结果
    // lindex mylist 0    'one'
    // lindex mylist 1   '1'
    // lindex mylist 2   'xxx'
    // lindex mylist 3   'xxx' 

}
// fn3()



// sets(集合)
//     1.sets 集合处理; 业务中用lodash进行交并补也是一个不错的选择。
//     2.常见操作: sadd、smembers、sinter(交)、sunion(并)、sdiff(补)、smove
//     3.集合中不允许重复成员的存在。当多次添加一个元素时，其结果会设置单个成员多次。一个Redis 集合中最多可包含232-1(40亿)个元素。
function fn4 () {
    let db1 = ['mysql','redis'];
    let db2 = ['mongo','redis'];
    client.sadd('db1',db1, function(err,data) {
        client.smembers('db1', function(err,data) {
            console.log(toString.call(data));               // [object Array]
            console.log('smemers:' + data);                 // 获取set中的成员, ['redis,mysql]  
        })
        client.sadd('db2', db2, function(err, data) {
            client.sinter('db1','db2', function(err,data) {
                console.log('sinter:' + data)                    //交集: sinter:redis
            });
            client.sunion('db1','db2', function(err,data) {
                console.log('sunion:' + data)                    // 并集: sunion:mongo,mysql,redis
            });
            client.sdiff('db1','db2', function(err,data) {
                console.log('SDIFF:' + data)                     // 补集: SDIFF:mysql
            })
        })
    });
   
}
// fn4()




// 有序集合(SortedSets):  常用操作: zadd(设置元素), zrange(获取范围内的元素),zrank(获取指定元素的排名，从0开始), zscore(获取指定元素的score，用户指定的score)
function fn5 () {
    client.zadd(['zdb',0,'mysql', 1,'mongo',2,'redis'], function(err, data) {
        console.log(data);           // 3
    })
   
}
// fn5()



// 事务: 事务(multi命令): 批量执行所有的命令，并统一返回结果
function fn6 () {
    client.multi()
    .set('xiao','xing')
    .get('xiao')
    .exec(function(err,replies) {
        console.log(replies);         // [ 'OK', 'xing' ]
    })

}
// fn6()


// 订阅发布模式
// 1.redis的订阅发布模式可用来做类似kafka的消息推送;
// 2.使用list + redis的订阅发布模式可以构建一个不错的消息队列;
function fn7 () {
    let sub = redis.createClient(6379, '127.0.0.1');   // 监听消费者
    let pub = redis.createClient(6379, '127.0.0.1');   // 生产者
    
    // 在sub开始监听时允许触发subscribe事件进行操作,类似连接数据库的connect事件
    sub.on('subscribe', function(channel, count) {
        console.log(`${channel}:${count}`);               //  test channel:1
        pub.publish('test channel', 'channel message test')
    })
    sub.on('message', function(channel, message) {
        console.log(`${channel}-message:${JSON.stringify(message)}`)    // test channel-message:"channel message test"
    })
    sub.subscribe('test channel');
   
}
// fn7()




// 对整个redis的所有客户端操作进行监听;:    monitor事件可以监听到redis收到的所有客户端命令
function fn7 () {
    client.monitor(function(err, res) {
        console.log(res);   // ok
    })
    client.on("monitor", function (time, args) {
        console.log(time + ": " + util.inspect(args));             // 1556285641.395573: [ 'lindex', 'myset', '2' ]
    });
}
// fn7()