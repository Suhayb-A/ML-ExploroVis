import React, { useState } from "react";
import { getColor } from "./components/Plot";
import clear from "./assets/clear.svg";
import DrawPlot from "./components/DrawPlot";
import { csvFormat } from "d3";

let UNNAMED_COUNTER = -1;
const CLUSTERS = [0, 1];
export interface Props {
  onAdd: (data: any) => void;
  close: () => void;
}

function DataSetEditor({ close, onAdd }: Props) {
  const [selctedCluster, setSelctedCluster] = useState(0);
  const [state, setstate] = useState({
    title: "",
    data: [],
  });

  const options = [
    {
      id: "clear",
      icon: clear,
      onClick: () => {
        setstate((state) => ({
          ...state,
          data: [],
        }));
      },
    },
  ];

  function add() {
    if (!state.title) {
      state.title = `unnamed${
        UNNAMED_COUNTER++ !== -1 ? "_" + UNNAMED_COUNTER : ""
      }`;
    }

    // Convert Data to the correct format
    const result = {
      title: state.title,
      frames: [{scatter: state.data}],
      csv: csvFormat(state.data)
    }

    onAdd(result);

    close();
  }

  function addDataPoints(points) {
    points.forEach(point => {
      if (point['g'] !== undefined) return;
      point['g'] = selctedCluster;
    });
    setstate(state => ({...state, data:[...state.data, ...points]}))
  }

  return (
    <div className="data-set-editor">
      <div className="data-set-editor-content">
        <h2>Crate a Data Set</h2>
        <label>Data Set Name</label>
        <input
          value={state.title}
          onChange={(e) =>
            setstate((state) => ({ ...state, title: e.target.value }))
          }
        ></input>
      </div>
      <div className="data-set-editor-scatter-container">
        <div className="data-set-editor-side-panel">
          {CLUSTERS.map((cluster) => (
            <div
              key={cluster}
              className={
                "data-set-editor-cluster-color" +
                (cluster === selctedCluster ? " active" : "")
              }
              onClick={() => setSelctedCluster(cluster)}
              style={{ background: getColor(cluster) }}
            />
          ))}
          <div style={{ flexGrow: 1 }} />
          {options.map((option) => (
            <div
              key={option.id}
              className="icon"
              onClick={option.onClick}
              style={{
                WebkitMaskImage: `url(${option.icon})`,
                maskImage: `url(${option.icon})`,
              }}
            />
          ))}
        </div>
        <DrawPlot data={state.data} addDataPoints={addDataPoints} />
      </div>
      <div className="caption">
        Select a cluster color from the right, then draw on the right.
      </div>
      <div className="model-editor-buttons">
        <div onClick={close}>Cancel</div>
        <div onClick={add} className={state.data.length == 0 ? "disabled" : ""}>Add</div>
      </div>
    </div>
  );
}

export default DataSetEditor;
