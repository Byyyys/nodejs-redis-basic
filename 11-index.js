const redis = require('./model/RedisConfig')
///****  redis  ->   {setValue: [Function: setValue], getValue: [Function: getValue], getHValue: [Function: getHValue] }

//## 参考文档：
      //https://blog.csdn.net/zzu_seu/article/details/106323114?spm=1001.2101.3001.6650.10&utm_medium=distribute.pc_relevant.none-task-blog-2~default~BlogCommendFromBaidu~default-10.highlightwordscore&depth_1-utm_source=distribute.pc_relevant.none-task-blog-2~default~BlogCommendFromBaidu~default-10.highlightwordscore
      //https://www.freesion.com/article/5782175305/


/*存储 字符串 类型的值  */
// const res = setValue('book', 'yuwen')
///****  res  ->   undefined
console.dir('====================================================================================')
/*存储 哈希 类型的 值  */
// const set = setValue('student', {uname: "zhangsan", age: 23, sex: 1})
///****  set  ->   Reply: Ok
console.dir('====================================================================================')



/*获取 string 类型的值------ 字符串 */
async function string () {
  const res = await getValue('book')
  // /****  res  ->   yuwen

  const ress = getValue('book').then( res => console.log( res )).catch( err => {throw new Error(err)})///****  res  ->   yuwen
  ///****  ress  ->   Promise { <pending> }
} 
//string()



/*获取 object 类型的值------ 哈希   */
async function hash () {
  const res = await getHValue('student')
  ///****  res  ->   { uname: 'zhangsan', age: '23', sex: '1' }

  const rs = getHValue('student').then(res => {
    // console.log(res)  ///****  res  ->   { uname: 'zhangsan', age: '23', sex: '1' }
  }).catch( err => {
    throw new Error(err)
  })
}    
//hash()



/**
 * 五种数据类型及其使用场景
    string --> String
    hash --> Hashmap
    list --> LinkList
    set --> HashSet
    sorted_set --> TreeSet
 */

/*添加、修改 数据 */
// redis.set_value('key1', 'str',function(fn) {console.log( fn )})     ///****    ->   OK

/*获取数据 */
// redis.get_value('key1').then(data => console.log( data )).catch(err => console.log( err ))  ///****    ->   str

/*删除数据  */
// redis.del_value('key1').then(data => console.log( data )).catch(err => console.log( err ))   ///****    ->   1

/*添加、修改多个数据  */
// redis.mset_value( 20, 30 ,40 )

/*获取多个数据  */
// redis.mget_value(["key1", "key2", "key3"]).then(data => {console.log( data )}).catch(err => {console.log( err )})///****    ->   [ '20', '30', '40' ]
// async function fn() {console.log(await redis.mget_value(["key1", "key2", "key3"]) )} fn()    ///[ '20', '30', '40' ]

/*设置自增 +1  */
// redis.set_value('age', 1, function(data){console.log( data )}) //Ok
// redis.incr('age') //2

/* 设置自减 -1 */
// redis.set_value('age', 2, function(data){console.log( data )}) //Ok
// redis.decr('age') // 1

/*数据时效性设置 */
// redis.setex('username', 20, 'zhangsan') 
// redis.get_value('username').then(data => console.log( data ))
     
/*添加/修改数据  */
// redis.hset('user', 'username', 'zhangsan')
// redis.hset('user', 'hobby', '喝酒')
// redis.hget('user', 'username')
// redis.hgetall('user')

/*删除多个数据  */
// redis.hdel('user', ['username', 'hobby'])

/*添加/修改多个数据  */

// redis.hmset('hmset', 123)
// redis.hmset('hmset', '吃饭了么')
// redis.hmset('hmset', [1, 2, 3])
// redis.hmset('hmset', true)
// redis.hmset('hmset', {username: '张三', age: 333, hobby: '吃屎'}) ///只能传对象

// redis.hmget('hmset', 'username', 'hobby')

/**获取哈希表中字段的数量 */
// redis.hlen('hmset') //3


/**获取哈希表中是否存在指定的字段 */  
// redis.hexists('hmset', 'username')//1