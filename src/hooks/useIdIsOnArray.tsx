export default function useIdIsOnArray(
  array: string[],
  id: string | undefined
) {
  return array.includes(id ?? '');
}
