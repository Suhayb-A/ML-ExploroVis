import React, { useState, useEffect, useRef } from "react";
import Graph from "./Plot";
import Play from "./assets/play.svg";
import Pause from "./assets/pause.svg";

const STEP = 0.01;
const FRAME_RATE = 30;
const INCREMENT_PER_SECOND = 1.5;
const FRAME_RATE_MS = 1000 / FRAME_RATE;
const INCREMENT_PER_FRAME = INCREMENT_PER_SECOND / FRAME_RATE;

interface Props {
  frames: any[]; // An array of values
}

function TimeLine(props: Props) {
  const [state, setState] = useState({
    playing: false,
    step: false,
    currentFrame: 0,
  });

  const frameCount = props.frames.length - 1;
  const interval = useRef(null);

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
          let currentFrame = state.currentFrame + INCREMENT_PER_FRAME;
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
  }, [state.playing, state.step]);

  return (
    <div className="timeline">
      <Graph frames={props.frames} responsive={true} t={state.currentFrame}/>

      {frameCount > 0 && (
      <div className="timeline-controls">
        <PlayButton
          playing={state.playing}
          onClick={() =>
            setState((state) => {
              if (state.currentFrame == frameCount) {
                // Restart
                return { ...state, playing: !state.playing, currentFrame: 0 };
              }
              return { ...state, playing: !state.playing };
            })
          }
        />
        <div className={"timeline-step" + (state.step ? " selected": "")} onClick={()=> {
          setState((state) => {
            if (state.currentFrame == frameCount) {
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
      </div>
      )}
    </div>
  );
}

function PlayButton(props: { playing: boolean; onClick: () => void }) {
  return (
    <div className="timeline-play-pause" onClick={props.onClick}>
      <img src={props.playing ? Pause : Play} />
    </div>
  );
}

TimeLine.defaultProps = {
  selectedIDX: -1,
};

export default TimeLine;
