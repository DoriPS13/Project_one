var locu = require('locu');
var request = require('request');
var mclient = new locu.MenuItemClient(process.env.locuKey); 

// console.log(Object.keys(mclient));
mclient.search({name:'ramen', locality: "San Francisco"}, function(result){
	// console.log(result);
	var url = result.objects[0].resource_uri;
	var thing = result.objects[0].id

	// console.log(thing);


	mclient.request(thing, null, function (detailThing) {
		console.log(detailThing.objects);
	});












	// var url2 = ('http://api.locu.com/v1_0/menu_item/' + thing + '/?api_key=' + process.env.locuKey)
	// console.log("locu!url",url2);

	// request(url2, function(error, response, body) {
	// 	console.log(body)
	// });
	// var stuff = mclient.request(url);
	// console.log(stuff);
});