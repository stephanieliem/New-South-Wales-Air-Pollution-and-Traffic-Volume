window.onload = function (){
var margin = {top: 20, right: 20, bottom: 30, left: 40},
    width = 500 - margin.left - margin.right,
    height = 550 - margin.top - margin.bottom;

    

    var mainDiv = "chart-line1";
    var mainDivName = mainDiv.substr(1, mainDiv.length);
    var caption = "area";
    var tooltipLable = "Value";
    var value = "value";
    
    
    var svg = d3.select("#chart-line1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");
    
    var g = svg.append("g").attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");
    var color = d3.scaleOrdinal(d3.schemeCategory20);
    var radius = Math.min(width, height) * 0.5;
    var pie = d3.pie()
        .sort(null)
        .value(function(d) {
            return d[value];
        });

    var path = d3.arc()
        .outerRadius(radius - 20)
        .innerRadius(0)
        .cornerRadius(5);

    
 d3.csv("data/grouping-area-traffic.csv", function(error, data) {   

    var label = d3.arc()
        .outerRadius(radius - 40)
        .innerRadius(radius - 40);
    var arc = g.selectAll(".arc")
        .data(pie(data))
        .enter().append("g")
        .classed("arc", true);

    var pathArea = arc.append("path")
        .attr("d", path)
        .attr("id", function(d, i) {
            return "arc-" + i
        })
        .attr("style", "fill-opacity: 0.85;")
        .attr("fill", function(d) {
            return color(d.data[caption]);
        })
        .attr("data", function(d) {
            d.data["percentage"] = (d.endAngle - d.startAngle) / (2 * Math.PI) * 100;
            return JSON.stringify(d.data);
        });

    pathArea.on("mouseover", function(d) {
        
        d3.selectAll('.bar').each(function(y, i) {
                     d3.select(this).style('opacity', '0.2');
                 })
        
        d3.selectAll('.bar').each(function(y, i) {
					var rect_c = d3.select(this).attr('data-c');
                        console.log(rect_c);
					if(rect_c == d.data.area) {
						d3.select(this).style('opacity', '1');
//						tip2.show(y, this);
					}
				    })
        var currentEl = d3.select(this);
        currentEl.attr("style", "fill-opacity:1;");

        var fadeInSpeed = 120;
        d3.select("#tooltip_" + mainDivName)
            .transition()
            .duration(fadeInSpeed)
            .style("opacity", function() {
                return 1;
            });
        d3.select("#tooltip_" + mainDivName)
            .attr("transform", function(d) {
                var mouseCoords = d3.mouse(this.parentNode);
                var xCo = mouseCoords[0] + 10;;
                var yCo = mouseCoords[0] + 10;
                return "translate(" + xCo + "," + yCo + ")";
            });
        
        var tooltipData = JSON.parse(currentEl.attr("data"));
        var tooltipsText = "";
        d3.selectAll("#tooltipText_" + mainDivName).text("");
        var yPos = 0;
        d3.selectAll("#tooltipText_" + mainDivName).append("tspan").attr("x", 0).attr("y", yPos * 10).attr("dy", "1.9em").text(tooltipLable + ":  " + d3.format("0.2f")(tooltipData["percentage"]) + "%");
        var dims = helpers.getDimensions("tooltipText_" + mainDivName);
        d3.selectAll("#tooltipText_" + mainDivName + " tspan")
            .attr("x", dims.w + 2);

        d3.selectAll("#tooltipRect_" + mainDivName)
            .attr("width", dims.w + 10)
            .attr("height", dims.h + 20);
    });
    pathArea.on("mousemove", function(d) {
        var currentEl = d3.select(this);
        d3.selectAll("#tooltip_" + mainDivName)
            .attr("transform", function(d) {
                var mouseCoords = d3.mouse(this.parentNode);
                var xCo = mouseCoords[0] + 10;
                var yCo = mouseCoords[1] + 10;
                return "translate(" + xCo + "," + yCo + ")";
            });
    });
    pathArea.on("mouseout", function(d) {
        var currentEl = d3.select(this);
        currentEl.attr("style", "fill-opacity:0.85;");
d3.selectAll('.bar').each(function(y, i) {
                     d3.select(this).style('opacity', '1');
                 })
        d3.select("#tooltip_" + mainDivName)
            .style("opacity", function() {
                return 0;
            });
        d3.select("#tooltip_" + mainDivName).attr("transform", function(d, i) {
            var x = -500;
            var y = -500;
            return "translate(" + x + "," + y + ")";
        });
    });

   
    var tooltipg = g.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 10)
        .attr("text-anchor", "end")
        .attr("id", "tooltip_" + mainDivName)
        .attr("style", "opacity:0")
        .attr("transform", "translate(-500,-500)");

    tooltipg.append("rect")
        .attr("id", "tooltipRect_" + mainDivName)
        .attr("x", 0)
        .attr("width", 120)
        .attr("height", 80)
        .attr("opacity", 0.8)
        .style("fill", "#000000");

    tooltipg
        .append("text")
        .attr("id", "tooltipText_" + mainDivName)
        .attr("x", 30)
        .attr("y", 15)
        .attr("fill", "#fff")
        .style("font-size", 10)
        .style("font-family", "arial")
        .text(function(d, i) {
            return "";
        });

    arc.append("text")
        .attr("dx", 30)
        .attr("dy", -5)
        .append("textPath")
        .attr("xlink:href", function(d, i) {
            return "#arc-" + i;
        })
        .text(function(d) {
            return d.data[caption].toString();
        })
});
    

    height = 400 - margin.top - margin.bottom;

var x = d3.scaleBand()
          .range([0, width])
          .padding(0.1);
var y = d3.scaleLinear()
          .range([height, 0]);
          
var svg = d3.select("#chart-bar1").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform", 
          "translate(" + margin.left + "," + margin.top + ")");


d3.csv("data/grouping-aqi.csv", function(error, data) {
  if (error) throw error;


  data.forEach(function(d) {
    d.value = +d.value;
  });


  x.domain(data.map(function(d) { return d.area; }));
  y.domain([0, d3.max(data, function(d) { return d.value; })]);


  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.area); })
      .attr("width", x.bandwidth())
    .attr('data-c', function(d, i) {
			var idc = d.area;
			return idc; 
		})
      .attr("y", function(d) { return y(d.value); })
      .attr("height", function(d) { return height - y(d.value); });

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .call(d3.axisLeft(y));

});
    
    
    
    

    
    var helpers = {
    getDimensions: function(id) {
        var el = document.getElementById(id);
        var w = 0,
            h = 0;
        if (el) {
            var dimensions = el.getBBox();
            w = dimensions.width;
            h = dimensions.height;
        } else {
            console.log("error: getDimensions() " + id + " not found.");
        }
        return {
            w: w,
            h: h
        };
    }
}
}

