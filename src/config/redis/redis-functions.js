const redisClient = require("./redis");

const checkForExistence = async (redis_key, data_key, content_data) => {
  return new Promise(async (resolve, reject) => {
    redisClient.hgetall(redis_key, async (err, data) => {
      if (data == null) {
        let add_data = await addData(redis_key, data_key, content_data);
        resolve(true);
      } else {
        let update_data = await updateData(redis_key, data_key, content_data);
        resolve(true);
      }
    });
  });
};

const addData = async (redis_key, data_key, final_content) => {
  return new Promise((resolve, reject) => {
    redisClient.hmset(
      redis_key,
      [`${data_key}`, JSON.stringify(final_content)],
      (err, data) => {
        if (!err) {
          console.log({ ack: 1, msg: `Success: Add Data>>", ${data}` });
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
};

const updateData = async (redis_key, data_key, final_content) => {
  return new Promise((resolve, reject) => {
    redisClient.hmset(
      redis_key,
      [`${data_key}`, JSON.stringify(final_content)],
      (err, data) => {
        if (!err) {
          console.log({ ack: 1, msg: `Success: Update Data>>", ${data}` });
          resolve(true);
        } else {
          resolve(false);
        }
      }
    );
  });
};
module.exports = {
  addData: addData,
  updateData: updateData,
  checkForExistence: checkForExistence
};
