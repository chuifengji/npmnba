const chalk = require("chalk");
global.log = console.log;
global.currentPeriod = 4;
module.exports = {
  getUrlForPlayByPlay: (gameId) => {
    return (
      "https://china.nba.com/static/data/game/playbyplay_" +
      gameId +
      "_" +
      global.currentPeriod +
      ".json"
    );
  },
  displayMessages: (messages) => {
    log(chalk.rgb(255, 136, 0).bold(messages));
  },
  getDateUrl: (date) => {
    return "https://m.china.nba.com/static/data/scores/daily_" + date + ".json";
  },
};
