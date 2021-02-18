///////////////AZIMUTHAL
var d3_geo_radians = Math.PI / 180;
// TODO clip input coordinates on opposite hemisphere
d3.geo.azimuthal = function() {
  var mode = "orthographic", // or stereographic, gnomonic, equidistant or equalarea
  origin,
  scale = 200,
  translate = [480, 250],
  x0,
  y0,
  cy0,
  sy0;

  function azimuthal(coordinates) {
  	var x1 = coordinates[0] * d3_geo_radians - x0,
  	y1 = coordinates[1] * d3_geo_radians,
  	cx1 = Math.cos(x1),
  	sx1 = Math.sin(x1),
  	cy1 = Math.cos(y1),
  	sy1 = Math.sin(y1),
  	cc = mode !== "orthographic" ? sy0 * sy1 + cy0 * cy1 * cx1 : null,
  	c,
  	k = mode === "stereographic" ? 1 / (1 + cc)
  	: mode === "gnomonic" ? 1 / cc
  	: mode === "equidistant" ? (c = Math.acos(cc), c ? c / Math.sin(c) : 0)
  	: mode === "equalarea" ? Math.sqrt(2 / (1 + cc))
  	: 1,
  	x = k * cy1 * sx1,
  	y = k * (sy0 * cy1 * cx1 - cy0 * sy1);
  	return [
  	scale * x + translate[0],
  	scale * y + translate[1]
  	];
  }

  azimuthal.invert = function(coordinates) {
  	var x = (coordinates[0] - translate[0]) / scale,
  	y = (coordinates[1] - translate[1]) / scale,
  	p = Math.sqrt(x * x + y * y),
  	c = mode === "stereographic" ? 2 * Math.atan(p)
  	: mode === "gnomonic" ? Math.atan(p)
  	: mode === "equidistant" ? p
  	: mode === "equalarea" ? 2 * Math.asin(.5 * p)
  	: Math.asin(p),
  	sc = Math.sin(c),
  	cc = Math.cos(c);
  	return [
  	(x0 + Math.atan2(x * sc, p * cy0 * cc + y * sy0 * sc)) / d3_geo_radians,
  	Math.asin(cc * sy0 - (p ? (y * sc * cy0) / p : 0)) / d3_geo_radians
  	];
  };

  azimuthal.mode = function(x) {
  	if (!arguments.length) return mode;
  	mode = x + "";
  	return azimuthal;
  };

  azimuthal.origin = function(x) {
  	if (!arguments.length) return origin;
  	origin = x;
  	x0 = origin[0] * d3_geo_radians;
  	y0 = origin[1] * d3_geo_radians;
  	cy0 = Math.cos(y0);
  	sy0 = Math.sin(y0);
  	return azimuthal;
  };

  azimuthal.scale = function(x) {
  	if (!arguments.length) return scale;
  	scale = +x;
  	return azimuthal;
  };

  azimuthal.translate = function(x) {
  	if (!arguments.length) return translate;
  	translate = [+x[0], +x[1]];
  	return azimuthal;
  };

  return azimuthal.origin([0, 0]);
};
/////AZIMUTHAL

var formatDecimalComma = d3.format(",.2f");
var margin = {top: 20, right: 20, bottom: 20, left: 20};
width = 800 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom,
formatPercent = d3.format(".1%");

queue()
.defer(d3.csv, "data/cleaned-choro.csv")
.defer(d3.json, "data/cleaned-nsw-10.geojson")
.await(ready);

//queue()
//.defer(d3.csv, "data/new-clean-traff.csv")
//.defer(d3.json, "data/nsw-poll.geojson")
//.await(ready);

var legendText = ["0","30", "60", "90", "100", "130"];
var legendColors = ["#FFFFFF","#ffebeb","#ffb1b1","#ff7676","#ff3b3b"];

