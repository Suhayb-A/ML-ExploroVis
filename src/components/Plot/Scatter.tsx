import React, { createRef } from "react";
import Base from "./Base";
import * as d3 from "d3";

class Scatter extends Base {
  protected drawGraph(
    data: any,
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    scaleX: d3.ScaleLinear<number, number, never>,
    scaleY: d3.ScaleLinear<number, number, never>,
    catagoryColors: d3.ScaleOrdinal<string, unknown, never>
  ) {
    super.drawGraph(data, svg, scaleX, scaleY, catagoryColors);

    const points = svg.selectAll("circle").data(data);
    const radius = this.props.radius;
    const colorOn = this.props.colorOn;

    type Points = typeof points;
    function update(points: Points) {
      points
        .attr("cx", (d: any) => scaleX(d.x))
        .attr("cy", (d: any) => scaleY(d.y))
        .attr("fill", (d: any) =>
          colorOn ? (catagoryColors(d[colorOn]) as string) : null
        )
        .attr("r", radius);
    }

    update(points.enter().append("circle"));

    update(points);

    points.exit().remove();
  }
}

export default Scatter;
