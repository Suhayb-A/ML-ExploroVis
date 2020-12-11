import React, { useState, useEffect } from "react";
import ScrollView from "./components/ScrollView";
import { DataSet } from "./data";
import Popup from "reactjs-popup";
import ModelEditor from "./ModelEditor";
import { getColor } from "./components/Plot";
import Config from "./congfig.json";
import { compute } from "./compute";
import MainView from "./Mainview";

interface Props {
  dataSet: DataSet;
  setMethodPath: (path: string) => void;
}

async function computeMethod(dataSet, catagoryID, method) {
  const parameters = method.parameters;
  const args = parameters
    ? parameters.reduce((r, v) => {
        r[v["_id"]] = v["value"]["value"];
        return r;
      }, {})
    : {};

  return await compute(dataSet.csv, catagoryID, method._id, args);
}

function Methods(props: Props) {
  const categories = Config;
  const [selectedCategoryIDX, selectCategoryIDX] = useState(0);
  const [selectedMethodIDX, selectMethodIDX] = useState(0);
  const selectedCategory = categories[selectedCategoryIDX];
  const [colorOn, setColorOn] = useState(0);
  const method = selectedCategory.types[selectedMethodIDX];

  // A copy of selectedCategory.types tied to the current dataset & contains the
  // computed frames.
  const [methods, setMethods] = useState(undefined);
  const [, updater] = useState(0);

  function forceUpdate() {
    updater((o) => o + 1);
  }

  useEffect(() => {
    // On catagory reset
    selectMethodIDX(0);
    setColorOn(0);
  }, [selectedCategoryIDX]);

  useEffect(() => {
    if (!method) return;
    props.setMethodPath(`${selectedCategory._id}/${method._id}`);
  }, [selectedCategory, selectedMethodIDX, props]);

  useEffect(() => {
    const newMethods = selectedCategory.types.map((v) => ({ ...v }));
    setMethods(newMethods);
  }, [selectedCategory, props.dataSet]);

  async function recomputeAndUpdate(method) {
    const params = method.parameters;
    const frames = await computeMethod(
      props.dataSet,
      selectedCategory._id,
      method
    );
    if (params !== method.parameters) return; //A new request was sent.
    (method as any).frames = frames;
    forceUpdate();
  }

  useEffect(() => {
    if (!methods) return;

    (async function _() {
      methods.forEach((method) => {
        recomputeAndUpdate(method);
      });
    })();
  }, [methods]);

  function addMethod(newMethod: { _id: string; title: string }) {
    // Get the source method.
    let method = categories[selectedCategoryIDX].types.find(
      (type) => type._id === newMethod._id
    );

    let newtype = { ...method, title: newMethod.title } as any;
    // Reset the parameters to their default values.
    newtype.parameters = newtype.parameters
      ? newtype.parameters.map((parameter) => ({
          ...parameter,
          value: { ...parameter.value, value: parameter.value.default },
        }))
      : null;

    newtype["delete"] = (idx: number) => {
      selectMethodIDX((oldIDX) => (oldIDX >= idx ? oldIDX - 1 : oldIDX));
      selectedCategory.types.splice(idx, 1);
      methods.splice(idx, 1);
      forceUpdate();
    };

    selectedCategory.types.push(newtype);
    newtype = { ...newtype };
    methods.push(newtype);
    recomputeAndUpdate(newtype);
    forceUpdate();
  }

  const colorInfo = selectedCategory.colors[colorOn];
  if (!methods || !method || !colorInfo) return <> </>;

  const colors = (colorInfo.values || []).reduce((r, v) => {
    if (v.color) r[v.value] = v.color;
    return r;
  }, {});

  function colorFor(point) {
    const color = colors[point[colorInfo._id]];
    if (color) {
      return color;
    }
    return getColor(point[colorInfo._id]);
  }

  const frames = methods[selectedMethodIDX].frames;
  const lastFrameIdx = (frames || []).length - 1;
  const hasBound = !(
    !frames ||
    !frames[lastFrameIdx] ||
    !frames[lastFrameIdx].boundary
  );

  let colorValues = colorInfo.values;
  if (!colorValues) {
    if (!frames || !frames[lastFrameIdx] || !frames[lastFrameIdx].scatter) {
      colorValues = [];
    } else {
      const values = Array.from(
        new Set(frames[lastFrameIdx].scatter.map((p) => p[colorInfo._id]))
      ).sort((a: any, b: any) => a - b);
      colorValues = values.map((v, i) => ({
        title: v === -1 ? "Not Clustered" : `Cluster ${i + 1}`,
        value: v as any,
        color: getColor(v as any),
      })) as any;
    }
  }

  return (
    <>
      <div id="method">
        <select
          value={selectedCategoryIDX}
          onChange={(event) => selectCategoryIDX(Number(event.target.value))}
        >
          {categories.map((category, idx) => (
            <option value={idx} key={category._id}>
              {category.title}
            </option>
          ))}
        </select>
        <div id="legend">
          <label id="legend-color-title">Color</label>
          {selectedCategory.colors.length > 1 && (
            <select
              value={colorOn}
              onChange={(event) => setColorOn(Number(event.target.value))}
            >
              {selectedCategory.colors.map((color, idx) => (
                <option value={idx} key={idx}>
                  {color.title}
                </option>
              ))}
            </select>
          )}
          <div id="legend-items">
            {colorValues.map((color) => (
              <div key={color.value} className="legend-color">
                <div style={{ background: color.color }} />
                {color.title}
              </div>
            ))}

            {hasBound && (
              <div className="legend-bound">
                <div />
                Boundary
              </div>
            )}
          </div>
        </div>
        <ScrollView
          items={methods}
          selectedIDX={selectedMethodIDX}
          onSelect={selectMethodIDX}
          colorFor={colorFor}
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
              methods={categories[selectedCategoryIDX]}
              onAdd={addMethod}
            />
          )}
        </Popup>
      </div>
      <MainView
        frames={frames}
        method={method}
        methods={methods}
        forceUpdate={forceUpdate}
        recomputeAndUpdate={recomputeAndUpdate}
        colorFor={colorFor}
        selectedMethodIDX={selectedMethodIDX}
      />
    </>
  );
}

export default Methods;
