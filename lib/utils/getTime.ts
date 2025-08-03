interface Params {
  hours: number;
  minutes: number;
  seconds: number;
}

export default function getTime({ hours, minutes, seconds }: Params): number {
  return hours * 3600000 + minutes * 60000 + seconds * 1000;
}
