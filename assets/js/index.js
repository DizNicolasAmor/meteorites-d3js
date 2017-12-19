const mapURL = "https://d3js.org/world-50m.v1.json",
      meteoritesURL = "https://data.nasa.gov/resource/y77d-th95.geojson",
      width = window.innerWidth,
      height = window.innerHeight;

let projection = d3.geo.mercator()
  .scale(120)
  .translate([width/2, height/2]);

let path = d3.geo.path()
  .projection(projection);

let svg = d3.select("body")
  .append("svg")
  .attr("width", width)
  .attr("height", height);

//map of the Earth
d3.json('https://d3js.org/world-50m.v1.json', (json) => {
  svg.selectAll('path')
    .data(topojson.feature(json, json.objects.countries).features)
    .enter()
    .append('path')
    .attr('fill', 'LightGrey')
    .attr('stroke', 'Brown')
    .attr('d', path)

  //set meteorites
  d3.json("https://data.nasa.gov/resource/y77d-th95.geojson", (error, data) => {
    if(error) return console.log(error);
    
    // filter meteorites with no position and return as an array
    let modifiedData = data.features.reduce( (arr, elem) => {
        if(elem.geometry)  arr.push(elem);
        return arr;
    }, []);

    svg.selectAll(".meteorite")
      .append("g")
      .data(modifiedData)
      .enter()
      .append("circle")
      .attr("class", "meteorite")
      .attr("r", (d) => {return Math.sqrt( (d.properties.mass)*.0001 )
      })
      .attr("cx", (d) => {
        return projection(d.geometry.coordinates)[0];
      })
      .attr("cy", (d) => {
        return projection(d.geometry.coordinates)[1];
      });

    //meteorite info when mouse on
    svg.selectAll(".meteorite")
      .append("svg:title")
      .text(function(d) {
        if(!d.properties.year)  d.properties.year = '';
        return (
          "Name: \t"+ d.properties.name + 
          "\nMass: \t" + d.properties.mass +
          "\nFall: \t" + d.properties.fall + 
          "\nYear: \t" + d.properties.year.substr(0, 4) + 
          "\nRecclass:  " + d.properties.recclass
      );
    });

  });
});