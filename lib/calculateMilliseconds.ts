interface Params {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export default function calculateMilliseconds({
  hours = 0,
  minutes = 0,
  seconds = 0,
}: Params) {
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}
