import * as d3 from "d3";

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
  let countors = value.boundaryCountors || [];
  svg.attr('opacity', 0.3);

  const polygons = svg.selectAll("path").data(countors);
  type Polygons = typeof polygons;
  function update(polygons: Polygons) {
    polygons
      .attr("d", (data: any) => data.path)
      .attr("fill", (data: any) => getColor(data.value));
  }

  update(polygons.enter().append("path"));

  update(polygons);

  polygons.exit().remove();
}
