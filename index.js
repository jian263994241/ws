const path = require('path');

const webpack = require('webpack');

const wpConf = {
  dev : require('./webpack.config.dev'),
  prod : require('./webpack.config.prod')
};

const WebpackDevServer = require('webpack-dev-server');


exports.dev = function(){
  let compiler = webpack(wpConf.dev, (err, stats) => {
    if (err) {
      console.error(err.stack || err);
      if (err.details) {
        console.error(err.details);
      }
      return;
    }
    // Done processing
    let info = stats.toString({colors: true});

    console.info(info);
  });

  let server = new WebpackDevServer(compiler);

  server.listen(8080, "127.0.0.1", function() {
  	console.log("Starting server on http://localhost:8080");
  });
};


exports.prod = function(){

};
