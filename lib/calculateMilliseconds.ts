interface Params {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function calculateMilliseconds({
  hours,
  minutes,
  seconds,
}: Params) {
  return (hours * 60 * 60 + minutes * 60 + seconds) * 1000;
}
