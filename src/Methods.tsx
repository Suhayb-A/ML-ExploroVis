import React, { useState, useEffect } from "react";
import ScrollView from "./components/ScrollView";
import Timeline from "./components/Timeline";
import { DataSet } from "./data";

interface Props {
  catagories: any;
  dataSet?: DataSet;
}

function Methods(props: Props) {
  const [catagory, setCatagory] = useState(0);
  const [selectedMethodIDX, setSelectedMethodIDX] = useState(0);
  const [methods, setMethods] = useState(undefined);

  useEffect(() => {
    if (!props.catagories || !props.dataSet || !props.catagories[catagory])
      return;
    const methods = props.catagories[catagory];
    const dataSet = props.dataSet;
    for (const i in methods.types) {
      compute(dataSet.csv, methods._id, methods.types[i]._id).then((frames) => {
        setMethods(() => {
          // Make sure that the data set is the same
          if (dataSet !== props.dataSet) return;
          const methods = props.catagories[catagory];
          methods.types[i] = { ...methods.types[i], frames };
          return { ...methods };
        });
      });
    }
  }, [catagory, props.dataSet, props.catagories]);

  //TODO: Support hyperparameters

  if (!methods) return <></>;
  const method = methods.types[selectedMethodIDX];

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
        <ScrollView
          items={methods.types}
          selectedIDX={selectedMethodIDX}
          onSelect={setSelectedMethodIDX}
        />
      </div>
      <div id="main_container">
        <Timeline frames={method.frames}/>
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

async function compute(csvData, catagoryID, methodID) {
  const response = await fetch(
    `http://127.0.0.1:4242/compute/${catagoryID}/${methodID}`,
    {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        data: csvData,
        args: {
        // TODO: hyperparameters
        }
      }),
    }
  );
  const resp = await response.json();
  return resp;
}

export default Methods;
