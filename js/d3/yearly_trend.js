window.onload = function(){
var margin = {top: 15, right: 60, bottom: 35, left: 50},
    width = 650 - margin.left - margin.right,
    height = 560 - margin.top - margin.bottom;
var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);

        function basicy() {
            var ret = d3.line()
                .x(function (d) {
                    return x(d.year);
                })
            return ret;
        }
        var valueline = basicy()
            .y(function (d) {
                return y(d.aqi);
            });
       
        var div = d3.select("#chart-line1").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var svg = d3.select("#chart-line1").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var datalist = [];
        d3.csv("data/pollution-trend.csv", function (error, data) {
            if (error) throw error;
            x.domain(d3.extent(data, function (d) {
                return d.year;
            }));
            y.domain([0, d3.max(data, function (d) {
                return Math.max(d.aqi);
            })]);

            var dataArray = [{
                "name": "AQI",
                "x": 100,
                "y": 30,
                "class": "line-text",
                "class2": "line",
                "dataline": valueline
            }]
            for (var i = 0; i < dataArray.length; i++) {
                svg.append("text").text(dataArray[i].name)
                    .attr("x", dataArray[i].x)
                    .attr("y", dataArray[i].y);
                svg.append("rect")
                    .attr("x", dataArray[i].x - 70)
                    .attr("y", dataArray[i].y - 11)
                    .attr("width", 50)
                    .attr('height', 10)
                    .attr('class', dataArray[i].class)
                svg.append("path")
                    .data([data])
                    .attr("class", dataArray[i].class2)
                    .attr("d", dataArray[i].dataline) 
            }

            var fixeddot = svg.selectAll("dot")
                .data(data)
                .enter().append("circle")
                .attr("r", 5)
            

            fixeddot.attr("cx", function (d) {
                    return x(d.year);
                })
                .attr("cy", function (d) {
                    return y(d.aqi);
                })
                .on("mouseover", function (d) {
                d3.selectAll('rect').each(function(y, i) {
                     d3.select(this).style('opacity', '0.2');
                 })
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("<p>Year:" + d.year + "</p> <p>AQI:" + d.aqi + "</p>")
                        .style("left", (x(d.year) + 115) + "px")
                        .style("top", (y(d.aqi)) + "px");

                    d3.selectAll('rect').each(function(y, i) {
					var rect_c = d3.select(this).attr('data-c');
                        console.log(rect_c);
					if(rect_c == d.year) {
						d3.select(this).style('opacity', '1');
					}
				    })
                })
            ;

            
            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('.0f')));

            svg.append("g")
                .call(d3.axisLeft(y));

        });

var heatmargin = {top: 30, right: 30, bottom: 30, left: 30},
    heatwidth = 450 - heatmargin.left - heatmargin.right,
    heatheight = 450 - heatmargin.top - heatmargin.bottom;
    var formatDecimalComma = d3.format(",.2f");
    
var heatsvg = d3.select("#chart-heatmap1")
.append("svg")
  .attr("width", heatwidth + heatmargin.left + heatmargin.right)
  .attr("height", heatheight + heatmargin.top + heatmargin.bottom)
.append("g")
  .attr("transform",
        "translate(" + heatmargin.left + "," + heatmargin.top + ")");

var myGroups = ["Dec", "Nov", "Oct", "Sep","Aug","Jul","Jun","May","Apr","Mar","Feb","Jan"]
var myVars = ["2015", "2016", "2017", "2018", "2019"]


var heatx = d3.scaleBand()
  .range([ 0, heatwidth ])
  .domain(myVars)
  .padding(0.01);
heatsvg.append("g")
  .attr("transform", "translate(0," + heatheight + ")")
  .call(d3.axisBottom(heatx))

var heaty = d3.scaleBand()
  .range([ heatheight, 0 ])
  .domain(myGroups)
  .padding(0.01);
heatsvg.append("g")
  .call(d3.axisLeft(heaty));

var myColor = d3.scaleLinear()
  .range(["white", "#f89e35"])
  .domain([1,100])

d3.csv("data/cleaned-month.csv", function(data) {

  var tooltip = d3.select("#chart-heatmap1")
    .append("div")
    .style("opacity", 0)
    .attr("class", "tooltip")
    .style("background-color", "white")
    .style("border", "solid")
    .style("border-width", "2px")
    .style("border-radius", "5px")
    .style("padding", "5px")

  var mouseover = function(d) {
    tooltip.style("opacity", 1)
  }
  var mousemove = function(d) {
    tooltip
      .html(d.month + " / " + d.year+ "<br>AQI: " + formatDecimalComma(d.value))
      .style("left", (d3.mouse(this)[0]+70) + "px")
      .style("top", (d3.mouse(this)[1]) + "px")
  }
  var mouseleave = function(d) {
    tooltip.style("opacity", 0)
  }

  heatsvg.selectAll()
    .data(data, function(d) {return d.year+':'+d.month;})
    .enter()
    .append("rect")
      .attr("x", function(d) { return heatx(d.year) })
      .attr("y", function(d) { return heaty(d.month) })
    .attr('data-c', function(d, i) {
			if(d.year == '2015') var idc = 2015;
			else if(d.year == '2016') var idc = 2016;
			else if(d.year == '2017') var idc = 2017;
			else if(d.year == '2018') var idc = 2018;
			else if(d.year == '2019') var idc = 2019;
			return idc; 
		})
      .attr("width", heatx.bandwidth() )
      .attr("height", heaty.bandwidth() )
      .style("fill", function(d) { return myColor(d.value)} )
    .on("mouseover", mouseover)
    .on("mousemove", mousemove)
    .on("mouseleave", mouseleave)

})
}