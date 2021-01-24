const date = new Date();
const year = date.getFullYear();
const day = date.getDate();
let month = date.getMonth() + 1;

month < 10 && (month = "0" + month);
const today = year + "-" + month + "-" + day;

module.exports = {
  URL_GET_TODAY_SCHEDULE_JSON:
    "https://china.nba.com/static/data/scores/daily.json",
};
