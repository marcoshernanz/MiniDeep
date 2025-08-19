export type StopwatchControls = {
  start: () => void;
  togglePause: () => void;
  stop: () => void;
};

let controlsRef: StopwatchControls | null = null;

export function registerStopwatchControls(controls: StopwatchControls) {
  controlsRef = controls;
}

export function clearStopwatchControls() {
  controlsRef = null;
}

export function getStopwatchControls(): StopwatchControls | null {
  return controlsRef;
}
