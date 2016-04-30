/**
 * Created by Papa on 4/29/2016.
 */
/**
 * Created by Papa on 4/23/2016.
 */
System.register(["./core/metadata/decorators", "./core/query/QueryState", "./core/repository/Repository"], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var decorators_1, QueryState_1, Repository_1;
    return {
        setters:[
            function (decorators_1_1) {
                decorators_1 = decorators_1_1;
            },
            function (QueryState_1_1) {
                QueryState_1 = QueryState_1_1;
            },
            function (Repository_1_1) {
                Repository_1 = Repository_1_1;
            }],
        execute: function() {
            exports_1("Entity", decorators_1.Entity);
            exports_1("ForeignKey", decorators_1.ForeignKey);
            exports_1("Repository", decorators_1.Repository);
            exports_1("QueryState", QueryState_1.QueryState);
            exports_1("QRepository", Repository_1.QRepository);
        }
    }
});
//# sourceMappingURL=index.js.map