import React, { createRef } from "react";
import * as d3 from "d3";
import Scatter from "./Plot/Scatter";
import { getColor } from "./Plot";
const PADDING = 0;
const DRAW_DRAG_GAP_DELAY_MS = 50;
interface DataPoint {
  x: number;
  y: number;
  g?: number;
}

export interface Props {
  data: DataPoint[];
  addDataPoints: (newPoints: DataPoint[]) => void;
}

class DrawPlot extends React.Component<Props> {
  protected svgRef: React.RefObject<SVGSVGElement>;
  protected xy_domains = [
    [0, 1],
    [0, 1],
  ];
  protected xy: any;

  constructor(props: Props) {
    super(props);
    this.svgRef = createRef();
    this.updateDimentions = this.updateDimentions.bind(this);
    this.addpoint = this.addpoint.bind(this);
    this.onMouseMove = this.onMouseMove.bind(this);
  }

  componentDidMount() {
    this.updateDimentions();
    window.addEventListener("resize", this.updateDimentions);
  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimentions);
  }

  private updateDimentions() {
    this.forceUpdate();
  }

  componentDidUpdate() {
    this.callDrawGraph();
  }

  private callDrawGraph() {
    if (!this.props.data) return;
    const svgElement = this.svgRef.current;
    const svg = d3.select(svgElement);
    const dims = [svgElement.clientWidth, svgElement.clientHeight];

    this.xy = this.xy_domains.map((domain, idx) =>
      d3
        .scaleLinear()
        .domain(domain)
        .range([PADDING, dims[idx] - PADDING])
    );
    const scatter = this.props.data.map((d) => ({
      ...d,
      color: getColor(d["g"]),
    }));

    this.drawGraphs(svg, { scatter }, this.xy[0], this.xy[1], false);
  }

  private drawGraphs(
    ...args: [
      d3.Selection<d3.BaseType, unknown, HTMLElement, any>, // svg
      any, // value
      d3.ScaleLinear<number, number, never>, // scaleX
      d3.ScaleLinear<number, number, never>, // scaleY
      boolean? //thumbnail
    ]
  ) {
    Scatter(...args);
  }

  private addpoint(e) {
    let position = d3.pointer(e);
    if (position[0] < 0 || position[1] < 0) return;
    this.xy.forEach((scale, i) => {
      position[i] = scale.invert(position[i]);
    });
    this.props.addDataPoints([{ x: position[0], y: position[1] }]);
  }

  private timeDelta: Date = new Date();
  private onMouseMove(e) {
    if (e.buttons !== 1) return;
    const newTime = new Date();
    if ((newTime as any) - (this.timeDelta as any) < DRAW_DRAG_GAP_DELAY_MS)
      return;

    this.addpoint(e)
    this.timeDelta = newTime;
  }

  render() {
    return (
      <svg
        className="graph"
        ref={this.svgRef}
        onMouseMove={this.onMouseMove}
        onClick={this.addpoint}
      />
    );
  }
}

export default DrawPlot;
