import React, { createRef } from "react";
import * as d3 from "d3";
import { color } from "d3";
import { getColor } from "./Plot";

const DRAW_DRAG_GAP_DELAY_MS = 50;
const Formatter = d3.format(".0%");
export interface Props {
  frames?: any[];
  currentFrame: number;
  setCurrentFrame: (number) => void;
}

interface State {
  hoverPoint?: number;
}

class Stats extends React.Component<Props, State> {
  protected svgRef: React.RefObject<SVGSVGElement>;
  init = false;

  constructor(props: Props) {
    super(props);
    this.svgRef = createRef();
    this.updateDimentions = this.updateDimentions.bind(this);

    this.state = {};
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

  componentDidUpdate(prevProps, prevState) {
    if (prevProps !== this.props || !this.init)
      this.drawGraph();
  }

  private drawGraph() {
    if (!this.props.frames) return;
    const currentFrame = this.props.currentFrame;
    const svgElement = this.svgRef.current;
    let frames = this.props.frames;
    if (frames.length === 1) {
      frames = [...frames, ...frames];
    }
    const svg = d3.select(svgElement);
    const X = d3
      .scaleLinear()
      .domain([0, frames.length - 1])
      .range([41, svgElement.clientWidth - 15]);
    const Y = d3
      .scaleLinear()
      .domain([1.0, 0])
      .range([15, svgElement.clientHeight - 15]);

    const keys = Object.keys(frames[0].stats);
    const points = svg.selectAll("path").data(
      keys.map((key, i) => ({
        data: frames.map((d) => d.stats[key]),
        color: getColor(i + 1),
      }))
    );

    type Points = typeof points;
    function update(points: Points) {
      points
        .attr("d", (data) =>
          d3.line().curve(d3.curveCatmullRom.alpha(0.5))(
            data.data.map((d, i) => [X(i), Y(d)])
          )
        )
        .attr("stroke", (data) => data.color)
        .attr("stroke-width", 2)
        .attr("stroke-linecap", "round")
        .attr("fill", "transparent");
    }

    update(points.enter().append("path"));
    update(points);
    points.exit().remove();

    // Frame line
    const frameLine = svg.selectAll("line").data([currentFrame]);
    type FrameLine = typeof frameLine;
    function updateLine(frameLine: FrameLine) {
      frameLine
        .attr("x1", (d) => X(d))
        .attr("x2", (d) => X(d))
        .attr("y1", 15)
        .attr("y2", svgElement.clientHeight - 15)
        .attr("stroke", "rgba(0,0,0,0.35)")
        .attr("stroke-width", 1)
        .attr("stroke-linecap", "round");
    }

    updateLine(frameLine.enter().append("line"));
    updateLine(frameLine);
    frameLine.exit().remove();

    const hoverLine = svg
    .append("line")
    .attr("class", "hoverline")
    .attr("y1", 15)
    .attr("y2", svgElement.clientHeight - 15)
    .attr("stroke", "rgba(0,0,0,0.15)")
    .attr("stroke-width", 1)
    .attr("stroke-linecap", "round")
    .attr("opacity", 0);

    svg
    .on("mousemove", (e) => {
      let [x, _] = d3.pointer(e);
      x = Math.min(Math.max(x, 41), svgElement.clientWidth - 15);
      hoverLine.attr("opacity", 1).attr("x1", x).attr("x2", x);
      this.setState(state => {
        const hoverPoint = Math.floor(X.invert(x));
        if (state.hoverPoint === hoverPoint) return null;
        return {hoverPoint}
      });
    })
    .on("mouseleave", () => {
      hoverLine.attr("opacity", 0);
      this.setState(state => {
        const hoverPoint = undefined;
        if (state.hoverPoint === hoverPoint) return null;
        return {hoverPoint}
      });
    }).on('click', (e) => {
      let [x, _] = d3.pointer(e);
      x = Math.min(Math.max(x, 41), svgElement.clientWidth - 15);
      this.props.setCurrentFrame(X.invert(x))
    });


    if (!this.init) {
      const yAxis = d3.axisLeft(Y).ticks(2).tickFormat(Formatter);
      svg
        .append("g")
        .attr("class", "y-axis")
        .attr("transform", "translate(40, 0)")
        .call(yAxis);
      this.init = true;
    }
  }

  render() {
    const frames = this.props.frames;
    let currentFrame = this.props.currentFrame;
    let currentFrameNumber = Number.isFinite(this.state.hoverPoint) ? this.state.hoverPoint : currentFrame;
    currentFrameNumber = Math.floor(currentFrameNumber);
    const stats = (frames[currentFrameNumber] || {}).stats || [];

    return <div>
      <svg className="stats" ref={this.svgRef} />
      <div className="stats-values">
        {Object.keys(stats).map((key, i) => <div style={{'background': getColor(i + 1)}}>
          <b>{key.slice(0,1).toUpperCase()}{key.slice(1)}:</b> {Formatter(stats[key])}
        </div>)}
      </div>
    </div>;
  }
}

export default Stats;
