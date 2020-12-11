import React, { useState } from "react";
import Loading from "./Loading";
import Stats from "./components/Stats";
import Hyperparameters from "./Hyperparameters";
import Timeline from "./components/Timeline";

function MainView({
  frames,
  method,
  methods,
  forceUpdate,
  recomputeAndUpdate,
  colorFor,
  selectedMethodIDX,
  helpOverlays
}: {
  frames?: any;
  method?: any;
  methods?: any;
  forceUpdate: () => void
  recomputeAndUpdate: (method) => void
  colorFor: (d) => string;
  selectedMethodIDX: number;
  helpOverlays: boolean
}) {
  const [timelineState, setTimelineState] = useState({
    playing: false,
    step: false,
    currentFrame: 0,
  });

  return (
    <div id="main_container">
      <Loading waitOn={frames}>
        <Timeline
          helpOverlays={helpOverlays}
          frames={frames}
          colorFor={colorFor}
          state={timelineState}
          setState={setTimelineState}
        />
      </Loading>
      <Hyperparameters
        title={method.title}
        parameters={method.parameters}
        setParameters={(parameters) => {
          method.parameters = parameters;
          methods[selectedMethodIDX].parameters = parameters;
          forceUpdate();
        }}
        onRun={() => {
          const method = methods[selectedMethodIDX];
          delete (method as any).frames;
          forceUpdate();
          recomputeAndUpdate(method);
        }}
      >
        {method._id === "ann" && (
          <div id="classify-stats">
            <Loading waitOn={frames}>
              <Stats
                frames={frames}
                currentFrame={timelineState.currentFrame}
                setCurrentFrame={(currentFrame) => {
                  setTimelineState((state) => ({ ...state, currentFrame }));
                }}
              />{" "}
            </Loading>
          </div>
        )}
      </Hyperparameters>
    </div>
  );
}
export default MainView;
