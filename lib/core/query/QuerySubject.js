"use strict";
const rxjs_1 = require("rxjs");
/**
 * Created by shamsutdinov.artem on 8/8/2016.
 */
class QuerySubject {
    constructor(e, resultsUnsubscribeCallback) {
        this.resultsUnsubscribeCallback = resultsUnsubscribeCallback;
        this.querySubject = new rxjs_1.Subject();
        this.resultsSubject = new rxjs_1.Subject();
    }
    next(ie) {
        this.querySubject.next(ie);
    }
    subscribe(observerOrNext, error, complete) {
        let subscription = this.resultsSubject.subscribe(observerOrNext);
        let resultsSubscription = new ResultsSubscription(subscription, this.resultsUnsubscribeCallback);
        return resultsSubscription;
    }
}
exports.QuerySubject = QuerySubject;
class QueryOneSubject {
    constructor(e, resultsUnsubscribeCallback) {
        this.resultsUnsubscribeCallback = resultsUnsubscribeCallback;
        this.querySubject = new rxjs_1.Subject();
        this.resultsSubject = new rxjs_1.Subject();
    }
    next(ie) {
        this.querySubject.next(ie);
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
    get isUnsubscribed() {
        return this.subscription.isUnsubscribed;
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