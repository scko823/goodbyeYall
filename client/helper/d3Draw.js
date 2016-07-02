'use strict'

import $ from 'jquery'
import airportsToCity from './airport_to_city'

function transformLivePriceData(price){
  //only need to sort price correctly
    function compare(a, b) {
      if (a.date < b.date) {
        return -1;
      }
      if (a.date > b.date) {
        return 1;
      }
      return 0;
    };

  return price.sort(compare);
}

function d3LineDraw (targetDOM, endpoint) {
  $('.'+targetDOM).empty();
  let airports = endpoint.split('/').slice(2);
  // Get the data
  d3.json(endpoint)
    // .header('originairport', localStorage.getItem('originairport'))
    .get(function(error, price) {
    //transform datagetd3Cachegraph
      let data = transformLivePriceData(price);
      function showData(obj, d) {
       let coord = d3.mouse(obj);
       let infobox = $(".infobox"+targetDOM);
       // now we just position the infobox roughly where our mouse is
       infobox.css("left", (coord[0]) + "px" );
       infobox.css("top", (coord[1]-300) + "px");
       $(".infobox"+targetDOM).html(d);
       $(".infobox"+targetDOM).css("opacity", 1);
       // debugger;
       }
       function hideData() {
          $(".infobox"+targetDOM).css("opacity", 0);
       }
      // Set the dimensions of the canvas / graph
      let margin = {top: 30, right: 20, bottom: 60, left: 50},
          width = 600 - margin.left - margin.right,
          height = 270 - margin.top - margin.bottom;

      // Parse the date / time, convert a string of "YYYY-mm" to time
      let parseDate = d3.time.format("%Y-%m").parse;

      // first get first and last month
      let firstMonth = data[0].date, lastMonth = data[data.length-1].date;
      // Set the ranges with first and last month
      let x = d3.time.scale().domain([new Date(firstMonth),new Date(lastMonth)]).range([0, width]);
      let y = d3.scale.linear().range([height, 0]);

      // Define the axes
      let xAxis = d3.svg.axis().scale(x)
          .orient("bottom").ticks(7)
          .tickFormat(d3.time.format("%b %y"));

      let yAxis = d3.svg.axis().scale(y)
          .orient("left").ticks(5);

      // Define the line
      let valueline = d3.svg.line()
          .x(function(d) { return x(d.date); })
          .y(function(d) { return y(d.price); });

      // Adds the svg canvas
      let svg = d3.select("."+targetDOM)
          .append("svg")
              .attr("width", width + margin.left + margin.right)
              .attr("height", height + margin.top + margin.bottom)
          .append("g")
              .attr("transform",
                    "translate(" + margin.left + "," + margin.top + ")");

      data.forEach(function(d) {
          d.date = parseDate(d.date);
      });
      // Scale the range of the data
      x.domain(d3.extent(data, function(d) { return d.date; }));
      y.domain([d3.min(data, function(d) { return d.price; })-120, d3.max(data, function(d) { return d.price; })+120]);
      // Add the valueline path.
      svg.append("path")
          .attr("class", "line")
          .attr("d", valueline(data));
      // Add the scatterplot
      svg.selectAll("dot")
          .data(data)
        .enter().append("circle")
          .attr("class", "data-point")
          .attr("r", 2.5)
          .attr('fill','red')
          .attr("cx", function(d) { return x(d.date); })
          .attr("cy", function(d) { return y(d.price); })
          .on("mouseover", function(d) { showData(this, d3.time.format("%b %Y")(d.date) + ': $' + d.price);})
          .on("mouseout", function(){ hideData();});

      // Add the X Axis
      svg.append("g")
          .attr("class", "x axis")
          .attr("transform", "translate(0," + height + ")")
          .call(xAxis)
          .selectAll("text")
          .attr('y',0)
          .attr('x',-40)
          .attr('transform','rotate(-65)');

      // Add the Y Axis
      svg.append("g")
          .attr("class", "y axis")
          .call(yAxis);
      svg.append('text')
          .attr('x', width/2)
          .attr('y', 0-(margin.top/2))
          .attr('text-anchor','middle')
          .attr('class', 'd3-title')
          .text('Average Daily Deal from '+ airportsToCity[airports[0]]+ ' to '+airportsToCity[airports[1]]); // update title here

      svg.append("text")
          .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
          .attr("transform", "translate("+ (width/2) +","+(height+(margin.bottom/3))+")")  // centre below axis
          .text("Date");

      svg.append("text")
          .attr("text-anchor", "middle")  // this makes it easy to centre the text as the transform is applied to the anchor
          .attr("transform", "translate("+ 0 +","+(height/2)+")rotate(-90)")  // text is drawn off the screen top left, move down and out and rotate
          .text("Price");

      let $infoboxDOM = $("<div>Test</div>");
      $infoboxDOM.addClass('infobox'+targetDOM);
      $("."+targetDOM).append($infoboxDOM);

    });
  };


export default d3LineDraw;
