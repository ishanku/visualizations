var samples;
d3.json("./static/data/samples.json").then((data) => {
samples=data.samples;
console.log(samples);
});



var sortedBySampleValues = samples.sort((a, b) => b.sample_values - a.sample_values);
console.log(sortedBySampleValues)

top10Samples=sortedBySampleValues.slice(0,10);

console.log(top10Samples);

// Reverse the array to accommodate Plotly's defaults
reversedTop = top10Samples.reverse();

// Trace1 for the Greek Data
var trace1 = {
  x: reversedTop.map(object => object.otu_ids),
  y: reversedTop.map(object => object.sample_values),
  text: reversedTop.map(object => object.otu_labels),
  name: "Top 10 OTUs",
  type: "bar",
  orientation: "h"
};


var bardata = [trace1];

// Apply the group bar mode to the layout
var layout = {
  title: "Top 10 OTUs found in individual",
  margin: {
    l: 100,
    r: 100,
    t: 100,
    b: 100
  }
};

// Render the plot to the div tag with id "plot"
Plotly.newPlot("plot", bardata, layout);
