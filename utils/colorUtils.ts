export const stringToColor = (str: string): string => {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }

  // Use HSL for better control over aesthetics (saturation, lightness)
  // Hue: 0-360 based on hash
  const hue = Math.abs(hash % 360);

  // Saturation: 65-85% for vibrant colors
  const saturation = 70 + (Math.abs(hash) % 20);

  // Lightness: 45-60% for good contrast/visibility
  const lightness = 50 + (Math.abs(hash) % 15);

  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};
