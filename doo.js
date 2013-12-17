'use strict';

var Q = require('q');

function doNext(fn /* , arguments */){
  var args =  Array.prototype.splice.call(arguments, 1);
  return function(prevResolve){
    //not using previous results
    return fn.apply(null, args);
  };
}

function doInOrder(doNexters, init){
  return doNexters.reduce(Q.when, init);
}

function doLoop(chain){
  return doInOrder(chain).then(doNext(doLoop, chain));
}

module.exports = {
  next: doNext,
  inOrder: doInOrder,
  loop: doLoop
};