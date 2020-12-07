import React, { useState, useEffect } from "react";
import ScrollView from "./components/ScrollView";
import Timeline from "./components/Timeline";
import { DataSet } from "./data";
import Hyperparameters from "./Hyperparameters";
import Popup from "reactjs-popup";
import ModelEditor from "./ModelEditor";
import { getColor } from "./components/Plot";

interface Props {
  categories: any;
  dataSet?: DataSet;
  setMethodPath: (path: string) => void;
}

function Methods(props: Props) {
  const [category, setcategory] = useState(0);
  const [colorOn, setColorOn] = useState(0);
  const [selectedMethodIDX, setSelectedMethodIDX] = useState(0);
  const [methods, setMethods] = useState(undefined);
  const [parameters, setParameters] = useState(undefined);

  function computeMethod(index: any = selectedMethodIDX) {
    if (index === undefined || !props.categories || !props.dataSet) return;
    const methods = props.categories[category];
    if (!methods) return;

    const i = index;
    const method = methods.types[i];
    const args = method.parameters
      ? method.parameters.reduce((r, v) => {
          r[v["_id"]] = v["value"]["value"];
          return r;
        }, {})
      : {};

    const dataSet = props.dataSet;
    const parameters = method.parameters;
    compute(dataSet.csv, methods._id, method._id, args).then((frames) => {
      setMethods(() => {
        // Make sure that the state did not change.
        if (dataSet !== props.dataSet || parameters !== method.parameters)
          return;

        const methods = props.categories[category];
        methods.types[i] = { ...methods.types[i], frames };
        return { ...methods };
      });
    });
  }

  useEffect(() => {
    // On catagory reset
    setSelectedMethodIDX(0);
    setColorOn(0);
  }, [category]);

  useEffect(() => {
    if (!props.categories || !props.dataSet || !props.categories[category])
      return;
    const methods = props.categories[category];
    for (const i in methods.types) {
      computeMethod(i);
    }
  }, [category, props.dataSet, props.categories]);

  useEffect(() => {
    if (!methods) return;
    const method = methods.types[selectedMethodIDX];
    props.setMethodPath(`${methods._id}/${method._id}`);
  }, [selectedMethodIDX, methods, props]);

  useEffect(() => {
    // Reinitalize the paramiters
    if (!methods) return;
    const method = methods.types[selectedMethodIDX];
    if (!method) return;
    setParameters(method.parameters);
  }, [methods, selectedMethodIDX]);

  if (!methods) return <></>;
  const method = methods.types[selectedMethodIDX];

  function addMethod(newMethod: { _id: string; title: string }) {
    // Get the method.
    let method = props.categories[category].types.find(
      (type) => type._id === newMethod._id
    );
    const newtype = { ...method, title: newMethod.title };
    newtype.frames = [...newtype.frames];
    // Reset the parameters to their default values.
    newtype.parameters = newtype.parameters
      ? newtype.parameters.map((parameter) => ({
          ...parameter,
          value: { ...parameter.value, value: parameter.value.default },
        }))
      : null;

    // Enable deletion
    newtype["delete"] = (idx: number) => {
      setSelectedMethodIDX(oldIDX => oldIDX >= idx ? oldIDX - 1 : oldIDX);

      props.categories[category].types.splice(idx, 1);

      // Reset methods to prepetuate updates.
      setMethods((methods) => ({ ...methods }));
    };

    props.categories[category].types = [
      ...props.categories[category].types,
      newtype,
    ];

    // Recompute
    computeMethod(props.categories[category].types.length - 1);
  }

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
        <div id="legend">
          <label>Color</label>
          {methods.colors.length > 1 && (
            <select
              value={colorOn}
              onChange={(event) => setColorOn(Number(event.target.value))}
            >
              {methods.colors.map((color, idx) => (
                <option value={idx} key={idx}>
                  {color.title}
                </option>
              ))}
            </select>
          )}
          {methods.colors[colorOn].values.map((color) => (
            <div key={color.value} className="legend-color">
              <div style={{ background: getColor(color.value) }} />
              {color.title}
            </div>
          ))}
        </div>
        <ScrollView
          items={methods.types}
          selectedIDX={selectedMethodIDX}
          onSelect={setSelectedMethodIDX}
          colorOn={methods.colors[colorOn]._id}
        />
        <Popup
          trigger={
            <div className="button" id="add-method">
              +
            </div>
          }
          modal
          closeOnDocumentClick={false}
        >
          {(close) => (
            <ModelEditor
              close={close}
              methods={props.categories[category]}
              onAdd={addMethod}
            />
          )}
        </Popup>
      </div>
      <div id="main_container">
        <Timeline
          frames={method.frames}
          colorOn={methods.colors[colorOn]._id}
        />
        <Hyperparameters
          title={method.title}
          parameters={parameters}
          setParameters={(param) => {
            setParameters(param);
            // Recompute the current model.
            computeMethod(selectedMethodIDX);
          }}
        />
      </div>
    </>
  );
}

async function compute(csvData, categoryID, methodID, args = {}) {
  const response = await fetch(
    `http://127.0.0.1:4242/compute/${categoryID}/${methodID}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: csvData,
        args,
      }),
    }
  );
  const resp = await response.json();
  return resp;
}

export default Methods;
