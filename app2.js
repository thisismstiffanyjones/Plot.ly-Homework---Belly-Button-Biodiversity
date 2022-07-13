// Open the JSON using D3 library
// Pull the metadata to make the side panel information
function getMetadata(sample) {
    d3.json("samples.json").then((data) => {
        var metaData = data.metaData;
        console.log(metaData);

        var bucket = metadata.fliter(sampleObj => sampleObj.id == sample); 
        var thing = bucket[0];
        var panelInfo = d3.select("#sample-metadata");

        Object.entries(thing).forEach(([key, value]) => {
            panelInfo.append("p").text('${key}: ${value}');
        })
    })
}

// This function to to make the bar chart and the bubble chart
function makeCharts(sample) {
    d3.json("samples.json").then((data) => {
        var sampleData = data.samples;
        var bucket = sampleData.fliter(sampleObj => sampleObj.id == sample);
        var thing = bucket[0];

        var otu_ids = thing.otu_ids;
        var otu_labels = thing.otu_labels;
        var sample_values = thing.sample_values;


        // Horizontal Bar Chart 
        var barData =[
            {
                x: sample_values.slice(0,10).reverse(),
                y: otu_ids.slice(0,10).map(otu_ids => `otu ${otu_ids}`).reverse(),
                text: otu_labels.slice(0,10).reverse(),
                type: "bar",
                orientation: "h",
            }
        ];

        var layout = {
            title: "Top 10 Bacteria Cultures Found",
            margin: { t:30, l:150 }
        };

        Plotly.newPlot("bar", barData, layout);

        // Bubble Chart
        var bubbleData = [
            {
                x: otu_ids,
                y: sample_values,
                text: otu_labels,
                mode: "markers",
                marker: {
                    size: sample_values,
                    color: otu_ids,
                    colorscale: "Earth"
                }
            }
        ];

        var layout2 = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "otu ids"},
        };

        Plotly.newPlot("bubble", bubbleData, layout2);
    });
};

// Add the names/id numbers to the drop down menu
function init() {
    var dropDown = d3.select("#selDataset");

    d3.json("samples.json").then((data) => {
        var name = data.names;

        name.forEach((sample) => {
            dropDown
            .append("option")
            .text(sample)
            .proerty("value", sample);
        })

        var sampleData = name[0];
        getMetadata(sampleData);
        makeCharts(sampleData);
    });
};

// 
function optionChanged(newSample) {
    getMetadata(newSample);
    makeCharts(newSample);
};

init()