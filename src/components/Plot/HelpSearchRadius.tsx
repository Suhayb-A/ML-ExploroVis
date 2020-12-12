import * as d3 from "d3";

export default function draw(
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  {
    value,
    scaleX,
    scaleY,
    thumbnail,
  }: {
    value: any;
    scaleX: d3.ScaleLinear<number, number, never>;
    scaleY: d3.ScaleLinear<number, number, never>;
    thumbnail: boolean;
  },
  show: boolean
) {
  const searchRadius = (value.help || {}).searchRadius;
  const data =
    !searchRadius
      ? []
      : value.scatter.map((d) => ({ ...d, searchRadius }));
  const points = svg.selectAll("ellipse").data(data);

  svg.attr('opacity', 0.15);

  type Points = typeof points;
  function update(points: Points) {
    points
      .attr("cx", (d: any) => scaleX(d.x))
      .attr("cy", (d: any) => scaleY(d.y))
      .attr("fill", (d: any) => d.color)
      .attr("fill-opacity", 0.25)
      .attr("stroke", (d: any) => d.color)
      .attr("stroke-dasharray", 3)
      .attr("rx", (d: any) => Math.abs(scaleX(d.x) - scaleX(d.x +d.searchRadius)))
      .attr("ry", (d: any) => Math.abs(scaleY(d.y) - scaleY(d.y +d.searchRadius)));
  }

  update(points.enter().append("ellipse"));

  update(points);

  points.exit().remove();
}
