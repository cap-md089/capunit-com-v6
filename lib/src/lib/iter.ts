import { errorGenerator, ServerError } from '../typings/api';
import { AsyncEither, asyncEither } from './AsyncEither';
import { Either, EitherObj } from './Either';

export function* iterFromArray<T>(array: T[]): Iter<T> {
	for (const i of array) {
		yield i;
	}
}

export const iterMap = <T, U>(map: (v: T) => U) =>
	function* (iter: Iter<T>): Iter<U> {
		for (const i of iter) {
			yield map(i);
		}
	};

export type Iter<T> = Iterable<T> | IterableIterator<T> | Generator<T, any, any> | T[];
export type AsyncIter<T> =
	| Iter<T>
	| AsyncGenerator<T, any, any>
	| AsyncIterableIterator<T>
	| AsyncIterable<T>;

export function iterFilter<T>(filter: (v: T) => boolean): (iter: Iter<T>) => IterableIterator<T>;
export function iterFilter<T, S extends T>(
	filter: (v: T) => v is S
): (iter: Iter<T>) => IterableIterator<S>;

export function iterFilter<T>(filter: (v: T) => boolean) {
	return function* (iter: Iter<T>): Iter<T> {
		for (const i of iter) {
			if (filter(i)) {
				yield i;
			}
		}
	};
}

export const iterReduce = <T, U>(reducer: (prev: U, curr: T) => U) => (initialValue: U) => (
	iter: Iter<T>
) => {
	let value = initialValue;

	for (const i of iter) {
		value = reducer(value, i);
	}

	return value;
};

export function iterFind<T, S extends T>(
	predicate: (v: T) => v is S
): (iter: Iter<T>) => S | undefined;
export function iterFind<T>(predicate: (v: T) => boolean): (iter: Iter<T>) => T | undefined;

export function iterFind<T>(predicate: (v: T) => boolean) {
	return (iter: IterableIterator<T> | T[]): T | undefined => {
		for (const i of iter) {
			if (predicate(i)) {
				return i;
			}
		}
	};
}

export const iterIncludes = <T>(value: T) => (iter: Iter<T>): boolean => {
	for (const i of iter) {
		if (value === i) {
			return true;
		}
	}

	return false;
};

export const iterConcat = <T>(iter1: Iter<T>) =>
	function* (iter2: Iter<T>): Iter<T> {
		for (const item of iter1) {
			yield item;
		}

		for (const item of iter2) {
			yield item;
		}
	};

export const asyncIterHandler = <T>(errorHandler: (err: Error) => ServerError) =>
	async function* (iter: AsyncIterableIterator<T>) {
		const errorIter: AsyncIterator<EitherObj<ServerError, T>> = {
			async next(...args: [] | [undefined]) {
				try {
					const result = await iter.next(...args);

					if (result.done) {
						return { done: true, value: Either.right(result.value) };
					}

					return { done: false, value: Either.right(result.value) };
				} catch (e) {
					return { done: false, value: Either.left(errorHandler(e)) };
				}
			},
		};

		for await (const i of { [Symbol.asyncIterator]: () => errorIter }) {
			yield i;
		}
	};

export const asyncEitherIterMap = <T, U>(map: (v: T) => U | PromiseLike<U>) =>
	async function* (
		iter: AsyncIter<EitherObj<ServerError, T>>
	): AsyncIterableIterator<EitherObj<ServerError, U>> {
		for await (const i of iter) {
			if (i.direction === 'left') {
				yield i;
			} else {
				yield Either.right(await map(i.value));
			}
		}
	};

export const asyncEitherIterFlatMap = <T, U>(map: (v: T) => AsyncEither<ServerError, U>) =>
	async function* (
		iter: AsyncIter<EitherObj<ServerError, T>>
	): AsyncIterableIterator<EitherObj<ServerError, U>> {
		for await (const i of iter) {
			if (i.direction === 'left') {
				yield i;
			} else {
				yield asyncEither(i, errorGenerator('Wat')).flatMap(map);
			}
		}
	};

export const asyncIterMap = <T, U>(map: (v: T) => U | PromiseLike<U>) =>
	async function* (iter: AsyncIter<T>): AsyncIterableIterator<U> {
		for await (const i of iter) {
			yield map(i);
		}
	};

