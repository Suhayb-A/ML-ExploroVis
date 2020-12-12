import * as d3 from "d3";

const geoPath = d3.geoPath();

export default function draw(
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  {
    value,
    scaleX,
    scaleY,
    thumbnail,
    getColor
  }: {
    value: any;
    scaleX: d3.ScaleLinear<number, number, never>;
    scaleY: d3.ScaleLinear<number, number, never>;
    thumbnail: boolean;
    getColor: (any) => string
  },
) {
  const data = value.boundary || {};
  let countors = [];
  if (value.boundary) {
    const Contours = d3
      .contours()
      .size(data.dimensions)
      .thresholds(d3.range(0, Number(d3.max(data.predictions)) + 1, 1));

    const gridScaleX = d3.scaleLinear()
      .range(data.xRange)
      .domain([0, data.dimensions[0]]);

    const gridScaleY = d3.scaleLinear()
      .range(data.yRange)
      .domain([0, data.dimensions[1]]);

    countors = Contours(data.predictions);

    countors.forEach(countor => {
      countor.coordinates.forEach(coordinates => {
        coordinates.forEach(coordinates => {
          coordinates.forEach(point => {
            point[0] = scaleX(gridScaleX(point[0]));
            point[1] = scaleY(gridScaleY(point[1]));
          });
        });
      })
    });
  }

  svg.attr('opacity', 0.25);

  const polygons = svg.selectAll("path").data(countors);
  type Polygons = typeof polygons;
  function update(polygons: Polygons) {
    polygons
      .attr("d", (data) => geoPath(data))
      .attr("fill", (data) => getColor(data.value))
  }

  update(polygons.enter().append("path"));

  update(polygons);

  polygons.exit().remove();
}
