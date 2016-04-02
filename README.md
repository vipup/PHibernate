# PHibernate
Client side Hibernate for PouchDb and Spring/JPA/Relational

Will depend on https://github.com/russoturisto/QueryDSL-TypeScript

As Administrator (or sudo):

npm install typescript@next -g

npm install gulp -g

npm install typings -g

npm install gulpclass -g



Inside the project:

npm install

typings install node --ambient


To run the file watcher,

a) from within the 'watch\gulpsrc' directory:

tsc

b) within the 'watch\app' directory as the base:

node gulpsrc\build\FileWatcher.js

    Or, just open the project in WebStorm and debug the "FileWatcher" target.
