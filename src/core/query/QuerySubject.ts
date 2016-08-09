import {Subject} from "rxjs";
import {IEntity} from "querydsl-typescript";
import {Subscribable} from "rxjs/Observable";
import {ISubscription} from "rxjs/Subscription";
/**
 * Created by shamsutdinov.artem on 8/8/2016.
 */

export class QuerySubject<E, IE extends IEntity> implements Subscribable<E> {

  querySubject: Subject<IE> = new Subject<IE>();
  resultsSubject: Subject<E> = new Subject<E>();

  constructor(e: {new (): E}) {
    super();
  }

  next(ie: IE) {
    this.querySubject.next(ie);
  }

  subscribe(observerOrNext?: PartialObserver<T> | ((value: T) => void), error?: (error: any) => void, complete?: () => void): Subscription {
    let subscription = this.resultsSubject.subscribe(observerOrNext);
    let resultsSubscription = new ResultsSubscription(subscription, () => {

    });
  }

}

export class ResultsSubscription implements ISubscription {

  constructor(public subscription: Subscription,
              private onUnsubscribe: ()=>void) {

  }

  unsubscribe(): void {
    this.subscription.unsubscribe();
    this.onUnsubscribe();
  }

  get isUnsubscribed(): boolean {
    return this.subscription.isUnsubscribed;
  }

  add(teardown: TeardownLogic): ISubscription {
    return this.subscription.add(teardown);
  }

  remove(sub: ISubscription): void {
    this.subscription.remove(sub);
  }

}
