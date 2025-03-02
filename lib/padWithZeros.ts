export default function padWithZeros(number: number, numZeros: number) {
  return number.toString().padStart(numZeros, "0");
}
