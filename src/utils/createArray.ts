function createArray(length: number): number[] {
  return Array.from({ length }, (_, i) => i + 1)
}
export default createArray
