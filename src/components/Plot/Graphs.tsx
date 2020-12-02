import Scatter from "./Scatter";

export default function draw(
  ...args: [
    d3.Selection<d3.BaseType, unknown, HTMLElement, any>, // svg
    any, // value
    d3.ScaleLinear<number, number, never>, // scaleX
    d3.ScaleLinear<number, number, never>, // scaleY
    (item: any) => string | null, // color
    boolean? //thumbnail
  ]
) {
  Scatter(...args);
}
