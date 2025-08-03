interface Params {
  hours?: number;
  minutes?: number;
  seconds?: number;
}

export default function getTime({
  hours = 0,
  minutes = 0,
  seconds = 0,
}: Params): number {
  return hours * 3600000 + minutes * 60000 + seconds * 1000;
}
