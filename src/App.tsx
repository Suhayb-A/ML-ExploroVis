import React, { useState, useEffect } from "react";
import ScrollView from "./components/ScrollView";
import { loadDefaultDataSets } from "./data";
import Methods from "./Methods";
import Help from "./Help";

const fetchRetry = require("fetch-retry")(fetch, {
  retries: 100,
  retryDelay: 800,
});

function resizeAnimation(durration: number = 0.35) {
  setTimeout(() => {
    // Announce that the dimentions of the view was updated.
    window.dispatchEvent(new Event("resize"));
  }, durration * 1000);
}

function App() {
  const [dataSets, setDataSet] = useState([]);
  const [methodTypes, setMethodTypes] = useState({});
  const [selectedDataIDX, setSelectedDataIDX] = useState(0);
  const [helpActive, setHelpActive] = useState(false);
  const [methodPath, setMethodPath] = useState("cluster/default");

  // Initial data fetch
  useEffect(() => {
    loadDefaultDataSets()
      .then((data) => setDataSet(data))
      .catch((error) => {
        throw error;
      });

    //Load methods
    fetchRetry("http://127.0.0.1:4242/methods").then(async (response) => {
      setMethodTypes(await response.json());
    });
  }, []);

  useEffect(() => {
    resizeAnimation();
  }, [helpActive]);

  const dataSet = dataSets[selectedDataIDX];
  return (
    <main>
      <div id="main-application">
        <div id="datasets">
          <div id="datasets-navbar">
            <h3>Data Sets</h3>
            <div id="datasets-navbar-buttons">
              <div className="button" id="dataset-add">
                +
              </div>
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
          <Methods catagories={methodTypes} dataSet={dataSet} setMethodPath={setMethodPath}/>
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
