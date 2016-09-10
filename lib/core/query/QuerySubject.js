"use strict";
const rxjs_1 = require("rxjs");
/**
 * Created by shamsutdinov.artem on 8/8/2016.
 */
class QuerySubject {
    constructor(resultsUnsubscribeCallback) {
        this.resultsUnsubscribeCallback = resultsUnsubscribeCallback;
        this.querySubject = new rxjs_1.Subject();
        this.resultsSubject = new rxjs_1.Subject();
    }
    next(ieq) {
        this.querySubject.next(ieq);
    }
    subscribe(observerOrNext, error, complete) {
        let subscription = this.resultsSubject.subscribe(observerOrNext);
        let resultsSubscription = new ResultsSubscription(subscription, this.resultsUnsubscribeCallback);
        return resultsSubscription;
    }
}
exports.QuerySubject = QuerySubject;
class QueryOneSubject {
    constructor(resultsUnsubscribeCallback) {
        this.resultsUnsubscribeCallback = resultsUnsubscribeCallback;
        this.querySubject = new rxjs_1.Subject();
        this.resultsSubject = new rxjs_1.Subject();
    }
    next(ieq) {
        this.querySubject.next(ieq);
    }
    subscribe(observerOrNext, error, complete) {
        let subscription = this.resultsSubject.subscribe(observerOrNext);
        let resultsSubscription = new ResultsSubscription(subscription, this.resultsUnsubscribeCallback);
        return resultsSubscription;
    }
}
exports.QueryOneSubject = QueryOneSubject;
class ResultsSubscription {
    constructor(subscription, onUnsubscribe) {
        this.subscription = subscription;
        this.onUnsubscribe = onUnsubscribe;
    }
    unsubscribe() {
        this.subscription.unsubscribe();
        this.onUnsubscribe();
    }
    get closed() {
        return this.subscription.closed;
    }
    set closed(newClosed) {
        this.subscription.closed = newClosed;
    }
    add(teardown) {
        return this.subscription.add(teardown);
    }
    remove(sub) {
        this.subscription.remove(sub);
    }
}
exports.ResultsSubscription = ResultsSubscription;
//# sourceMappingURL=QuerySubject.js.map