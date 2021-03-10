const redis = require("redis");

// const redisClient = redis.createClient(6379, '127.0.0.1');
const redisClient = redis.createClient({
  //host: "redis", //Uncomment this line when go for live
  enable_offline_queue: false
});

redisClient.on("connect", () => {
  console.log({ ack: 1, msg: "Success: Redis is connected" });
});

redisClient.on("error", err => {
  console.log({ ack: 0, msg: "Failure: Error in Redis", error: err });
});

module.exports = redisClient