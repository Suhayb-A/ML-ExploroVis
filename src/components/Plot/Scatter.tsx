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
  const data = value.scatter;
  const points = svg.selectAll("circle").data(data);
  const radius = thumbnail ? 2 : 5;

  type Points = typeof points;
  function update(points: Points) {

    points
      .attr("cx", (d: any) => scaleX(d.x))
      .attr("cy", (d: any) => scaleY(d.y))
      .attr("fill", (d:any) => d.color)
      .attr("r", radius);
  }

  update(points.enter().append("circle"));

  update(points);

  points.exit().remove();
}