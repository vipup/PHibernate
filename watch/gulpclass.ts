import {Gulpclass, SequenceTask, Task} from "gulpclass/Decorators";
import {Logger} from "./gulpsrc/build/Logger";
/**
 * Created by Papa on 3/26/2016.
 */

let gulp = require('gulp');
let del = require('del');

@Gulpclass()
export class Gulpfile {

	log:Logger;

	constructor() {
		this.log = new Logger();
	}

	@Task("clean-dist")
	clean(cb: Function) {
		return del(['./dist/**'], cb);
	}
	@Task()
	copyScripts() {
		return gulp.src("./src/**/*.js")
			.pipe(gulp.dest("./dist/**/*.js"));
	}
	@Task()
	copyStyles() {
		return gulp.src("./src/**/*.css")
			.pipe(gulp.dest("./dist/**/*.css"));
	}
	// @Task()
	// default() {
	// 	return ["copyScripts", "copyStyles"];
	// }
	@SequenceTask()
	default() {
		this.log.error('test logging');
		return ["clean-dist", ["copyScripts", "copyStyles"]];
	}

}