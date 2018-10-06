/* eslint-disable no-console */
const _ = require('lodash');
const chokidar = require('chokidar');
const { CLIEngine } = require('eslint');
const { execSync } = require('child_process');
require('colors');

const [node, script, ...args] = process.argv;// eslint-disable-line no-unused-vars

function exec(cmd) {
  return execSync(cmd, { stdio: 'inherit' });
}
function execAndReturn(cmd) {
  return execSync(cmd).toString();
}

const cli = new CLIEngine({
  fix: true,
  cache: true,
  ignorePath: '.gitignore',
});
const formatter = cli.getFormatter();

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

function runTests() {
  // first we check matching test files
  const filesToRun = execAndReturn([
    'jest',
    '--listTests',
    ...args,
  ].join(' ')).split('\n');
  filesToRun.pop(); // has an extra blank line
  if (filesToRun.length === 0) {
    console.log('No matching tests'.red);
    process.exit(1);
  }
  if ((filesToRun.length > 1 || filesToRun.length === 0) && process.env.TEST_RECORD_MODE) {
    console.log('--- Matching test files ---'.red);
    console.log(filesToRun);
    console.log('You can only run `npm test:record` on one file at a time!'.red);
    process.exit(1);
  }

  exec([
    ...process.env.TEST_RECORD_MODE ? ['TEST_RECORD_MODE=1'] : [], // pass through
    'jest',
    '-i',
    ...args,
  ].join(' '));
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
    console.log('>> FIX FATAL ERRORS TO RUN TESTS <<'.red);
    return;
  }

  if (lintResults.fixes) ignoreNextChange = true;
  runTests();
}

// watch files for changes, run linter and restart server
chokidar.watch('.', {
  ignored: [
    'node_modules', // ignore node_modules
    /(^|[/\\])\../, // ignore anything starting with .
    /.*\.(md|log|fx.json)/, // ignore some file types
  ],
}).on('change', (event, path) => {
  lintAndRun();
});

lintAndRun();

//
// pass through exit to running app process
function exit() {
  console.log('>>> Shutting down test server <<<'.red);
  process.exit();
}
// explicitly exit on signal
process.on('SIGTERM', exit);
process.on('SIGINT', exit);
