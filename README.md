# PHibernate
Client side Hibernate for PouchDb and Spring/JPA/Relational

As Administrator (or sudo):

npm install typescript@next -g

npm install gulp -g

npm install typings -g

npm install gulpclass -g



Inside the project:

npm install

typings install node --ambient


To run the parser,

a) from within the 'watch\gulpsrc' directory:

tsc

b) from within the 'watch' directory:

node gulpsrc\build\entityDefinitionGenerator.js app\Goal.ts app\Task.ts