var year = 2015
function ready(error, data, us) {
//    console.log(data);
	data.forEach(function(d) {
		d.area = +d.area;
		d.year = +d.year;
		d.zipcode = +d.zipcode;
		d.id = +d.id;
	});

	var dataByCountyByYear = d3.nest()
	.key(function(d) { return d.Name; })
	.key(function(d) { return d.year; })
	.map(data);

	var counties  = us

	counties.features.forEach(function(county) {
		 
		county.properties.years = dataByCountyByYear[county.properties['Name']]
        console.log(county)
	});
    
	var color = d3.scale.threshold()
	.domain([0,20,30,40,50,60,70,80,90,100,110,120,130,140])
	.range(["#FFFFFF","#FFFFFF","#ffebeb","#ffd8d8","#ffc4c4","#ffb1b1","#ff9d9d","#ff8989","#ff7676","#ff2626","#ff4e4e","#ff3b3b","#ff1414"]);

	var projection = d3.geo.azimuthal()
	.origin([150, -33])
	.translate([100,200])
	.scale(10000);

	var path = d3.geo.path()
	.projection(projection);

	var colorScale = d3.scale.threshold()
  .domain([0,20,30,40,50,60,70,80,90,100,110,120,130,140])
  .range(["#FFFFFF","#ff6500","#eb5d00","#d85500","#c44e00","#b14600","#9d3e00","#893600","#762f00","#622700","#4e1f00","#3b1700","#271000","#140800"]);

	
	var svg = d3.select("#map").append("svg")
	.attr("width", width + margin.left + margin.right)
	.attr("height", height + margin.top + margin.bottom)
	.append("g")
	.attr("transform", "translate(" + margin.left + "," + margin.top + ")");


	tooltip = d3.select("body").append("div")
	.attr("class", "tooltip")
	.style("opacity", 0);	

	var states = svg.selectAll(".county")
		.data(counties.features)
		.enter()
		.append("path")
			.attr("class", "county")
			.attr("d", path); 
    
    
	states.selectAll("path")
	.data(counties.features)
	.enter()
        .append("path")
	.attr("name", function(d) {

		return d.properties["Name"];
	})
	.attr("fill", function (d) {
        if(d.properties.years == undefined)
            return color(0)
       return color(d.properties.years[year]["0"].Value);
      })
	.attr("d", path);
    
    var legend = svg.append("g")
	.attr("id", "legend");

	var legenditem = legend.selectAll(".legenditem")
	.data(d3.range(5))
	.enter()
	.append("g")
	.attr("class", "legenditem")
	.attr("transform", function(d, i) { return "translate(" + i * 50 + ",0)"; });

	legenditem.append("rect")
	.attr("x", width - 230)
	.attr("y", height-7)
	.attr("width", 100)
	.attr("height", 10)
	.attr("class", "rect")
	.style("fill", function(d, i) { return legendColors[i]; });

	legenditem.append("text")
	.attr("x", width - 240)
	.attr("y", height -10)
	.style("fill", "white")
	.text(function(d, i) { return legendText[i]; });

	states
	.on("mouseover", function(d) {
		tooltip.transition()
		.duration(250)
		.style("opacity", 1);

                if(d.properties.years != undefined)
                    tooltip.html(
                    "<p><strong>" + d.properties['Name']+"</strong></p>" +
                    "<table><tbody><tr><td class='wide'>AQI Avg :</td><td>" + formatDecimalComma(d.properties.years[year][0].Value)  + "</td></tr></tbody></table>"
                    )
                    .style("left", (d3.event.pageX + 15) + "px")
                    .style("top", (d3.event.pageY - 28) + "px");
//                else
//                    if(d.properties['Name'] != "New South Wales")
//                        tooltip.html(
//                        "<p><strong>" + d.properties['Name']+"</strong></p>" +
//                        "<table><tbody><tr><td class='wide'>Total Listing :</td><td>unknown</td></tr></tbody></table>"
//                        )
//                        .style("left", (d3.event.pageX + 15) + "px")
//                        .style("top", (d3.event.pageY - 28) + "px");
		})
	.on("mouseout", function(d) {
		tooltip.transition()
		.duration(250)
		.style("opacity", 0);
	});

	
	function update(year){
		slider.property("value", year);
		d3.select(".mapyear").text(year);
		states.style("fill", function(d) {
//			d3.select(".map-info").text("Total listing : "+d.properties.years[year][0].Value);
            if(d.properties.years == undefined)
                return color(0)
			return color(d.properties.years[year][0].Value)
		});
	}
	


	var slider = d3.select(".slider")
	.append("input")
	.attr("class","slider")
	.attr("type", "range")
	.attr("min", 2015)
	.attr("max", 2019)
	.attr("step", 1)
	.on("input", function() {
		year = this.value;
		console.log(year)
		
		update(year);
	});

	update(2015);

}

d3.select(self.frameElement).style("height", "685px");