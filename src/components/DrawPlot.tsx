import React, { createRef } from "react";
import * as d3 from "d3";
import Scatter from "./Plot/Scatter";

const PADDING = 0;
const DRAW_DRAG_GAP_DELAY_MS = 50;
interface DataPoint {
  x: number;
  y: number;
  g?: number;
}

export interface Props {
  data: DataPoint[];
  colorFor: (point: any) => string;
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
      color: this.props.colorFor(d),
    }));

    this.drawGraphs(svg, {
      value: { scatter },
      scaleX: this.xy[0],
      scaleY: this.xy[1],
      thumbnail: false,
    });
  }

  private drawGraphs(
    svg,
    props: {
      value: any;
      scaleX: d3.ScaleLinear<number, number, never>;
      scaleY: d3.ScaleLinear<number, number, never>;
      thumbnail: boolean;
    }
  ) {
    Scatter(svg, props);
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

    this.addpoint(e);
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
