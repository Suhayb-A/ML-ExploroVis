import React, { createRef } from "react";
import * as d3 from "d3";
const RADIUS = 2;
const PADDING = 6;
export const COLORS = ["red", "blue"];

interface Props {
  data: any;
  id?: string;
  responsive?: boolean;
}

interface State {
  dimentions: [number, number];
}

class Scatter extends React.Component<Props, State> {
  svgRef: React.RefObject<SVGSVGElement>;

  static defaultProps = {
    responsive: false
  }

  constructor(props: Props) {
    super(props);
    this.svgRef = createRef();
    this.state = {
      dimentions: [0,0]
    };
    this.updateDimentions = this.updateDimentions.bind(this);
  }

  componentDidMount() {
    this.updateDimentions();

    if (!this.props.responsive) return;
    window.addEventListener('resize', this.updateDimentions);
  }

  componentWillUnmount() {
    if (!this.props.responsive) return;
    window.removeEventListener('resize', this.updateDimentions);
  }

  private updateDimentions() {
    const svgElement = this.svgRef.current as any;
    this.setState((state) => ({
      ...state,
      dimentions: [
        svgElement.clientWidth,
        svgElement.clientHeight,
      ]
    }));
  }

  componentDidUpdate() {
    this.callDrawGraph();
  }

  private callDrawGraph() {
    if (!this.props.data) return;
    const data = this.props.data || [];

    // Get the X & Y ranges, and the number of groups.
    const { domains, groups_domain } = data.reduce(
      (results, value) => {
        results.domains[0][0] = Math.min(results.domains[0][0], value.x);
        results.domains[0][1] = Math.max(results.domains[0][1], value.x);
        results.domains[1][0] = Math.min(results.domains[1][0], value.y);
        results.domains[1][1] = Math.max(results.domains[1][1], value.y);

        results.groups_domain.add(value.g);
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
    const dims = this.state.dimentions;

    const colors = d3.scaleOrdinal().domain(groups_domain).range(COLORS);

    const [x, y] = domains.map((domain, idx) =>
      d3
        .scaleLinear()
        .domain(domain)
        .range([PADDING, dims[idx] - PADDING])
    );

    this.drawGraph(data, svg, x, y, colors);
  }

  protected drawGraph(
    data: any,
    svg: d3.Selection<d3.BaseType, unknown, HTMLElement, any>,
    scaleX: d3.ScaleLinear<number, number, never>,
    scaleY: d3.ScaleLinear<number, number, never>,
    catagoryColors: d3.ScaleOrdinal<string, unknown, never>
  ) {
    const points = svg.selectAll("circle").data(data);

    type Points = typeof points;
    function update(points: Points) {
      points
        .attr("cx", (d: any) => scaleX(d.x))
        .attr("cy", (d: any) => scaleY(d.y))
        .attr("fill", (d: any) => catagoryColors(d.g) as string)
        .attr("r", RADIUS);
    }

    update(points.enter().append("circle"));

    update(points);

    points.exit().remove();
  }

  render() {
    return <svg id={this.props.id} ref={this.svgRef} />;
  }
}

export default Scatter;
