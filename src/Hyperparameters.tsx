import React, { useState, useEffect } from "react";

function Hyperparameters(props: { method: any }) {
  return (
    <div id="hyperparameter">
      <h3> Cluster - {props.method.title}</h3>
      <label>Test</label>
      <select name="test" id="test">
        <option value="test">Test</option>
      </select>
    </div>
  );
}

export default Hyperparameters;
