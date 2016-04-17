/**
 * Created by Papa on 3/27/2016.
 */

import {Task} from "./Task";
import {Entity} from './core/entityDecorators';

@Entity
export class Goal extends Task {
	goalName:string;
	testBool:boolean;
	testBoolArray:boolean[];
	testStr:string;
	testStrArray:string[];
	testNum:number;
	testNumArray:number[];
}