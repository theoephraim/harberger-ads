/* eslint-disable no-console */
const _ = require('lodash');
const nodemon = require('nodemon');
const chokidar = require('chokidar');
const { CLIEngine } = require('eslint');
const colors = require('colors'); // eslint-disable-line no-unused-vars

const cli = new CLIEngine({
  fix: true,
  cache: true,
  ignorePath: '.gitignore',
});
const formatter = cli.getFormatter();

let appProcess;
function runLinter() {
  // run eslint w/ fixes
  const report = cli.executeOnFiles(['./']);
  CLIEngine.outputFixes(report);

  // output Lint results
  console.log(formatter(report.results));

  // return info on whether any fixes were made
  return {
    fixes: _.some(report.results, 'output'),
    fatal: _.some(report.results, (file) =>
      _.some(file.messages, { fatal: true })),
  };
}
function startServer() {
  if (process.env.LINT_ONLY) return;
  if (appProcess) {
    console.log('>> Restarting server <<'.green);
    appProcess.restart();
  } else {
    console.log('>> Starting server <<'.green);
    appProcess = nodemon({
      script: 'app.js',
      watch: false,
      inspect: true,
    });
  }
}
function stopServer() {
  nodemon.emit('quit');
  appProcess = null;
}


let ignoreNextChange = false;

function lintAndRun() {
  if (ignoreNextChange) {
    ignoreNextChange = false;
    return;
  }

  const lintResults = runLinter();

  if (lintResults.fatal) {
    console.log('>> Fatal error detected by lint <<'.red);
    stopServer();
    console.log('>> FIX FATAL ERRORS TO START SERVER <<'.red);
    return;
  }

  if (lintResults.fixes) ignoreNextChange = true;
  startServer();
}

// watch files for changes, run linter and restart server
chokidar.watch('.', {
  ignored: [
    'node_modules', // ignore node_modules
    /(^|[/\\])\../, // ignore anything starting with .
    /.*\.(md|log)/, // ignore some file types
  ],
}).on('change', (event, path) => {
  lintAndRun();
});

lintAndRun();

//
// pass through exit to running app process
function exit() {
  console.log('>>> Shutting down dev server <<<'.red);
  nodemon.emit('quit');
  process.exit();
}
// explicitly exit on signal
process.on('SIGTERM', exit);
process.on('SIGINT', exit);
