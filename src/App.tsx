import React, { useState, useEffect } from "react";
import ScrollView from "./components/ScrollView";
import { loadDefaultDataSets } from "./data";
import Methods from "./Methods";
import Help from "./Help";
import Popup from "reactjs-popup";
import DataEditor from "./DataEditor";
import Config from "./congfig.json";

// const fetchRetry = require("fetch-retry")(fetch, {
//   retries: 100,
//   retryDelay: 800,
// });

function resizeAnimation(durration: number = 0.35) {
  setTimeout(() => {
    // Announce that the dimentions of the view was updated.
    window.dispatchEvent(new Event("resize"));
  }, durration * 1000);
}

function App() {
  const [dataSets, setDataSet] = useState([]);
  const [helpActive, setHelpActive] = useState(false);
  const [selectedDataIDX, setSelectedDataIDX] = useState(0);
  const [methodPath, setMethodPath] = useState("cluster/default");

  // Initial data fetch
  useEffect(() => {
    loadDefaultDataSets()
      .then((data) => setDataSet(data))
      .catch((error) => {
        throw error;
      });
  }, []);

  useEffect(() => {
    resizeAnimation();
  }, [helpActive]);

  function addDataSet(newDataSet) {
    newDataSet["delete"] = idx => {
      setSelectedDataIDX(oldIDX => (oldIDX >= idx ? oldIDX - 1 : oldIDX));
      setDataSet(datasets => {
        const newDataSets = [...datasets];
        newDataSets.splice(idx, 1);
        return newDataSets;
      });
    };
    setDataSet((datasets) => [...datasets, newDataSet]);
  }

  const dataSet = dataSets[selectedDataIDX];
  return (
    <main>
      <div id="main-application">
        <div id="datasets">
          <div id="datasets-navbar">
            <h3>Data Sets</h3>
            <div id="datasets-navbar-buttons">
              <Popup
                trigger={
                  <div className="button" id="dataset-add">
                    +
                  </div>
                }
                modal
                closeOnDocumentClick={false}
              >
                {(close) => <DataEditor close={close} onAdd={addDataSet} />}
              </Popup>
              <div
                className={"button" + (helpActive ? " active" : "")}
                id="dataset-help"
                onClick={() => setHelpActive((s) => !s)}
              >
                ?
              </div>
            </div>
          </div>
          <ScrollView
            items={dataSets}
            selectedIDX={selectedDataIDX}
            onSelect={setSelectedDataIDX}
          />
        </div>
        <div id="data_vis">
          <Methods
            categories={Config}
            dataSet={dataSet}
            setMethodPath={setMethodPath}
          />
        </div>
      </div>
      <Help
        active={helpActive}
        selectedDataSet={dataSet}
        methodPath={methodPath}
      />
    </main>
  );
}

export default App;
