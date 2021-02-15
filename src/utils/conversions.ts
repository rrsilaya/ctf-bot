export const toHex = (id: number): string => `0x${id.toString(16).padStart(4, '0')}`;
