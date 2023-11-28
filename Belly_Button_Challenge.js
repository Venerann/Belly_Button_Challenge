// Step 1: Use D3 library to read in samples.json
d3.json("https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json").then(data => {
    console.log(data); // Verify data is loaded
    // Continue with the next steps here...
});

// Step 2: Create a horizontal bar chart
function buildBarChart(sample) {
    // Select your HTML element to place the bar chart
    var barChart = d3.select("#bar-chart");

    // Extract data for the selected sample
    var sampleData = data.samples.find(d => d.id === sample);

    // Sort data to get top 10 OTUs
    var topOTUs = sampleData.otu_ids.slice(0, 10).reverse();
    var topValues = sampleData.sample_values.slice(0, 10).reverse();
    var topLabels = sampleData.otu_labels.slice(0, 10).reverse();

    // Create the bar chart
    var trace = {
        x: topValues,
        y: topOTUs.map(id => `OTU ${id}`),
        text: topLabels,
        type: "bar",
        orientation: "h"
    };

    var layout = {
        title: `Top 10 OTUs for Sample ${sample}`
    };

    Plotly.newPlot("bar-chart", [trace], layout);
}

// Call buildBarChart function with the first sample
buildBarChart(data.names[0]);

// Step 3: Create a bubble chart
function buildBubbleChart(sample) {
    // Select your HTML element to place the bubble chart
    var bubbleChart = d3.select("#bubble-chart");

    // Extract data for the selected sample
    var sampleData = data.samples.find(d => d.id === sample);

    // Create the bubble chart
    var trace = {
        x: sampleData.otu_ids,
        y: sampleData.sample_values,
        text: sampleData.otu_labels,
        mode: 'markers',
        marker: {
            size: sampleData.sample_values,
            color: sampleData.otu_ids
        }
    };

    var layout = {
        title: `Bubble Chart for Sample ${sample}`,
        xaxis: { title: 'OTU ID' },
        yaxis: { title: 'Sample Values' }
    };

    Plotly.newPlot("bubble-chart", [trace], layout);
}

// Call buildBubbleChart function with the first sample
buildBubbleChart(data.names[0]);

// Step 4: Display sample metadata
function displayMetadata(sample) {
    // Select your HTML element to display metadata
    var metadataPanel = d3.select("#sample-metadata");

    // Extract data for the selected sample
    var metadata = data.metadata.find(d => d.id.toString() === sample);

    // Clear existing metadata
    metadataPanel.html("");

    // Display each key-value pair
    Object.entries(metadata).forEach(([key, value]) => {
        metadataPanel.append("p").text(`${key}: ${value}`);
    });
}

// Call displayMetadata function with the first sample
displayMetadata(data.names[0]);

// Step 5: Update all plots when a new sample is selected
function optionChanged(newSample) {
    buildBarChart(newSample);
    buildBubbleChart(newSample);
    displayMetadata(newSample);
}

// Select the dropdown menu and attach the optionChanged function to its change event
var dropdownMenu = d3.select("#selDataset");
dropdownMenu.on("change", function () {
    var newSample = dropdownMenu.property("value");
    optionChanged(newSample);
});

// Populate the dropdown menu with sample names
data.names.forEach(sample => {
    dropdownMenu.append("option").text(sample).property("value", sample);
});
