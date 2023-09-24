async function drawScatter() {
  // *Step 1: Access Data

  const dataset = await d3.csv(
    "https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/2_TwoNum.csv"
  )

  //console.log(dataset)
  //console.table(dataset[0])

  const xAccessor = (d) => parseFloat(d.GrLivArea)
  // console.log(xAccessor(dataset[0]))

  const yAccessor = (d) => parseFloat(d.SalePrice)
  //console.log(yAccessor(dataset[0]))

  //* Step 2: Chart Dimensions
  //*Scatter plots are usually square so take the smaller value of window width vs window heigth
  const width = d3.min([window.innerWidth * 0.9, window.innerHeight * 0.9])

  //*set dimensions and margins
  //*dimensions: width and height
  //*margin: top, left, bottom, right

  let dimensions = {
    width: width,
    height: width,
    margin: {
      top: 10,
      right: 20,
      bottom: 50,
      left: 60,
    },
  }

  //* calculate the bounds
  dimensions.boundedWidth =
    dimensions.width - dimensions.margin.right - dimensions.margin.left
  dimensions.boundedHeight =
    dimensions.height - dimensions.margin.top - dimensions.margin.bottom
  // console.log(dimensions) // checking to see if dimensions.boundedWidth  = dimensions.boundedHeight
  //* if equal this means that the plot is a square, which is what I want :)

  //* Step 3: Draw Canvas
  //* add i) wrapper and ii) bounds to your html #wrapper

  const wrapper = d3
    .select("#wrapper")
    .append("svg")
    .attr("width", dimensions.width)
    .attr("height", dimensions.height)

  const bounds = wrapper.append("g").style(
    "transform",
    `translate(${dimensions.margin.left}px, 
            ${dimensions.margin.top}px)`
  ) // move the graph to the right and push it down

  // *Step 4: Create Scales
  //* creating scales to convert data points to pixels

  //* xScale
  xScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, xAccessor)) //* min = 334 ; max = 5642
    .range([0, dimensions.boundedWidth])
    .nice()

  yScale = d3
    .scaleLinear()
    .domain(d3.extent(dataset, yAccessor)) //* min = 34900 ; max = 755000
    .range([dimensions.boundedHeight, 0])
    .nice()

  //* Step 5: Draw Data

  const dots = bounds.selectAll("circle").data(dataset)
  //console.log(dots)

  dots
    .join("circle")
    .attr("cx", (d) => xScale(xAccessor(d)))
    .attr("cy", (d) => yScale(yAccessor(d)))
    .attr("r", 1.5)
    .attr("fill", "#69b3a2")

  // *Step 6 Draw Peripherals

  const xAxisGenerator = d3.axisBottom().scale(xScale)

  const xAxis = bounds
    .append("g")
    .call(xAxisGenerator)
    .style("transform", `translateY(${dimensions.boundedHeight}px)`)

  const xAxisLabel = xAxis
    .append("text")
    .attr("x", dimensions.boundedWidth / 2)
    .attr("y", dimensions.margin.bottom - 10)
    .attr("fill", "blue")
    .style("font-size", "1.4em")
    .html("xAxis")

  const yAxisGenerator = d3.axisLeft().scale(yScale).ticks(4)

  const yAxis = bounds.append("g").call(yAxisGenerator)

  const yAxisLabel = yAxis
    .append("text")
    .attr("x", -dimensions.boundedHeight / 2)
    .attr("y", -dimensions.margin.left + 10)
    .attr("fill", "black")
    .style("font-size", "1.4em")
    .text("Y-axis")
    .style("transform", "rotate(-90deg)")
    .style("text-anchor", "middle")
}

drawScatter()
