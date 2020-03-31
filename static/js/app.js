var select=d3.select('#selDataset');
var id;
var maxwfreq=0;
buildSelect();

function unpack(rows, index) {
  return rows.map(function(row) {
    return row[index];
  });
}

function buildSelect(){
d3.json("./static/data/samples.json").then((data) => {
    data.metadata.forEach((element)=>{
      Object.entries(element).forEach(([key, value]) => {
        if (key=="id"){
          select.append("option").attr("value",value).text(value);
        }
        if (key=="wfreq"){
          if (value > maxwfreq)
            maxwfreq=value;
        }
      });
    });

});
}
var newdata;


function optionChanged(id){
  //id=d3.select('#selDataset').property('value');
  d3.json("./static/data/samples.json").then((data) => {
    data.metadata.forEach((element,i)=>{
      Object.entries(element).forEach(([key, value]) => {
        if (key=="id"){
          if(value==id){
            console.log(data.metadata[i]);
            console.log(data.samples[i])
            draw(data.samples[i],data.metadata[i].wfreq);
            table(data.metadata[i]);
          }
        }
      });
    });

}); 
}

function chartNow(xaxis,yaxis,ticks,type,title,orientation,color,colorscale,size,width,mode,val,wfreq)
{
  if (width == null){
    width = 500;
  }

  if (type=='bar'){
    xaxis = xaxis.reverse();
    yaxis=yaxis.reverse();
    text = ticks.reverse();
  }
  if (type=="gauge"){
    var level=wfreq*20;
    if ( maxrange % 2 == 0)
      var maxrange=maxwfreq + 2;
    else
      var maxrange=maxwfreq + 3;
    var trace1 = {
      domain: { x: [0, 1], y: [0, 1] },
      value: val,
      type: "indicator",
      mode: mode,
      title: { text: level, font: { size: 24 } },
      delta: { reference: maxrange/4, increasing: { color: "Purple" } },
      gauge: {
        axis: { range: [null, maxrange], tickwidth: 1, tickcolor: "darkblue" },
        bar: { color: "#DAF7A6" },
        bgcolor: "white",
        borderwidth: 2,
        bordercolor: "gray",
        steps: [
          { range: [0, maxrange/8],color: "#C9DBC7" },
          { range: [maxrange/8, maxrange/4], color: "#93D58F" },
          { range: [maxrange/4, maxrange/2], color: "#70CF66" },
          { range: [maxrange/2, (4*maxrange)/6], color: "#46B03B" },
          { range: [(4*maxrange)/6,maxrange], color: "green" }
        ],
        threshold: {
          line: { color: "red", width: 4 },
          thickness: 0.75,
          value: 0.25
        }}
    }
  var layout = { 
    title: title,
    width: 600, height: 350, margin: { t: 25, r: 25, l: 25, b: 25 } ,
    paper_bgcolor: "lavender",
  font: { color: "darkblue", family: "Arial" }
  };
  }
  else{
  var trace1 = {
    x: xaxis,
    y: yaxis,
   text: ticks,
   mode: 'markers',
   name: "Top 10 OTUs",
   type: type,
   orientation: orientation,
  marker: {
       color: color,
       size: size,  
       colorscale: colorscale,
    }
};
var layout = {
  title: title,
  showlegend: false,
  height: 600,
  width: width,
  margin: {
    l: 100,
    r: 100,
    t: 100,
    b: 100
  },
};
}
var chartdata = [trace1];
Plotly.newPlot(type, chartdata, layout);
}
function draw(data,freq){
  // Draw Bar
  var xaxis = data.sample_values.slice(0,10);
  var yaxis = data.otu_ids.slice(0, 10).map(otuID => `OTU ${otuID}`);
  var ticks = data.otu_labels.slice(0,10)
  var color=null;
  var colorscale=null;
  var size =null;
  var val=null;
  var mode =null;
  var wfreq=null;
  chartNow(xaxis,yaxis,ticks,"bar","Top 10 OTUs in Individuals","h",color,colorscale,size,null,mode,val,wfreq)
//Draw Bubble
  xaxis= data.otu_ids
  yaxis= data.sample_values
  ticks= data.otu_labels
  color=data.otu_ids
  colorscale="RdBu"
  size= data.sample_values
  val=null;
  mode=null
  wfreq=null;
  chartNow(xaxis,yaxis,ticks,"bubble","OTUs in Individuals",null,color,colorscale,size,900,mode,val,wfreq)

  //Draw Gauge
  ticks="<b>Belly Button Washing Frequency</b> <br> Scrubs per Week"
  color=null
  colorscale=null
  size=null;
  mode="gauge+number+delta";
  val=freq;
  wfreq=freq;
  chartNow(xaxis,yaxis,ticks,"gauge","<b>Belly Button Washing Frequency</b> <br> Scrubs per Week",null,color,colorscale,size,null,mode,val,wfreq)
  
  
}
function table(data){
  //d3.select("#sample-metadata").text(data.id)
  d3.select('.mytable').remove();

  var panelTable=d3.select('#sample-metadata').append('table').attr("class","table mytable").attr("style","padding:5px;font-size:9px;border: solid 1px;");
  var tr,td,wfreq;
  Object.entries(data).forEach(([key,value])=>{
    tr = panelTable.append("tr")
    tr.append("th").attr("style","text-transform:uppercase;background-color:lightblue;border: solid 1px;").text(key);
    tr.append("td").attr("style","border: solid 1px;").text(value);
    if(key=="wfreq"){
      wfreq=value;
    }
  });

        var level = wfreq*20;
        // Trig to calc meter point
        var degrees = 180 - level,
            radius = .5;
        var radians = degrees * Math.PI / 180;
        var x = radius * Math.cos(radians);
        var y = radius * Math.sin(radians);
        // Path: may have to change to create a better triangle
        var mainPath = 'M -.0 -0.05 L .0 0.05 L ',
            pathX = String(x),
            space = ' ',
            pathY = String(y),
            pathEnd = ' Z';
        var path = mainPath.concat(pathX,space,pathY,pathEnd);
        var data = [{ type: 'scatter',
        x: [0], y:[0],
            marker: {size: 12, color:'850000'},
            showlegend: false,
            name: 'Freq',
            text: level,
            hoverinfo: 'text+name'},
        { values: [50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50/9, 50],
        rotation: 90,
        text: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        textinfo: 'text',
        textposition:'inside',
        marker: {
            colors:[
                'rgba(0, 105, 11, .5)', 'rgba(10, 120, 22, .5)',
                'rgba(14, 127, 0, .5)', 'rgba(110, 154, 22, .5)',
                'rgba(170, 202, 42, .5)', 'rgba(202, 209, 95, .5)',
                'rgba(210, 206, 145, .5)', 'rgba(232, 226, 202, .5)',
                'rgba(240, 230, 215, .5)', 'rgba(255, 255, 255, 0)']},
        labels: ['8-9', '7-8', '6-7', '5-6', '4-5', '3-4', '2-3', '1-2', '0-1', ''],
        hoverinfo: 'label',
        hole: .5,
        type: 'pie',
        showlegend: false
        }];
        var layout = {
        shapes:[{
            type: 'path',
            path: path,
            fillcolor: '850000',
            line: {
                color: '850000'
            }
            }],
        title: '<b>Belly Button Washing Frequency</b> <br> Scrubs per Week',
        height: 500,
        width: 500,
        xaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]},
        yaxis: {zeroline:false, showticklabels:false,
                    showgrid: false, range: [-1, 1]}
        };
        Plotly.newPlot("gauge-small", data, layout);

}
