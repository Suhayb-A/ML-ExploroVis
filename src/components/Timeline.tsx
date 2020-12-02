import React, {useState, useEffect} from "react";
import Graph from "./Plot";
import Play from "./assets/play.svg"
import Pause from "./assets/pause.svg"

interface Props {
  frames: any[]; // An array of values
}

function TimeLine(props: Props) {
  const [state, setState] = useState({
    playing: false,
    currentFrame: 0
  });

  useEffect(() => {
    setState({
      playing: false,
      currentFrame: 0
    });
  }, [props.frames])

  return (
    <div className="timeline">
      <Graph
          value={props.frames[state.currentFrame]}
          responsive={true}
        />

      <div className="timeline-controls">
        <PlayButton playing={state.playing} onClick={() => setState((state) => ({...state, playing: !state.playing}))}/>
        <input className="timeline-track" type="range"/>
      </div>
    </div>
  );
}

function PlayButton(props: {playing: boolean, onClick:() => void}) {
  return <div className="timeline-play-pause" onClick={props.onClick}>
    <img src={props.playing ? Pause : Play}/>
  </div>
}

TimeLine.defaultProps = {
  selectedIDX: -1,
};

export default TimeLine;
