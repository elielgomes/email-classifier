export const dbEvents = new EventTarget();

export function emitDbEvent(type: string, detail?: any) {
  dbEvents.dispatchEvent(new CustomEvent(type, { detail }));
}