export const asyncIterStatefulMap = <S>(initialState: S) => <T, U>(
	map: (
		value: T,
		state: S
	) => [S, U | PromiseLike<U>] | PromiseLike<[S, U]> | AsyncEither<ServerError, [S, U]>
) => (iter: AsyncIter<T>): [Promise<S>, AsyncIterableIterator<U>] => {
	let res: (state: S) => void;
	let rej: (err: Error) => void;

	return [
		new Promise<S>((resolve, reject) => {
			res = resolve;
			rej = reject;
		}),
		(async function* () {
			let state = typeof initialState === 'object' ? { ...initialState } : initialState;
			let yieldValue;

			try {
				for await (const i of iter) {
					const mapObj = map(i, state);

					if (mapObj instanceof AsyncEither) {
						[state, yieldValue] = await mapObj.fullJoin();
					} else {
						[state, yieldValue] = await mapObj;
					}

					yield yieldValue;
				}
			} catch (e) {
				rej!(e);
			}

			res!(state);
		})(),
	];
};

export const asyncIterFlatMap = <T, U>(map: (v: T) => U | PromiseLike<U>) =>
	async function* (iter: AsyncIter<AsyncIter<T>>): AsyncIterableIterator<U> {
		for await (const i of iter) {
			for await (const j of i) {
				yield map(j);
			}
		}
	};

export function asyncIterFilter<T>(
	filter: (v: T) => boolean | PromiseLike<boolean>
): (iter: AsyncIter<T>) => AsyncIterableIterator<T>;
export function asyncIterFilter<T, S extends T>(
	filter: (v: T) => v is S
): (iter: AsyncIter<T>) => AsyncIterableIterator<S>;

export function asyncIterFilter<T>(filter: (v: T) => boolean | PromiseLike<boolean>) {
	return async function* (iter: AsyncIter<T>): AsyncIterableIterator<T> {
		for await (const i of iter) {
			if (await filter(i)) {
				yield i;
			}
		}
	};
}

export const asyncIterReduce = <T, U>(reducer: (prev: U, curr: T) => U | PromiseLike<U>) => (
	initialValue: U
) => async (iter: AsyncIter<T>): Promise<U> => {
	let value = initialValue;

	for await (const i of iter) {
		value = await reducer(value, i);
	}

	return value;
};

export const asyncIterAny = <T>(predicate: (item: T) => boolean) => async (
	items: AsyncIter<T>
): Promise<boolean> => {
	for await (const item of items) {
		if (predicate(item)) {
			return true;
		}
	}

	return false;
};

export const asyncIterTap = <T>(tapfunction: (value: T) => void | Promise<void>) =>
	async function* (iter: AsyncIter<T>) {
		for await (const i of iter) {
			await tapfunction(i);
			yield i;
		}
	};

export const asyncIterConcat = <T>(iter1: AsyncIter<T>) =>
	async function* (iter2: () => AsyncIter<T>) {
		for await (const item of iter1) {
			yield item;
		}

		for await (const item of iter2()) {
			yield item;
		}
	};

export const yieldObj = function* <T>(item: T): IterableIterator<T> {
	yield item;
};

export const yieldObjAsync = async function* <T>(item: PromiseLike<T>): AsyncIterableIterator<T> {
	yield item;
};

export const yieldAsyncEither = async function* <T>(
	item: AsyncEither<ServerError, T>
): AsyncIterableIterator<EitherObj<ServerError, T>> {
	yield item;
};

export const yieldEmpty = async function* <T>(): AsyncIterableIterator<T> {
	// does nothing
};

// Useful when combined with reduce to count items
export const addOne = (i: number): number => i + 1;
export const ZERO = 0;

export const countAsync = asyncIterReduce(addOne)(ZERO);
export const count = iterReduce(addOne)(ZERO);

export const maxAsync = asyncIterReduce(Math.max)(Number.NEGATIVE_INFINITY);
export const max = iterReduce(Math.max)(Number.NEGATIVE_INFINITY);

export const minAsync = asyncIterReduce(Math.min)(Number.POSITIVE_INFINITY);
export const min = iterReduce(Math.min)(Number.POSITIVE_INFINITY);

export const statefulFunction = <S>(initialState: S) => <T, U>(
	func: (val: T, state: S) => [U, S]
) => {
	let state = initialState;
	let returnValue;

	return (val: T) => {
		[returnValue, state] = func(val, state);

		return returnValue;
	};
};