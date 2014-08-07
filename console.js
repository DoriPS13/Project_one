var repl = require('repl')
var db = require("./models")
var newREPL = repl.start("project one > ")

db.user.find(1).success(function(user){
		user.createItem({})
})
newREPL.context.db = db;