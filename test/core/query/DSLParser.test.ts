/// <reference path="../../typings/tsd.d.ts"/>

/**
 * Created by Papa on 5/10/2016.
 */

import {expect} from 'chai';
import {DSLParser} from "../../../src/core/query/DSLParser";

describe('test', () => {
	it('should do something', () => {
		console.log('test');
		let queryState = DSLParser.parse(`
		WHERE
				c = d
			a = :b
		`);
		expect(true).to.be.equal(true);
	});
});