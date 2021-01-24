#!/usr/bin/env node
const { main, getScheduleAsDate } = require("../index");

function run() {
  const argv = require("yargs")
    .option("d", {
      alias: "date",
      describe: "show the schedule of that day",
      type: "string",
    })
    .usage("Usage: npmnba --date 2021-01-24")
    .example("npmnba --date 2021-01-24", "show the schedule of that day")
    .help("h")
    .alias("h", "help")
    .epilog("copyright 2021").argv;

  if (argv.d) {
    getScheduleAsDate(argv.d);
  } else {
    main();
  }
}

run();
