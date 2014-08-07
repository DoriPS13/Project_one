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






<script>

	L.mapbox.accessToken = 'pk.eyJ1IjoiZG9yaXBzMTMiLCJhIjoic0FNRE51byJ9.SSNLexDQmGPKXiJ1TH4lvw';
	var map = L.mapbox.map('map', 'examples.map-20v6611k')
	    .setView(['<%= ramen.venue.lat %>', '<%=ramen.venue.long %>'], 16);

	L.mapbox.featureLayer({
	    // this feature is in the GeoJSON format: see geojson.org
	    // for the full specification
	    type: 'Feature',
	    geometry: {
	        type: 'Point',
	        // coordinates here are in longitude, latitude order because
	        // x, y is the standard for GeoJSON and many formats
	        coordinates: [
	         '<%=ramen.venue.long %>', 
	         '<%= ramen.venue.lat %>'
	        ]
	    },
	    properties: {
	        title:'<%= ramen.venue.name %>',
	        description:'<%= ramen.venue.street_address %>', 
	        // one can customize markers by adding simplestyle properties
	        // https://www.mapbox.com/foundations/an-open-platform/#simplestyle
				    "marker-symbol": "star",
				    "marker-size": "medium",
				    "marker-color": "#f44"
	    }
	}).addTo(map);
}
</script>





	// var url2 = ('http://api.locu.com/v1_0/menu_item/' + thing + '/?api_key=' + process.env.locuKey)
	// console.log("locu!url",url2);

	// request(url2, function(error, response, body) {
	// 	console.log(body)
	// });
	// var stuff = mclient.request(url);
	// console.log(stuff);
});