const pad = (n: number) => String(n).padStart(2, "0");

/** `YYYY-MM-DD` for the device's own calendar day (toISOString would give UTC's). */
export const localDate = (d = new Date()) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
