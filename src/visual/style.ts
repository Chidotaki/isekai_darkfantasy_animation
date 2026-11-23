/** Restrained defaults, overridable per shot. No bloom, blur or automatic shake. */
export const visualTokens = {
  outline: '#182736', outlineWidth: 2.5,
  shadow: '#091b2b', shadowOpacity: 0.18,
  highlight: '#fff2ca', highlightOpacity: 0.1,
  floorShadow: '#06121d', separation: '#647b83',
} as const;
export type VisualStyle = {
  shadow?: number; highlight?: number; opacity?: number;
  brightness?: number; saturation?: number;
};
