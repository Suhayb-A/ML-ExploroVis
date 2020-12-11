import React, { useState, useEffect, useRef } from "react";
import Graph from "./Plot";
import Play from "../assets/play.svg";
import Pause from "../assets/pause.svg";

const SPEED_MULTIPLYER = 4; // MODIFY THE BASE ANIMATION SPEED.
const STEP = 0.01;
const FRAME_RATE = 60;
const FRAME_RATE_MS = 1000 / FRAME_RATE;
const MIN_SPEED = 0.25;
const MAX_SPEED = 2;

interface Props {
  frames: any[]; // An array of values
  colorFor?: (point: any) => string;
  setCurrentFrame: (Number) => void;
  currentFrame: number;
}

function TimeLine(props: Props) {
  const [state, setState] = useState({
    playing: false,
    step: false,
    currentFrame: 0,
  });

  const [speed, setSpeed] = useState(1);

  const frameCount = props.frames.length - 1;
  const interval = useRef(null);

  useEffect(() => {
    props.setCurrentFrame(state.currentFrame);
  }, [state.currentFrame]);

  useEffect(() => {
    setState((state) => ({...state, currentFrame: props.currentFrame}));
  }, [props.currentFrame]);



  useEffect(() => {
    setState({
      step: false,
      playing: false,
      currentFrame: 0,
    });
  }, [props.frames]);

  useEffect(() => {
    const clear = () => {
      clearInterval(interval.current);
      interval.current = null;
    };
    if (!state.playing && !state.step) {
      if (interval.current) {
        clear();
      }
      return;
    }

    if (!interval.current) {
      interval.current = setInterval(() => {
        setState((state: any) => {
          let currentFrame = state.currentFrame + (speed / FRAME_RATE * SPEED_MULTIPLYER);
          let stop = currentFrame > frameCount;
          if (!stop && state.step && Math.floor(state.currentFrame) !== Math.floor(currentFrame)) {
            currentFrame = Math.floor(currentFrame);
            stop = true;
          }
          if (stop) {
            clear();
            return {
              ...state,
              step: false,
              playing: false,
              currentFrame: Math.min(currentFrame, frameCount),
            };
          }
          return {
            ...state,
            currentFrame,
          };
        });
      }, FRAME_RATE_MS);
    }

    return clear;
  }, [state.playing, state.step, speed, frameCount]);

  return (
    <div className="timeline">
      <Graph frames={props.frames} responsive={true} t={Math.min(state.currentFrame, frameCount)} colorFor={props.colorFor}/>

      {frameCount > 0 && (
      <div className="timeline-controls">
        <PlayButton
          playing={state.playing}
          onClick={() =>
            setState((state) => {
              if (state.currentFrame === frameCount) {
                // Restart
                return { ...state, playing: !state.playing, currentFrame: 0 };
              }
              return { ...state, playing: !state.playing };
            })
          }
        />
        <div className={"timeline-step" + (state.step ? " selected": "")} onClick={()=> {
          setState((state) => {
            if (state.currentFrame === frameCount) {
              // Restart
              return { ...state, step: !state.step, currentFrame: 0 };
            }
            return { ...state, step: !state.step }
          })
        }}>Step</div>
        <input
          className="timeline-track"
          type="range"
          value={state.currentFrame}
          min={0.0}
          max={frameCount}
          step={STEP}
          onChange={(event) => {
            setState((state) => ({
              ...state,
              playing: false,
              currentFrame: Number(event.target.value),
            }));
          }}
        />

      <div className="timeline-step" id="timeline-speed" onClick={()=> {
        setSpeed(oldSpeed => MIN_SPEED + ((oldSpeed - MIN_SPEED) + 0.25) % (MAX_SPEED))
        }}>{speed}x</div>
      </div>
      )}
    </div>
  );
}

function PlayButton(props: { playing: boolean; onClick: () => void }) {
  return (
    <div className="timeline-play-pause" onClick={props.onClick}>
      <img src={props.playing ? Pause : Play} alt="Play & pause button"/>
    </div>
  );
}

TimeLine.defaultProps = {
  selectedIDX: -1,
};

export default TimeLine;
