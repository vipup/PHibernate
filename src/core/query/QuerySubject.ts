import {Subject} from "rxjs";
import {IEntity, IEntityQuery} from "querydsl-typescript";
import {Subscribable} from "rxjs/Observable";
import {Subscription, ISubscription, TeardownLogic} from "rxjs/Subscription";
import {PartialObserver} from "rxjs/Observer";
/**
 * Created by shamsutdinov.artem on 8/8/2016.
 */

export class QuerySubject<E, IE extends IEntity> implements Subscribable<E[]> {

	querySubject: Subject<IEntityQuery<IE>> = new Subject<IEntityQuery<IE>>();
	resultsSubject: Subject<E[]> = new Subject<E[]>();

	constructor(
		private resultsUnsubscribeCallback: () => void
	) {
	}

	next(ieq: IEntityQuery<IE>) {
		this.querySubject.next(ieq);
	}

	subscribe(
		observerOrNext?: PartialObserver<E[]> | ((value: E[]) => void), error?: (error: any) => void,
		complete?: () => void
	): ISubscription {
		let subscription = this.resultsSubject.subscribe(observerOrNext);
		let resultsSubscription = new ResultsSubscription(subscription, this.resultsUnsubscribeCallback);

		return resultsSubscription;
	}

}

export class QueryOneSubject<E, IE extends IEntity> implements Subscribable<E> {

	querySubject: Subject<IEntityQuery<IE>> = new Subject<IEntityQuery<IE>>();
	resultsSubject: Subject<E> = new Subject<E>();

	constructor(
		private resultsUnsubscribeCallback: () => void
	) {
	}

	next(ieq: IEntityQuery<IE>) {
		this.querySubject.next(ieq);
	}

	subscribe(observerOrNext?: PartialObserver<E> | ((value: E) => void), error?: (error: any) => void, complete?: () => void): ISubscription {
		let subscription = this.resultsSubject.subscribe(observerOrNext);
		let resultsSubscription = new ResultsSubscription(subscription, this.resultsUnsubscribeCallback);

		return resultsSubscription;
	}

}

export class ResultsSubscription implements Subscription {

	constructor(
		public subscription: Subscription,
		private onUnsubscribe: ()=>void
	) {

	}

	unsubscribe(): void {
		this.subscription.unsubscribe();
		this.onUnsubscribe();
	}

	get closed(): boolean {
		return this.subscription.closed;
	}
	set closed(newClosed: boolean) {
		this.subscription.closed = newClosed;
	}

	add(teardown: TeardownLogic): Subscription {
		return this.subscription.add(teardown);
	}

	remove(sub: Subscription): void {
		this.subscription.remove(sub);
	}

}
