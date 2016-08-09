import { Subject } from "rxjs";
import { IEntity } from "querydsl-typescript";
import { Subscribable } from "rxjs/Observable";
import { Subscription, ISubscription, TeardownLogic } from "rxjs/Subscription";
import { PartialObserver } from "rxjs/Observer";
/**
 * Created by shamsutdinov.artem on 8/8/2016.
 */
export declare class QuerySubject<E, IE extends IEntity> implements Subscribable<E[]> {
    private resultsUnsubscribeCallback;
    querySubject: Subject<IE>;
    resultsSubject: Subject<E[]>;
    constructor(e: {
        new (): E;
    }, resultsUnsubscribeCallback: () => void);
    next(ie: IE): void;
    subscribe(observerOrNext?: PartialObserver<E[]> | ((value: E[]) => void), error?: (error: any) => void, complete?: () => void): ISubscription;
}
export declare class QueryOneSubject<E, IE extends IEntity> implements Subscribable<E> {
    private resultsUnsubscribeCallback;
    querySubject: Subject<IE>;
    resultsSubject: Subject<E>;
    constructor(e: {
        new (): E;
    }, resultsUnsubscribeCallback: () => void);
    next(ie: IE): void;
    subscribe(observerOrNext?: PartialObserver<E> | ((value: E) => void), error?: (error: any) => void, complete?: () => void): ISubscription;
}
export declare class ResultsSubscription implements Subscription {
    subscription: Subscription;
    private onUnsubscribe;
    constructor(subscription: Subscription, onUnsubscribe: () => void);
    unsubscribe(): void;
    readonly isUnsubscribed: boolean;
    add(teardown: TeardownLogic): Subscription;
    remove(sub: Subscription): void;
}
