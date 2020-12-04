import React, { createRef } from "react";
import * as d3 from "d3";
import Graphs from "./Graphs";

const PADDING = 8;
export const COLORS = ["black", ...d3.schemeCategory10];

export interface Props {
  value: any;
  responsive?: boolean;
  radius?: number;
  colorOn?: string;
  thumbnail?: boolean;
}

class Base extends React.Component<Props> {
  protected svgRef: React.RefObject<SVGSVGElement>;

  static defaultProps = {
    responsive: false,
    radius: 2,
    colorOn: "g",
  };

  constructor(props: Props) {
    super(props);
    this.svgRef = createRef();
    this.updateDimentions = this.updateDimentions.bind(this);
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

  componentDidUpdate() {
    this.callDrawGraph();
  }

  private callDrawGraph() {
    if (!this.props.value || !this.props.value.scatter) return;
    const data = this.props.value.scatter || [];
    const colorOn = this.props.colorOn;
    // Get the X & Y ranges, and the number of groups.
    const { domains, groups_domain } = data.reduce(
      (results, value) => {
        results.domains[0][0] = Math.min(results.domains[0][0], value.x);
        results.domains[0][1] = Math.max(results.domains[0][1], value.x);
        results.domains[1][0] = Math.min(results.domains[1][0], value.y);
        results.domains[1][1] = Math.max(results.domains[1][1], value.y);

        if (colorOn) results.groups_domain.add(value[colorOn]);

        return results;
      },
      {
        domains: [
          [Infinity, -Infinity], // X
          [Infinity, -Infinity], // Y
        ],
        groups_domain: new Set(), // Groups
      }
    );

    const svgElement = this.svgRef.current;
    const svg = d3.select(svgElement);
    const dims = [svgElement.clientWidth, svgElement.clientHeight];

    const colors = d3
      .scaleOrdinal()
      .domain([-1, ...groups_domain])
      .range(COLORS);

    const [x, y] = domains.map((domain, idx) =>
      d3
        .scaleLinear()
        .domain(domain)
        .range([PADDING, dims[idx] - PADDING])
    );
    const color = ((item: any) => (colorOn ? colors(item[colorOn]) : null)) as (
      item: any
    ) => string | null;

    Graphs(svg, this.props.value, x, y, color, this.props.thumbnail)
  }

  render() {
    return <svg className="graph" ref={this.svgRef} />;
  }
}

export default Base;
