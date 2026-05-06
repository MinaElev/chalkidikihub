// Aegean monthly averages for the Halkidiki coast — established climatological
// data, used as a stable historical baseline so the chart renders even when the
// live API is unreachable. Values are surface temperature in °C.
export const HALKIDIKI_MONTHLY_AVG_C: Record<number, number> = {
  1: 14.5,
  2: 14.0,
  3: 14.5,
  4: 16.5,
  5: 19.5,
  6: 23.0,
  7: 24.5,
  8: 25.5,
  9: 24.0,
  10: 21.0,
  11: 18.0,
  12: 15.5,
};

export type SeaTempResponse = {
  current?: { sea_surface_temperature?: number; time?: string };
  hourly?: { time?: string[]; sea_surface_temperature?: number[] };
};
