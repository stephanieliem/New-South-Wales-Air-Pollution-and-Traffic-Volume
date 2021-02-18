window.onload = function(){    
var dataset = {
            "children": [{"Name":"CO","Count":99.79},
                {"Name":"NO","Count":99.39},
                {"Name":"NO2","Count":99.27},
                {"Name":"OZONE","Count":98.16},
                {"Name":"PM10","Count":79.66},
                {"Name":"SO2","Count":99.89}]
        };

        var diameter = 500;
        var color = d3.scaleOrdinal(d3.schemeCategory10);

        var bubble = d3.pack(dataset)
            .size([diameter, diameter])
            .padding(1.5);
    
    
        var tooltip = d3.select("body")
    .append("div")
    .style("position", "absolute")
    .style("z-index", "10")
    .style("visibility", "hidden")
    .style("color", "white")
    .style("padding", "8px")
    .style("background-color", "rgba(0, 0, 0, 0.75)")
    .style("border-radius", "6px")
    .style("font", "12px sans-serif")
    .text("tooltip");

        var svg = d3.select("#poll-bubble")
            .append("svg")
            .attr("width", diameter)
            .attr("height", diameter)
            .attr("class", "bubble");

        var nodes = d3.hierarchy(dataset)
            .sum(function(d) { return d.Count; });

        var node = svg.selectAll(".node")
            .data(bubble(nodes).descendants())
            .enter()
            .filter(function(d){
                return  !d.children
            })
            .append("g")
            .attr("class", "node")
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            });

        node.append("circle")
            .attr("r", function(d) {
                return d.r;
            })
            .style("fill", function(d,i) {
                return color(i);
            }).on("mouseover", function(d) {
              tooltip.text(d.data.Name + ": " + d.data.Count);
              tooltip.style("visibility", "visible");
            updateData(d.data.Name);
      })
      .on("mousemove", function() {
          return tooltip.style("top", (d3.event.pageY-10)+"px").style("left",(d3.event.pageX+10)+"px");
      })
      .on("mouseout", function(){return tooltip.style("visibility", "hidden");});

        node.append("text")
            .attr("dy", ".2em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.Name.substring(0, d.r / 3);
            })
            .attr("font-family", "sans-serif")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        node.append("text")
            .attr("dy", "1.3em")
            .style("text-anchor", "middle")
            .text(function(d) {
                return d.data.Count;
            })
            .attr("font-family",  "Gill Sans", "Gill Sans MT")
            .attr("font-size", function(d){
                return d.r/5;
            })
            .attr("fill", "white");

        d3.select(self.frameElement)
            .style("height", diameter + "px");
    
    
    
    
    
    
    //LINE CHART HERE
    var formatDecimalComma = d3.format(",.2f");
        var margin = {top: 15, right: 30, bottom: 30, left: 100},
    width = 550 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;
var x = d3.scaleLinear().range([0, width]);
        var y = d3.scaleLinear().range([height, 0]);
    
        function basicy() {
            var ret = d3.line()
                .x(function (d) {
                    return x(d.Year);
                })
            return ret;
        }
        var valueline = basicy()
            .y(function (d) {
                return y(d.Value);
            });
       
        var div = d3.select("#poll-growth").append("div")
            .attr("class", "tooltip")
            .style("opacity", 0);

        var svg = d3.select("#poll-growth").append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
        svg.append("text").attr("font-size", "20px")
            .text("Hover to show growth trend!");
    
    function updateData(no) {
    d3.csv("data/cleaned-pol-growth-"+ no +".csv", function(error, data) {
        
       	x.domain(d3.extent(data, function (d) {
                return d.Year;
            }));

         y.domain([ -0.1, 0.25]);
        
svg.selectAll("dot").remove();
        svg.selectAll("circle").remove();
        svg.selectAll("rect").remove();
        svg.selectAll("text").remove();
svg.selectAll("path").remove();
        svg.selectAll("g").remove();
        div.transition()
                        .style("opacity", 0);
        
        svg.append("text").attr("x", width - 100)
	.attr("y", height -10)
            .attr("font-size", "40px")
            .text(no);
            var dataArray = [{
                "name": "AQI Difference",
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
                    return x(d.Year);
                })
                .attr("cy", function (d) {
                    return y(d.Value);
                })
                .on("mouseover", function (d) {
                    div.transition()
                        .duration(200)
                        .style("opacity", .9);
                    div.html("<p>Year:" + d.Year + "</p> <p>Difference:" + formatDecimalComma(d.Value) + "</p>")
                        .style("left", (x(d.Year) + 115) + "px")
                        .style("top", (y(d.Value)) + "px");
                });

            svg.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(d3.axisBottom(x).ticks(5).tickFormat(d3.format('.0f')));

            svg.append("g")
                .call(d3.axisLeft(y));

    });
    }
}