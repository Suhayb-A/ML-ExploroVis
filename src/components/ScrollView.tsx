import React from "react";
import Graph from "./Plot";
import Loading from "../Loading";

const { Menu, getCurrentWindow } = window.require("electron").remote;

interface Props {
  items: any[];
  selectedIDX?: number;
  children?: React.ReactNode;
  colorFor: (point: any) => string;
  onSelect?: (idx: number) => void;
}

function ScrollView(props: Props) {
  return (
    <div className="ScrollView">
      {props.items.map((item, idx) => (
        <BoxView
          idx={idx}
          key={item.title}
          item={item}
          selected={props.selectedIDX === idx}
          onClick={() => props.onSelect && props.onSelect(idx)}
          colorFor={props.colorFor}
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
  idx: number;
  selected: boolean;
  colorFor: (point: any) => string;
  onClick?: () => void;
}) {
  const menu = Menu.buildFromTemplate([
    {
      label: "Delete",
      enabled: !!props.item.delete,
      click: () => props.item.delete(props.idx),
    },
  ]);

  return (
    <div
      onContextMenu={(e) => {
        e.preventDefault();
        menu.popup(getCurrentWindow());
      }}
      className={
        "ScrollView-item selectable" + (props.selected ? " selected" : "")
      }
      onClick={props.onClick}
    >
      <div className="ScrollView-thumbnail">
      <Loading waitOn={props.item.frames}>
          <Graph frames={props.item.frames} thumbnail={true} colorFor={props.colorFor}/>
        </Loading>
      </div>
      <div className="ScrollView-label">{props.item.title}</div>
    </div>
  );
}

export default ScrollView;
