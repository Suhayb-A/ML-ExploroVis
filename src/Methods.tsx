import React, { useState } from "react";
import ScrollView from "./components/ScrollView";
import Scatter from "./components/Scatter";
import {DataSet} from "./data"

interface Props {
  catagories: any;
  dataSet: DataSet;
}

function Methods(props: Props) {
  const [catagory, setCatagory] = useState(0);
  const [selectedMethodIDX, setSelectedMethodIDX] = useState(0);
  const methods = props.catagories[catagory];
  if (!methods) return <></>;
  const method = methods.types[selectedMethodIDX];
  const dataSet = props.dataSet;

  methods.types.forEach(method => {
    method['data'] = dataSet.data // TODO: Request formatted data
  });

  return (
    <>
      <div id="method">
        <select
          value={catagory}
          onChange={(event) => setCatagory(Number(event.target.value))}
        >
          {props.catagories.map((catagory, idx) => (
            <option value={idx} key={catagory._id}>
              {catagory.title}
            </option>
          ))}
        </select>
        <ScrollView items={methods.types} selectedIDX={selectedMethodIDX} onSelect={setSelectedMethodIDX}/>
      </div>
      <div id="main_container">
        <Scatter id="main_vis" data={dataSet.data} responsive={true}/>
        <div id="hyperparameter">
          <h1>Main Vis</h1>
          <h4>TEMP: Hyperparameters</h4>
          <div>
            method: {methods._id}, {method._id}
          </div>
          {/* TODO Add Hyperparameters under dataset, when a paramiter type is selected it would appear highlighted */}
        </div>
      </div>
    </>
  );
}

export default Methods;
