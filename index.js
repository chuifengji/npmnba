const chalk = require("chalk");
const inquirer = require("inquirer");
const request = require("https");
const { URL_GET_TODAY_SCHEDULE_JSON } = require("./config");
const { getUrlForPlayByPlay, displayMessages, getDateUrl } = require("./utils");

let promptList = [
  {
    type: "list",
    message: "选择比赛:",
    name: "gameDetail",
    choices: [],
  },
];

let gameList = [];
async function fetch(url) {
  return new Promise((resolve, reject) => {
    let rawData = "";
    request.get(url, (res) => {
      res.setEncoding("utf8");
      res.on("data", (chunk) => {
        rawData += chunk;
      });
      res.on("end", () => {
        resolve(rawData);
      });
      res.on("error", (err) => {
        throw new Error(err);
      });
    });
  });
}

async function getSchedule(date) {
  try {
    const realUrl = date || URL_GET_TODAY_SCHEDULE_JSON;
    const res = await fetch(realUrl);
    const todaySchedule = JSON.parse(res).payload.date;
    const { gameCount, games } = todaySchedule;
    let i = 0;
    const data = games.map((item) => {
      return {
        indexId: i++,
        homeTeam: item.homeTeam.profile.name,
        awayTeam: item.awayTeam.profile.name,
        homeScore: item.boxscore.homeScore,
        awayScore: item.boxscore.awayScore,
        gameId: item.profile.gameId,
      };
    });
    return data;
  } catch (err) {
    global.log(chalk.redBright(err));
  }
}

async function initialChoices(date) {
  let schedules = await getSchedule(date);
  gameList = schedules.map((item) => {
    return {
      gameId: item.gameId,
      name:
        item.homeTeam +
        " VS " +
        item.awayTeam +
        "  " +
        item.homeScore +
        " : " +
        item.awayScore,
    };
  });
  if (!date) {
    promptList[0].choices = gameList;
    promptList[0].choices[0].checked = true;
  }
}

function getGameId(name, games) {
  const game = games.find((item) => {
    return item.name === name;
  });
  console.log(game.gameId);
  return game.gameId;
}

async function getGameDetail(url) {
  try {
    const res = await fetch(url);
    const events = JSON.parse(res).payload.playByPlays[0].events;
    const realTimeData = events.map((e) => {
      return {
        description: e.description,
        socre: e.homeScore + " VS " + e.awayScore,
      };
    });
    return realTimeData;
  } catch (err) {
    global.log(chalk.redBright(err));
  }
}

async function getMessages(url) {
  let res = await getGameDetail(url);
  let messages = "";
  res.forEach((element, index) => {
    if (index < 15) messages += element.description + "\n";
  });
  return messages;
}

async function incessantDisplay(gameUrl) {
  setInterval(async () => {
    console.clear();
    const messages = await getMessages(gameUrl);
    displayMessages(messages);
  }, 5000);
}
async function main() {
  await initialChoices();
  inquirer.prompt(promptList).then(async (answers) => {
    const gameId = getGameId(answers.gameDetail, promptList[0].choices);
    const gameUrl = getUrlForPlayByPlay(gameId);
    const messages = await getMessages(gameUrl);
    displayMessages(messages);
    incessantDisplay(gameUrl);
  });
}

async function getScheduleAsDate(date) {
  await initialChoices(getDateUrl(date));
  let messages = "";
  gameList.forEach((element, index) => {
    messages += element.name + "\n";
  });
  log(messages);
}
module.exports = {
  main,
  getScheduleAsDate,
};
main();
