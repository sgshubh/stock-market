const ENUMS = require("./enums");

class Response {
  constructor(ack, msg, data) {
    this.ack = ack;
    this.msg = msg;
    this.data = data;
  }
}

exports.sendSuccessResponseObject = async (data, msg, res) => {
  res.status(200).json(new Response(ENUMS.RESPONSE_CODE.SUCCESS, msg, data));
};

exports.sendFailureResponseObject = async (data, msg, res) => {
  res.status(404).json(new Response(ENUMS.RESPONSE_CODE.ERROR, msg, data));
};
