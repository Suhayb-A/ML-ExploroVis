import * as d3 from "d3";

export default function draw(
  svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
  value: any,
  scaleX: d3.ScaleLinear<number, number, never>,
  scaleY: d3.ScaleLinear<number, number, never>,
  thumbnail?: boolean
) {
  console.log(value);
  const data = value.boundary;
  if (!data) return;
  const points = svg.selectAll("path").data(data);
  const radius = thumbnail ? 2 : 4;

  type Points = typeof points;
  function update(points: Points) {

    points
      .attr("cx", (d: any) => scaleX(d[0]))
      .attr("cy", (d: any) => scaleY(d[1]))
      .attr("fill", "green")
      .attr("r", radius);
  }

  update(points.enter().append("path"));

  update(points);

  points.exit().remove();
}

// export default function draw(
//   svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
//   value: any,
//   scaleX: d3.ScaleLinear<number, number, never>,
//   scaleY: d3.ScaleLinear<number, number, never>,
//   thumbnail?: boolean
// ) {
//   const data = value.boundary;
//   if (!data) return;
//   const points = svg.selectAll("path").data([data]);

//   type Points = typeof points;
//   function update(points: Points) {
//     points
//       .attr(
//         "d",
//         d3.line(
//           data
//             .map((d) => [scaleX(d[0]), scaleY(d[1])])
//             .filter((d) => !isFinite(d[0]) && !isFinite(d[1]))
//         )
//       )
//       .attr("stroke", "black");
//   }

//   update(points.enter().append("path"));

//   update(points);

//   points.exit().remove();
// }
