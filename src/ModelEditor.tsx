import React, { useState } from "react";
let UNNAMED_COUNTER = -1;

export interface Props {
  methods: any;
  close: () => void;
  onAdd: (method: { _id: string; title: string }) => void;
}

function ModelEditor({ methods, close, onAdd }: Props) {
  const [state, setstate] = useState({
    title: "",
    _id: methods.types[0]._id,
  });
  const types = {};
  methods.types.forEach((type) => {
    if (types[type._id]) return;
    types[type._id] = type.title;
  });

  function add() {
    if (!state.title) {
      state.title =
        "unnamed" + (UNNAMED_COUNTER++ === -1 ? "" : "_" + UNNAMED_COUNTER);
    }
    onAdd(state);
    close();
  }

  return (
    <form className="model-editor" onSubmit={e => {
      e.preventDefault();
      add();
    }}>
      <h1>Add {methods.title} Method</h1>
      <label>Model Name</label>
      <input
        value={state.title}
        onChange={(e) =>
          setstate((state) => ({ ...state, title: e.target.value }))
        }
      ></input>
      <label>Algorithm</label>
      <select
        value={state._id}
        onChange={(e) =>
          setstate((state) => ({ ...state, _id: e.target.value }))
        }
      >
        {Object.keys(types).map((id) => (
          <option key={id} value={id}>
            {types[id]}
          </option>
        ))}
      </select>
      <div className="model-editor-buttons">
        <div onClick={close}>Cancel</div>
        <div onClick={add}>Add</div>
      </div>
    </form>
  );
}

export default ModelEditor;
