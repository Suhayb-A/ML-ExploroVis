import React from "react";
import GridLoader from "react-spinners/GridLoader";

function Loading({waitOn, children}: {waitOn?: any, children: any}) {
  if (!waitOn) {
    return <div className="loading"><GridLoader color="rgba(0, 0, 0, 0.15)" margin={5}/></div>
  }
  return children;
}

export default Loading;
