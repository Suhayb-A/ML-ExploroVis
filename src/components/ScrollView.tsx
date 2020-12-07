import React, { useEffect, useRef } from "react";
import Graph from "./Plot";
const { Menu, getCurrentWindow } = window.require("electron").remote;

interface Props {
  items: any[];
  selectedIDX?: number;
  children?: React.ReactNode;
  colorOn?: string;
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
          colorOn={props.colorOn}
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
  colorOn?: string;
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
        <Graph frames={props.item.frames} thumbnail={true} colorOn={props.colorOn}/>
      </div>
      <div className="ScrollView-label">{props.item.title}</div>
    </div>
  );
}

export default ScrollView;
