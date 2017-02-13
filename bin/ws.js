#!/usr/bin/env node

const Liftoff = require('liftoff');
const argv = require('minimist')(process.argv.slice(2));
const path = require('path');
const cli = new Liftoff({
  name: 'wp', // 命令名字
  processTitle: 'wp',
  moduleName: 'wp',
  configName: 'webpack-config',
  // only js supported!
  extensions: {
    '.js': null
  }
});

const wp = require('../index');

cli.launch({
  cwd: argv.r || argv.root,
  configPath: argv.f || argv.file
}, function(env) {
  // console.log(env , argv._);
  if(argv._.length == 0){
    //dev
    wp.dev();
  }else{
    // prod
  }

});
