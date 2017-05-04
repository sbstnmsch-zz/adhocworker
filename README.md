# adhocworker

[![Greenkeeper badge](https://badges.greenkeeper.io/sbstnmsch/adhocworker.svg)](https://greenkeeper.io/)
Create web workers on the fly and inline

This is a cross-browser inline-webworker to execute long running or
blocking jobs in a second thread.

Use it like:

```
new AdHocWorker()
	.onRequest(
		function(request) {
			// Do something longrunning with request
			self.respond(request + 1);
		})
	.onResponse(
		function(response) {
			alert('Result of increment: ' + response);
		})
	.request(1);
```

Note: Old browsers may not support inline workers. In the latter
case the jobs are executed syncroniously.

