d3.json("./static/data/samples.json").then((data) => {
samples=data.samples;
console.log(samples);
});



var sortedBySampleValues = samples.sort((a, b) => b.sample_values - a.sample_values);
console.log(sortedBySampleValues)
