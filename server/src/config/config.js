/**
 * 默认配置
 * @author limingpu
 */
module.exports = {
  redisConfig: {
    host: "localhost",
    port: "6379",
    password: "",
    db: 2,
  },
  // MySQL 配置
  dbConfig: {
    database: "yuindex",
    username: "root",
    password: "woshizhu123",
    host: "localhost",
    port: 3306,
  },
  // 百度翻译配置，自行申请免费版即可（https://fanyi-api.baidu.com/）
  baiduFanYiConfig: {
    appid: "",
    key: "",
  },
};
