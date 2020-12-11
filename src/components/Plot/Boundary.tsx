import * as d3 from "d3";

export default function draw(
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  {value, scaleX, scaleY, thumbnail}: {
    value: any,
    scaleX: d3.ScaleLinear<number, number, never>,
    scaleY: d3.ScaleLinear<number, number, never>,
    thumbnail: boolean,
  }
) {
  const data = value.boundary || [];
  const points = svg.selectAll("path").data([data.map((d) => [scaleX(d[0]), scaleY(d[1])])]);
  type Points = typeof points;
  function update(points: Points) {
    points
      .attr("d", (data) => d3.line().curve(d3.curveCatmullRom.alpha(0.5))(data))
      .attr("stroke", "rgba(0,0,0,0.15)")
      .attr('stroke-width', 2)
      .attr('stroke-dasharray', thumbnail ? 1 : 10)
      .attr("fill", "transparent");
  }

  update(points.enter().append("path"));

  update(points);

  points.exit().remove();
}