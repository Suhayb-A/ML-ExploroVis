import React, { useState, useEffect } from "react";
import ScrollView from "./components/ScrollView";
import Timeline from "./components/Timeline";
import { DataSet } from "./data";
import Hyperparameters from "./Hyperparameters";
interface Props {
  categories: any;
  dataSet?: DataSet;
  setMethodPath: (path: string) => void;
}

function Methods(props: Props) {
  const [category, setcategory] = useState(0);
  const [selectedMethodIDX, setSelectedMethodIDX] = useState(0);
  const [methods, setMethods] = useState(undefined);

  useEffect(() => {
    if (!props.categories || !props.dataSet || !props.categories[category])
      return;
    const methods = props.categories[category];
    const dataSet = props.dataSet;
    for (const i in methods.types) {
      compute(dataSet.csv, methods._id, methods.types[i]._id).then((frames) => {
        setMethods(() => {
          // Make sure that the data set is the same
          if (dataSet !== props.dataSet) return;
          const methods = props.categories[category];

          methods.types[i] = { ...methods.types[i], frames };
          return { ...methods };
        });
      });
    }
  }, [category, props.dataSet, props.categories]);

  useEffect(() => {
    if (!methods) return;
    const method = methods.types[selectedMethodIDX];
    props.setMethodPath(`${methods._id}/${method._id}`);
  }, [selectedMethodIDX, methods, props]);

  if (!methods) return <></>;
  const method = methods.types[selectedMethodIDX];

  return (
    <>
      <div id="method">
        <select
          value={category}
          onChange={(event) => setcategory(Number(event.target.value))}
        >
          {props.categories.map((category, idx) => (
            <option value={idx} key={category._id}>
              {category.title}
            </option>
          ))}
        </select>
        <ScrollView
          items={methods.types}
          selectedIDX={selectedMethodIDX}
          onSelect={setSelectedMethodIDX}
        />
        <div className="button" id="add-method">+</div>
      </div>
      <div id="main_container">
        <Timeline frames={method.frames}/>
        <Hyperparameters method={method}/>
      </div>
    </>
  );
}

async function compute(csvData, categoryID, methodID) {
  const response = await fetch(
    `http://127.0.0.1:4242/compute/${categoryID}/${methodID}`,
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
