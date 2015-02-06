/*
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

	Notes: Old browsers may not support inline workers. In the latter
	case the jobs are executed syncroniously.

*/

var AdHocWorker = function() {
	this._isWorkable =
		(typeof Worker !== 'undefined') &&
		(typeof Blob !== 'undefined');
};

AdHocWorker.prototype.onRequest = function(onrequest) {
	if (this._isWorkable) {
		var
			blobURL = URL.createObjectURL(new Blob(
				[ '(function(){self.onmessage=(function(msg){(',
					onrequest.toString(),
					')(msg.data)});self.respond=self.postMessage})()' ],
				{ type: 'application/javascript' }
			));

		this.worker = new Worker(blobURL);

		URL.revokeObjectURL(blobURL);
	} else {
		this._onrequest = onrequest;
	}

	return this;
};

AdHocWorker.prototype.onResponse = function(onresponse) {
	if (this._isWorkable) {
		this.worker.onmessage = function (response) {
			onresponse(response.data);
		};
	} else {
		this._onresponse = onresponse;
	}

	return this;
};

AdHocWorker.prototype.request = function(request) {
	if (this._isWorkable) {
		this.worker.postMessage(request);
	} else {
		(function(_this) {
			if (! _this._onresponse) {
				console.error('AdHocWorker: You must call .onResponse() before .request()');
			} else {
				self.respond = _this._onresponse;
			}

			if (! _this._onrequest) {
				console.error('AdHocWorker: You must call .onRequest() before .request()');
			} else {
				_this._onrequest(request);
			}
		})(this)
	}

	return this;
};

module.exports = AdHocWorker;

