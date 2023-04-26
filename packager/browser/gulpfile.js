const { task, watch, series, src } = require('gulp');
const syncy = require('syncy');
const jsonServer = require('gulp-json-srv');

const source = [
  '../../features/src/**', 
  '!../../features/src/**/mobile/**'
];

const destination = './src/workspace/';

task('copy-common', function (cb) {
  syncy(source, destination, {
    base: '../../features/src',
    updateAndDelete: true
  })
    .then(() => {
      cb();
    })
    .catch((err) => {
      cb(err);
    });
});

task('watch-common', function () {
  return watch(source, series('copy-common'));
});

task('sync-common', series('copy-common', 'watch-common'));

const server = jsonServer.create({ 
  port: 3001,
  customRoutes: { ...require('./src/mocks/routes'), ...require('../../features/src/mocks/routes') },
  rewriteRules: { ...require('./src/mocks/rewriteRules'), ...require('../../features/src/mocks/rewriteRules') }
});

task('json-server-db', function(){
  return src(['./src/mocks/data.json', './src/workspace/mocks/data.json'])
      .pipe(server.pipe());
});

task('json-server-watch', function () {
  watch(['./src/mocks/data.json', './src/workspace/mocks/data.json'], series('json-server-db'));
});

task('start-json-server', series('json-server-db', 'json-server-watch'));
