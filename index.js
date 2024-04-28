const lineColors = {
    "1": "#EE352E", // Red
    "2": "#EE352E", // Red
    "3": "#EE352E", // Red
    "4": "#00933C", // Green
    "5": "#00933C", // Green
    "6": "#00933C", // Green
    "7": "#B933AD", // Purple
    "A": "#2850AD", // Blue
    "B": "#FF6319", // Orange
    "C": "#2850AD", // Blue
    "D": "#FF6319", // Orange
    "E": "#2850AD", // Blue
    "F": "#FF6319", // Orange
    "G": "#6CBE45", // Lime Green
    "J": "#996633", // Brown
    "Z": "#996633", // Brown
    "L": "#A7A9AC", // Grey
    "M": "#FF6319", // Orange
    "N": "#FCCC0A", // Yellow
    "Q": "#FCCC0A", // Yellow
    "R": "#FCCC0A", // Yellow
    "S 42nd": "#808183", // Shuttle Grey
    "S Fkln": "#808183", // Shuttle Grey
    "S Rock": "#808183", // Shuttle Grey
    "Systemwide": "#69b3a2" // Black or another default color
};

const startMonth = ['2024-03', '2024-02', '2024-01', '2023-12', '2023-11', '2023-10', '2023-09', '2023-08', '2023-07', '2023-06', '2023-05', '2023-04', '2023-03', '2023-02', '2023-01', '2022-12', '2022-11', '2022-10', '2022-09', '2022-08', '2022-07', '2022-06', '2022-05', '2022-04', '2022-03', '2022-02', '2022-01', '2021-12', '2021-11', '2021-10', '2021-09', '2021-08', '2021-07', '2021-06', '2021-05', '2021-04', '2021-03', '2021-02', '2021-01', '2020-12', '2020-11', '2020-10', '2020-09', '2020-08', '2020-07', '2020-06', '2020-05', '2020-04', '2020-03', '2020-02', '2020-01']

const endMonth = ['2024-03', '2024-02', '2024-01', '2023-12', '2023-11', '2023-10', '2023-09', '2023-08', '2023-07', '2023-06', '2023-05', '2023-04', '2023-03', '2023-02', '2023-01', '2022-12', '2022-11', '2022-10', '2022-09', '2022-08', '2022-07', '2022-06', '2022-05', '2022-04', '2022-03', '2022-02', '2022-01', '2021-12', '2021-11', '2021-10', '2021-09', '2021-08', '2021-07', '2021-06', '2021-05', '2021-04', '2021-03', '2021-02', '2021-01', '2020-12', '2020-11', '2020-10', '2020-09', '2020-08', '2020-07', '2020-06', '2020-05', '2020-04', '2020-03', '2020-02', '2020-01']

const division = ['A DIVISION', 'B DIVISION', 'Systemwide']

const line = ['1', '2', '3', '4', '5', '6', '7', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'JZ', 'L', 'M', 'N', 'Q', 'R', 'S 42nd', 'S Fkln', 'S Rock', 'Systemwide']

const dayType = [1, 2]

const reportingCategory = ['Crew Availability', 'External Factors', 'Infrastructure & Equipment', 'Planned ROW Work', 'Police & Medical', 'Operating Conditions']

d3.select("#startMonth")
    .selectAll("option")
    .data(startMonth)
    .enter()
    .append("option")
    .text(function (d) { return d; })
    .property("selected", function (d) { return d === '2020-01'; });

d3.select("#endMonth")
    .selectAll("option")
    .data(endMonth)
    .enter()
    .append("option")
    .text(function (d) { return d; })
    .property("selected", function (d) { return d === '2024-03'; });

d3.select("#division")
    .selectAll("option")
    .data(division)
    .enter()
    .append("option")
    .text(function (d) { return d; })
    .property("selected", function (d) { return d === 'Systemwide'; });

d3.select("#line")
    .selectAll("option")
    .data(line)
    .enter()
    .append("option")
    .text(function (d) { return d; })
    .property("selected", function (d) { return d === 'Systemwide'; });

