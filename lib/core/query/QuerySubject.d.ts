import { Subject } from "rxjs";
import { IEntity, IEntityQuery } from "querydsl-typescript";
import { Subscribable } from "rxjs/Observable";
import { Subscription, ISubscription, TeardownLogic } from "rxjs/Subscription";
import { PartialObserver } from "rxjs/Observer";
/**
 * Created by shamsutdinov.artem on 8/8/2016.
 */
export declare class QuerySubject<E, IE extends IEntity> implements Subscribable<E[]> {
    private resultsUnsubscribeCallback;
    querySubject: Subject<IEntityQuery<IE>>;
    resultsSubject: Subject<E[]>;
    constructor(resultsUnsubscribeCallback: () => void);
    next(ieq: IEntityQuery<IE>): void;
    subscribe(observerOrNext?: PartialObserver<E[]> | ((value: E[]) => void), error?: (error: any) => void, complete?: () => void): ISubscription;
}
export declare class QueryOneSubject<E, IE extends IEntity> implements Subscribable<E> {
    private resultsUnsubscribeCallback;
    querySubject: Subject<IEntityQuery<IE>>;
    resultsSubject: Subject<E>;
    constructor(resultsUnsubscribeCallback: () => void);
    next(ieq: IEntityQuery<IE>): void;
    subscribe(observerOrNext?: PartialObserver<E> | ((value: E) => void), error?: (error: any) => void, complete?: () => void): ISubscription;
}
export declare class ResultsSubscription implements Subscription {
    subscription: Subscription;
    private onUnsubscribe;
    constructor(subscription: Subscription, onUnsubscribe: () => void);
    unsubscribe(): void;
    closed: boolean;
    add(teardown: TeardownLogic): Subscription;
    remove(sub: Subscription): void;
}
