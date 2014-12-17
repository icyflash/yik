require("cloud/app.js");
// Use AV.Cloud.define to define as many cloud functions as you want.
var YikMsg = AV.Object.extend('YikMsg');
// 定时删除消息
AV.Cloud.define("delete", function(request, response) {
    var now = new Date();
    now.setMinutes(now.getMinutes()-15);
    var query = new AV.Query(YikMsg);
    query.lessThan("createdAt", now);
    query.destroyAll({
        success: function () {
            console.log('删除成功');
        },
        error: function (error) {
            console.log(error);
        }
    });
});