d3.select("#dayType")
    .selectAll("option")
    .data(dayType)
    .enter()
    .append("option")
    .text(function (d) { if (d == 1) return "Weekday"; else if (d == 2) return "Weekend"; })
    .attr("value", function (d) { return d; })
    .property("selected", function (d) { return d === 'Weekday'; });

d3.select("#reportingCategory")
    .selectAll("option")
    .data(reportingCategory)
    .enter()
    .append("option")
    .text(function (d) { return d; })
    .property("selected", function (d) { return d === 'Operating Conditions'; });

const margin = { top: 50, right: 50, bottom: 50, left: 50 },
    width = 1200 - margin.left - margin.right,
    height = 800 - margin.top - margin.bottom;

const x = d3.scaleBand().range([0, width]).padding(0.2)
const y = d3.scaleLinear().range([height, 0]);



// append the svg object to the body of the page
const svg = d3
    .select("#my_dataviz")
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);

svg.append("g").attr("class", "x-axis").attr("transform", `translate(0,${height})`);
svg.append("g").attr("class", "y-axis");

function validateDateRange() {
    const selectedStart = d3.select("#startMonth").property('value');
    const selectedEnd = d3.select("#endMonth").property('value');

    if (selectedStart > selectedEnd) {
        alert("Start Month cannot be later than End Month.");
        // You could revert the selection here, or just exit without filtering
        return false;  // Indicate invalid selection
    }
    return true;  // Indicate valid selection
}


// Graph related: update the visualization
function updateVisualization(filteredData) {

    // Update domains based on current filtered data
    x.domain(filteredData.map(d => d.month));
    y.domain([0, d3.max(filteredData, d => d.delays)]).nice();

    // Update the bars
    const bars = svg.selectAll("rect")
        .data(filteredData, d => d.month);

    bars.exit().remove();

    bars.enter()
        .append("rect")
        .merge(bars)
        .transition()
        .duration(500)
        .attr("x", d => x(d.month))
        .attr("y", d => y(d.delays))
        .attr("width", x.bandwidth())
        .attr("height", d => height - y(d.delays))
        .attr("fill", d => lineColors[d.line] || "#69b3a2");

    // Update x-axis
    // Update axes
    svg.select(".x-axis")
        .transition()
        .duration(500)
        .call(d3.axisBottom(x))
        .selectAll("text")
        .attr("transform", "rotate(-45)")
        .style("text-anchor", "end")

    svg.select(".y-axis").transition().duration(500).call(d3.axisLeft(y));
}

// Data related: apply filters
function applyFilters(data) {
    if (!validateDateRange()) {
        return;  // Exit if date range is invalid
    }

    const selectedStartMonth = d3.select("#startMonth").property('value');
    const selectedEndMonth = d3.select("#endMonth").property('value');
    const selectedDivision = d3.select("#division").property("value");
    const selectedLine = d3.select("#line").property("value");
    const selectedDayType = d3.select("#dayType").property("value");
    const selectedReportingCategory = d3.select("#reportingCategory").property("value");

    let filteredData = data.filter(d => {
        return (d.month >= selectedStartMonth && d.month <= selectedEndMonth) &&
            (d.division === selectedDivision || selectedDivision === "Systemwide") &&
            (d.line === selectedLine || selectedLine === "Systemwide") &&
            d.day_type === selectedDayType.toString() &&
            d.reporting_category === selectedReportingCategory;
    });

    updateVisualization(filteredData);
}

d3.csv(
    "MTA_Subway_Trains_Delayed__Beginning_2020_20240425.csv").then((data) => {
        // Parse to numbers
        data.forEach(d => {
            d.delays = +d.delays;
        });

        applyFilters(data);

        d3.select("#startMonth").on("change", function () {
            applyFilters(data);
        });

        d3.select("#endMonth").on("change", function () {
            applyFilters(data);
        });

        d3.select("#division").on("change", function () {
            applyFilters(data);
        });

        d3.select("#line").on("change", function () {
            applyFilters(data);
        });

        d3.select("#dayType").on("change", function () {
            applyFilters(data);
        });

        d3.select("#reportingCategory").on("change", function () {
            applyFilters(data);
        });

    });

