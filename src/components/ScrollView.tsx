import React from "react";
import { DataSet } from "../data";

interface Props {
  items: any[];
  selectedIDX?: number;
  children?: React.ReactNode;
  onAdd?: () => void;
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
      {props.onAdd && (
        <div className="AddButton selectable" onClick={props.onAdd} />
      )}
    </div>
  );
}

ScrollView.defaultProps = {
  selectedIDX: -1,
};

function DefaultThumbnail(props: { item: any }) {
  //TODO: implement
  return (
    <>
      <div></div>
    </>
  );
}

function BoxView(props: {
  item: any;
  Thumbnail?: React.ElementType;
  selected: boolean;
  onClick?: () => void;
}) {
  const Thumbnail = props.Thumbnail || DefaultThumbnail;
  return (
    <div
      className={
        "ScrollView-item selectable" + (props.selected ? " selected" : "")
      }
      onClick={props.onClick}
    >
      <div className="ScrollView-thumbnail">
        <Thumbnail item={props.item} />
      </div>
      <div className="ScrollView-label">{props.item.title}</div>
    </div>
  );
}

export default ScrollView;
