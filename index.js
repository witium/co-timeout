
/**
 * Module dependencies.
 */

var parse = require('ms');
var co = require('co');

/**
 * Timeout with an error after `ms`.
 *
 * @param {Number|String} ms
 * @param {Generator} fn
 * @return {Function}
 * @api public
 */

module.exports = function(ms, fn){
  var fn = isGenerator(fn) ? co(fn) : fn;
  var ms = parse(ms);

  return function(done){
    var ended;
    var tid;

    tid = setTimeout(function(){
      if (ended) return;
      ended = true;
      var err = new Error('timeout of "' + ms + '" reached');
      err.timeout = ms;
      done(err);
    }, ms);

    fn(function(err){
      if (ended) return;
      ended = true;
      clearTimeout(tid);
      if (err) return done(err);
      var args = [].slice.call(arguments, 1);
      done.apply(null, [null].concat(args));
    });
  };
};

/**
 * Is generator.
 *
 * @param {Function} fn
 * @return {Boolean}
 * @api private
 */

function isGenerator(fn){
  return 0 == fn.constructor.name.indexOf('GeneratorFunction');
}
