d3.json(
  "https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/meteorite-strike-data.json",
  function(json) {

    var reordered = [];
    for (var k = 0; k < json.features.length; k++) {
      var jsonMeteorMass = parseFloat(json.features[k].properties.mass);
      if (k == 0) {
        reordered.push(json.features[k]);
      } else {
        for (var l = 0; l < reordered.length; l++) {
          var ordMeteorMass = parseFloat(reordered[l].properties.mass);
          if (k == 0) { alert("here"); }
          if (jsonMeteorMass > ordMeteorMass) {
            reordered.splice(l, 0, json.features[k]);
            break;
          } else if (l == reordered.length - 1) {
            reordered.push(json.features[k]);
            break;
          }
        }
      }
    }
    json.features = reordered;


//1500, 750
    var w = 1100;
    var h = 550;
    var colors = [
      "rgb(141,211,199)",
      "rgb(255,255,179)",
      "rgb(190,186,218)",
      "rgb(128,177,211)",
      "rgb(253,180,98)",
      "rgb(179,222,105)",
      "rgb(252,205,229)",
      "rgb(217,217,217)",
      "rgb(188,128,189)",
      "rgb(204,235,197)",
      "rgb(255,237,111)"
    ];
    var metColors = [
      "rgb(252,146,114)",
      "rgb(251,106,74)",
      "rgb(239,59,44)",
      "rgb(203,24,29)",
      "rgb(165,15,21)",
      "rgb(103,0,13)"
    ];
    function dec(num) {
      num = num.split(".");
      num[1] = num[1].slice(0, 2);
      num = num.join(".");
      return num;
    }

    function com(num) {
      if (num.includes(".")) {
        return dec(num);
      } else {
        num = num.split("");
      for (var i = num.length-3; i >= 0; i = i - 3) {
	      if (i > 0) {
  	      num.splice(i,0,",");
        }
      }
      num = num.join("");
      return num;
      }
    }

    var projection = d3
      .geoEquirectangular()
      //affects starting point
      .translate([785, 360])
      .scale(239);
    var path = d3.geoPath().projection(projection);
    var rScale = d3
      .scaleLinear()
      .domain([
        d3.min(json.features, function(d) {
          return Math.sqrt(parseFloat(d.properties.mass));
        }),
        d3.max(json.features, function(d) {
          return Math.sqrt(parseFloat(d.properties.mass));
        })
      ])
      .range([3, 12]);
    var rFScale = d3
      .scaleQuantize()
      .domain([
        d3.min(json.features, function(d) {
          return Math.sqrt(parseFloat(d.properties.mass));
        }),
        d3.max(json.features, function(d) {
          return Math.sqrt(parseFloat(d.properties.mass));
        })
      ])
      .range(metColors);
    var div = d3
      .select("body")
      .append("div")
      .attr("class", "tip-div")
      .style("display", "none");
    var svg = d3
      .select("body")
      .append("svg")
      .attr("width", w)
      .attr("height", h);

    var zooming = function(d) {
      var offset = [d3.event.transform.x, d3.event.transform.y];
      //map size
      var newScale = d3.event.transform.k * 1467;
      projection.translate(offset).scale(newScale);
      svg.selectAll("path").attr("d", path);
      svg
        .selectAll("circle")
        .attr("cx", function(d) {
          if (d.properties.reclong && d.properties.reclat) {
            return projection([
              parseFloat(d.properties.reclong),
              parseFloat(d.properties.reclat)
            ])[0];
          } else {
            return -100;
          }
        })
        .attr("cy", function(d) {
          if (d.properties.reclong && d.properties.reclat) {
            return projection([
              parseFloat(d.properties.reclong),
              parseFloat(d.properties.reclat)
            ])[1];
          } else {
            return -100;
          }
        });
    };

    var zoom = d3
      .zoom()
      //zoom in/out capability
      .scaleExtent([0.12, 8.5])
      //click & drag extent capability
      // .translateExtent([[-6263, -3108], [6263, 3108]])
      .translateExtent([[-4000, -2000], [4000, 2000]])
      .on("zoom", zooming);

    var center = projection([0, 0]);

    var map = svg
      .append("g")
      .attr("class", "map")
      .attr("width", w)
      .attr("height", h)
      .call(zoom)
      .call(
        zoom.transform,
        d3.zoomIdentity
          .translate(w / 2 + 94, h / 2 + 43)
          .scale(0.12)
          .translate(-center[0], -center[1])
      );

    //invisible rect to facilitate zooming from water coordinates
    map
      .append("rect")
      .attr("x", 0)
      .attr("y", 0)
      .attr("width", w)
      .attr("height", h)
      .style("opacity", 0);

    map
      .selectAll("path")
      .data(data.features)
      .enter()
      .append("path")
      .attr("class", "land")
      .attr("d", path)
      .style("fill", function() {
        return colors[Math.floor(Math.random() * 11)];
      });

    map
      .selectAll("circle")
      .data(json.features)
      .enter()
      .append("circle")
      .attr("class", "met")
      .attr("cx", function(d) {
        if (d.properties.reclong && d.properties.reclat) {
          return projection([
            parseFloat(d.properties.reclong),
            parseFloat(d.properties.reclat)
          ])[0];
        } else {
          return -100;
        }
      })
      .attr("cy", function(d) {
        if (d.properties.reclong && d.properties.reclat) {
          return projection([
            parseFloat(d.properties.reclong),
            parseFloat(d.properties.reclat)
          ])[1];
        } else {
          return -100;
        }
      })
      .attr("r", function(d) {
        if (d.properties.mass) {
          return rScale(Math.sqrt(parseFloat(d.properties.mass)));
        }
      })
      .style("fill", function(d) {
        return rFScale(Math.sqrt(parseFloat(d.properties.mass)));
      })
      .on("mouseover", function(d) {
        div.style("display", "inline");
        d3
          .select(this)
          .transition()
          .duration(100)
          .style("opacity", 0.9)
          .style("stroke", "#f5f5f5");
      })
      .on("mousemove", function(d) {
        div
          .html(
              "<p>Impact Year: " +
              d.properties.year.slice(0,4) +
              "<p>Location: " +
              d.properties.name +
              "</p>" +
              "<p>Mass: " +
              com(d.properties.mass) +
              " g</p>" +
              "<p>Coordinates: " +
              dec(d.properties.reclong) +
              "&#176;, " +
              dec(d.properties.reclat) +
              "&#176;</p>"
          )
          .style("left", d3.event.pageX - 120 + "px")
          .style("top", d3.event.pageY - 65 + "px");
      })
      .on("mouseout", function(d) {
        div.style("display", "none");
        d3
          .select(this)
          .transition()
          .duration(100)
          .style("opacity", 0.6)
          .style("stroke", "#fff");
      });
  }
);
