# doo

Micro-framework to create chains (or loops) of promises that execute synchronously, but without blocking.

Caveat: I have only used this framework with Kris Kowal's Q and although the concepts are portable to other promise libraries, I'm not sure how well the code will port.


## Small!

The README has more lines than the source code. That's why there's no tests or package manager either. However, despite its small size, I like how easy it makes chaining asynchronous tasks to behave synchronously.

## Usage

### Chaining

Given several asynchronous tasks to run with the following constraints:

1) They have to be ran in order.

2) Only one task should execute at a time. Or to say it another way, the next task cannot start until the previous task finishes.

We can do the following with this framework:


We'll simulate the asynchronous promise with a setTimeout:
```
function asyncPromise( ms ) {
  var deferred = Q.defer();
  setTimeout( deferred.resolve, ms );
  return deferred.promise;
}
```
and require the necessary libraries:
```
var Q = require('q');
var doo = require('./doo.js');
```

Then create the chain of events wrapping each promise function in the `doo.next` wrapper
```
var chain = [
  doo.next(asyncPromise, 3500),
  doo.next(console.log, "Step 1 done"),
  doo.next(asyncPromise, 1500),
  doo.next(console.log, "Step 2 done")
];
```
Then to start the chain, we use `doo.inOrder`:
```
doo.inOrder(chain);
```

When ran, the promises are ran in order, and each waiting on the previous to complete before starting.

    
### Nested Chains

Sometimes it's easier to model the chain of events with a hierarchy, for example:
```
var waitFor = ayncPromise;  //irl the asyncPromise would usually not be a setTimeout fn

var chain1 = [
  doo.next(asyncPromise, 500),
  doo.next(asyncPromise, 300),
  doo.next(asyncPromise, 100)
];

var chain2 = [
  doo.next(asyncPromise, 400),
  doo.next(asyncPromise, 200)
];

var chains = [
  doon.ext(doInOrder, chain1),
  doo.next(waitFor, 3000),  //don't start the next chain right away
  doo.next(doInOrder, chain2)
];
```

The same command invokes the chain:
```
doo.inOrder(chains).then(logProm).catch(logErrProm);
```

Also, since `inOrder` returns a promise, you can capture the final output, or any errors, just like any other promise.

In the current implementation interim results are discarded. My thinking is that it'd be better to have the task itself emit its results rather than having this framework do it. Maybe there's a use case for the framework to handle it, but I  haven't encountered one yet.


### Looping

The library also allows for a continous loop of chained events:

```
var chain1 = [
  doo.next(asyncPromise, 2000),
  doo.next(asyncPromise, 1000),
  doo.next(asyncPromise, 500),
  doo.next(waitFor, 3000)
];
```
To loop, use `doo.loop` to invoke.

```
doo.loop(chain1);
```
The chain will loop until the process is stopped.

Note: There isn't a way of programmatically stopping a loop as of yet. I haven't needed that capability yet.


