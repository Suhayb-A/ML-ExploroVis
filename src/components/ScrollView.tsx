import React from "react";
import Graph from "./Plot";

interface Props {
  items: any[];
  selectedIDX?: number;
  children?: React.ReactNode;
  onSelect?: (idx: number) => void;
}

function ScrollView(props: Props) {
  return (
    <div className="ScrollView">
      {props.items.map((item, idx) => (
        <BoxView
          key={item.title}
          item={item}
          selected={props.selectedIDX === idx}
          onClick={() => props.onSelect && props.onSelect(idx)}
        />
      ))}
    </div>
  );
}

ScrollView.defaultProps = {
  selectedIDX: -1,
};

function BoxView(props: {
  item: any;
  selected: boolean;
  onClick?: () => void;
}) {
  return (
    <div
      className={
        "ScrollView-item selectable" + (props.selected ? " selected" : "")
      }
      onClick={props.onClick}
    >
      <div className="ScrollView-thumbnail">
        <Graph frames={props.item.frames} thumbnail={true} />
      </div>
      <div className="ScrollView-label">{props.item.title}</div>
    </div>
  );
}

export default ScrollView;
