import React, { createRef } from "react";
import * as d3 from "d3";
import Scatter from "./Scatter";

export const PADDING = 8;
export const COLORS = ["black", ...d3.schemeCategory10];

export function getColor(index: number | string) {
  // Offest the index so that -1 would be black.
  return COLORS[Number(index) + 1];
}

export interface Props {
  frames: any;
  responsive?: boolean;
  colorOn?: string;
  thumbnail?: boolean;
  t?: number;
}

class Base extends React.Component<Props> {
  protected svgRef: React.RefObject<SVGSVGElement>;
  protected xy_domains: [[number, number], [number, number]];

  static defaultProps = {
    responsive: false,
    colorOn: "g",
  };

  constructor(props: Props) {
    super(props);
    this.svgRef = createRef();
    this.updateDimentions = this.updateDimentions.bind(this);
    this.updateDomains();
  }

  componentDidMount() {
    this.updateDimentions();

    if (!this.props.responsive) return;
    window.addEventListener("resize", this.updateDimentions);
  }

  componentWillUnmount() {
    if (!this.props.responsive) return;
    window.removeEventListener("resize", this.updateDimentions);
  }

  private updateDimentions() {
    this.forceUpdate();
  }

  private updateDomains() {
    const data = this.props.frames[0].scatter || [];
    // Get the X & Y ranges, and the number of groups.
    this.xy_domains = data.reduce(
      (results, value) => {
        results[0][0] = Math.min(results[0][0], value.x);
        results[0][1] = Math.max(results[0][1], value.x);
        results[1][0] = Math.min(results[1][0], value.y);
        results[1][1] = Math.max(results[1][1], value.y);
        return results;
      },
      [
        [Infinity, -Infinity], // X
        [Infinity, -Infinity], // Y
      ]
    );
  }

  componentDidUpdate(prevProps) {
    if (prevProps.frames !== this.props.frames) {
      this.updateDomains();
    }
    this.callDrawGraph();
  }

  private setFrameColor(frame: any) {
    const colorOn = this.props.colorOn;
    frame.scatter.forEach((d) => (d["color"] = getColor(d[colorOn])));
    return frame;
  }

  private getFrame(t?: number) {
    // const colorOn = this.props.colorOn;
    const frames = this.props.frames;
    if (t === undefined || t === null)
      return this.setFrameColor(frames[frames.length - 1]);
    const t0 = Math.floor(t);

    if (!frames[t0 + 1]) return this.setFrameColor(frames[t0]);

    const interpolate = d3.interpolate(
      this.setFrameColor(frames[t0]),
      this.setFrameColor(frames[t0 + 1])
    );
    return interpolate(t - t0);
  }

  private callDrawGraph() {
    if (!this.props.frames) return;
    const base = this.props.frames[0];
    if (!base || !base.scatter) return;

    const svgElement = this.svgRef.current;
    const svg = d3.select(svgElement);
    const dims = [svgElement.clientWidth, svgElement.clientHeight];

    const [x, y] = this.xy_domains.map((domain, idx) =>
      d3
        .scaleLinear()
        .domain(domain)
        .range([PADDING, dims[idx] - PADDING])
    );

    const frame = this.getFrame(this.props.t);
    this.drawGraphs(svg, frame, x, y, this.props.thumbnail);
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

  render() {
    return <svg className="graph" ref={this.svgRef} />;
  }
}

export default Base;
