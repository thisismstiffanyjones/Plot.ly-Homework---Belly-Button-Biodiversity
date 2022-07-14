var sampleData;

function populateIntialData() {
    d3.json("samples.json", function(data) {
        this.sampleData = data;
        d3.select("#selDataset").selectAll("option").data(data.names).enter()
        .append("option").text(function (d){return d;}).attr("value", function (d) {return d;});

        var selectedOption = d3.select("#selDataset").property("value"); 

        // draw bar graph with selectedOption
        populateBarGraph(selectedOption);

        // draw bubble chart with selectedOption
        populateBubbleGraph(selectedOption);

        // draw demographics with selectedOption
        populateDemographics(selectedOption);
    });
}

function optionChanged(selectedValue) {
        // draw bar graph with selectedOption
        populateBarGraph(selectedValue);

        // draw bubble chart with selectedOption
        populateBubbleGraph(selectedValue);

        // draw demographics with selectedOption
        populateDemographics(selectedValue);
}

function populateBarGraph(selectedOption) {
    var foundObject = this.sampleData.samples.find(element => element.id == selectedOption);

    var xvalues = foundObject.sample_values.slice(0,10).reverse();
    var otu_ids = foundObject.otu_ids.slice(0,10).reverse();
    var yvalues = [];
    otu_ids.forEach(element => yvalues.push("OTU " + element));
    var otu_labels = foundObject.otu_labels.slice(0,10).reverse();

    var data = [{
        type: 'bar',
        x: xvalues,
        y: yvalues,
        orientation: 'h',
        text: otu_labels
    }];
    
    Plotly.newPlot('bar', data);
}

function populateBubbleGraph(selectedOption) {
    var foundObject = this.sampleData.samples.find(element => element.id == selectedOption);

    var xValues = foundObject.otu_ids;
    var yValues = foundObject.sample_values;
    var hoverText = foundObject.otu_labels;
    

    var trace1 = {
        x: xValues,
        y: yValues,
        text: hoverText,
        mode: 'markers',
        marker: {
            size: yValues,
            color: xValues
        }
    };  
    var data = [trace1];
    
    var layout = {
        showlegend: false,
    };
    
    Plotly.newPlot('bubble', data, layout);
}

function populateDemographics(selectedOption) {
    var foundObject = this.sampleData.metadata.find(element => element.id == selectedOption);

    const leftSide = Object.keys(foundObject);
    const rightSide = Object.values(foundObject);

    var combo = [];
    for (let i=0; i< leftSide.length; i++) {
        combo.push(leftSide[i] + ": " + rightSide[i]);
    }
    d3.select("#sample-metadata").html(null);
    var ul = d3.select('#sample-metadata').append('ul');
	
    ul.selectAll('li')
	.data(combo)
	.enter()
	.append('li')
	.html(String);
}




