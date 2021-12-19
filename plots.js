// taken from Dom's office hours
console.log("plots.js loaded");

function initDashboard() {
    console.log("Initializing dashboard");

    var selector = d3.select("#selDataset");
    d3.json("samples.json").then(data =>{
        console.log(data);

        var sampleNames = data.names;

        sampleNames.forEach(sampleID => {
            selector.append("option")
            .text(sampleID)
            .property("value", sampleID);
        });

        let sampleID = sampleNames[0];
        drawBarchart(sampleID);
        drawBublechart(sampleID);
        showMetadata(sampleID);

    });
}
initDashboard();


function drawBarchart(sampleID){
    console.log(`drawBarchart(${sampleID})`);

    d3.json("samples.json").then(data => {
        console.log(data);

        var samples = data.samples;
        var resultArray = samples.filter(s => s.id === sampleID);
        var result = resultArray[0];

        console.log(result);

        var otu_ids = result.otu_ids;
        var otu_labels = result.otu_labels;
        var sample_values = result.sample_values;

        var yticks = otu_ids.slice(0,10).map(otuId => `OTU ${otuId}`).reverse();

        var barData = {
            x:sample_values.slice(0,10).reverse(),
            y:yticks,
            type:"bar",
            text:otu_labels.slice(0,10).reverse(),
            orientation:"h"
        };

        var barArray = [barData];
        var barLayout = {
            title:"Top 10 Bacteria Cultures Found",
            margin:{t:50, 
                    l:150,
                    r:50,
                    b:50
                }
        };

        Plotly.newPlot("bar", barArray, barLayout);
    });

}

function drawBublechart(sampleID) {
    console.log(`drawBublechart(${sampleID})`);

    d3.json("samples.json").then(data => {
        console.log(data);

        var samples = data.samples;
        var resultArray = samples.filter(s => s.id === sampleID);
        var result = resultArray[0];

        var otu_ids = result.otu_ids;
        var sample_values = result.sample_values;
        var otu_labels = result.otu_labels;

        var trace1 = {
            x: otu_ids,
            y:sample_values,
            mode:"markers",
            text:otu_labels,
            marker: {
                color:otu_ids,
                colorscale:"Earth",
                size: sample_values}
            };

        var data = [trace1];

        var layout = {
            xaxis: { title: "OTU ID" },
            title:"Bacteria Culture Per Sample",
            showlegend:false,
            height:600,
            width:1200
        };
        Plotly.newPlot("bubble", data, layout);

    });

}

function showMetadata(sampleID) {
    console.log(`showMetadata(${sampleID})`);

    d3.json("samples.json").then(data => {
        var metadata = data.metadata;
        var resultArray = metadata.filter(m => m.id === sampleID);
        var result = resultArray[0];

        // var id = result.id;
        // var ethnicity = result.ethnicity;
        // var gender = result.gender;
        // var age = result.age;
        // var location = result.location;
        // var bbtype = result.bbtype;
        // var wfreq = result.wfreq;

        var sampleMetadata = d3.select("#sample-metadata");

        sampleMetadata.html("");

        Object.entries(result).forEach(([key, value]) => {
            sampleMetadata.append("h6").text(`${key.toUpperCase()}: ${value}`);
        });
    });    
}


function optionChanged(id) {
    console.log(`optionChanged(${id})`);
    
    drawBarchart(id);
    drawBublechart(id);
    showMetadata(id);

}




