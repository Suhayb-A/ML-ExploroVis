import React, { useState, useEffect } from "react";
import ScrollView from "./components/ScrollView";
import { loadDefaultDataSets } from './data';
import Methods from "./Methods";

function App() {
  const [dataSets, setDataSet] = useState([]);
  const [methodTypes, setMethodTypes] = useState({});
  const [selectedDataIDX, setSelectedDataIDX] = useState(0);

  // Initial data fetch
  useEffect(() => {
    loadDefaultDataSets()
      .then((data) => setDataSet(data))
      .catch((error) => {
        throw error;
      });

    //Load methods
    fetch('http://127.0.0.1:4242/methods').then(async response => {
      setMethodTypes(await response.json());
    })
  }, []);

  const dataSet =(dataSets[selectedDataIDX] || {});
  return <main>
    <div id="datasets">
      <h4>Data Set</h4>
      <ScrollView items={dataSets} selectedIDX={selectedDataIDX} onSelect={setSelectedDataIDX}/>
    </div>
    <div id="data_vis">
      <Methods catagories={methodTypes} dataSet={dataSet}/>
    </div>
  </main>;
}

export default App;
