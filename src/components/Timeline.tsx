import React, { useState, useEffect, useRef } from "react";
import Graph from "./Plot";
import Play from "./assets/play.svg";
import Pause from "./assets/pause.svg";
const STEP = 0.01;
const FRAME_RATE = 30;
const INCREMENT_PER_SECOND = 1;
const FRAME_RATE_MS = 1000 / FRAME_RATE;
const INCREMENT_PER_FRAME = INCREMENT_PER_SECOND / FRAME_RATE;

interface Props {
  frames: any[]; // An array of values
}

function TimeLine(props: Props) {
  const [state, setState] = useState({
    playing: false,
    currentFrame: 0,
  });

  const frameCount = 10; //props.frames.length;
  const interval = useRef(null);

  useEffect(() => {
    setState({
      playing: false,
      currentFrame: 0,
    });
  }, [props.frames]);

  useEffect(() => {
    const clear = () => {
      clearInterval(interval.current);
      interval.current = null;
    };
    if (!state.playing) {
      if (interval.current) {
        clear();
      }
      return;
    }

    if (!interval.current) {
      interval.current = setInterval(() => {
        setState((state: any) => {
          const currentFrame = state.currentFrame + INCREMENT_PER_FRAME;

          if (currentFrame > frameCount) {
            clear();
            return {
              ...state,
              playing: false,
              currentFrame: frameCount,
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
  }, [state.playing]);

  const frameData = props.frames[state.currentFrame];

  return (
    <div className="timeline">
      <Graph value={frameData} responsive={true} />

      {props.frames.length > 1 && (
      <div className="timeline-controls">
        <PlayButton
          playing={state.playing}
          onClick={() =>
            setState((state) => ({ ...state, playing: !state.playing }))
          }
        />
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
