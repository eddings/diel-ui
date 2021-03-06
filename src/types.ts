import { RelationObject } from "diel";
import { map } from "d3";

export const STRICT = true;

export interface VizLayout {
  chartHeight: number;
  chartWidth: number;
  marginBottom: number;
  marginRight: number;
  marginTop: number;
  marginLeft: number;
}

export interface ChartPropShared {
  spec: ChartSpec;
  data: RelationObject;
  selectedDataRange?: UserSelection;
  layout?: VizLayout;
  svgClickHandler?: () => void;
  brushHandler?: (box: UserSelection) => void;
  colorSpec?: {
    selected?: string,
    default?: string,
    // the following is to support multiple series
    defaultMultiple?: string[];
  };
}

// both have well defined comparison semantics in SQLite
export type FilterValueType = number | string;

export enum SelectionType {
  Set = "Set",
  Range = "Range"
}

export enum VisualSelectionType {
  OneDimBrush = "OneDimBrush",
  TwoDimBrush = "TwoDimBrush",
  ShiftSelection = "ShiftSelection",
  SingleSelection = "SingleSelection",
}

// the following are not data encoding, but static style choices
export enum ShapeConfig {
  Rect = "Rect",
  Circ = "Circ"
}

type SelectionBase = {
  selectionType: SelectionType,
}

export interface RangeUnitSelection extends SelectionBase {
  channelName: ChannelName,
  min: FilterValueType,
  max: FilterValueType,
}

export interface SetUnitSelection extends SelectionBase {
  channelName: ChannelName,
  values: Set<FilterValueType>
}

export type UnitSelection = RangeUnitSelection | SetUnitSelection;

export type UserSelection = UnitSelection[];

/**
 * all the charts could be added with
 * - small multiples position (see if they share the same scale)
 * - color (could be categorical or a linear)
 * scatter/map also has
 * - size
 * - shape
 * when there are multiple series, we can look into if they share the same scale.
 */
export enum ChartType {
  // 1 DIM min
  DotPlot = "DotPlot", // add position, color, shape
  // 2 DIM min
  BarChart = "BarChart", // multiple series overlaid is just some layout coordination logic
  Scatter = "Scatter", // heat map is just scatter with color
  LineChart = "LineChart",
  Map = "Map",
  // going to keep the heatmap since it's slightly different from scatterplot --- it's trying to cover the entire space
  Heatmap = "Heatmap",
  // N DIM
  Table = "Tabel",
  // todo
}


/**
 * This is a union of all the dimensions
 * we need to think harder about hwo to make it more precise and compose with other things
 * FIXME: this is a bit weird.
 */
export enum ChannelName {
  value = "value", // value is used when there is just one dimen
  x = "x",
  y = "y",
  color = "color",
  size = "size",
  shape = "shape",
  position = "position"
}

export enum AnnotationStyle {
  Popup = "Popup",
  Label = "Label",
}

export interface LineChartCustomConfig {
  noLineIfMoreThan?: number;
}

export type ChartCustomConfig = LineChartCustomConfig;

export interface ChartSpec {
  chartType: ChartType;
  // channelName to columnName
  channelByColumn: Map<ChannelName, string>;
  annotation?: {
    columns: string[];
    style: AnnotationStyle;
    // e.g., `col1:${a_col1_val}\ncol2:${a_col2_val}`
    format?: string;
  }
  custom?: ChartCustomConfig;
  // TODO: if we want to clip the axis...
  // relationName: string;
}

// Note: the first one will be the default
export const InteractionsByChartType = new Map<ChartType, VisualSelectionType[]>([
  [ChartType.Map, [VisualSelectionType.TwoDimBrush, VisualSelectionType.ShiftSelection, VisualSelectionType.SingleSelection]],
  [ChartType.BarChart, [VisualSelectionType.OneDimBrush, VisualSelectionType.ShiftSelection]],
  [ChartType.Scatter, [VisualSelectionType.TwoDimBrush, VisualSelectionType.OneDimBrush]],
  [ChartType.Table, [VisualSelectionType.SingleSelection, VisualSelectionType.ShiftSelection]]
]);

// export enum SelectionType {
//   OneDim = "OneDim",
//   TwoDim = "TwoDim"
// }

// export type TwoDimSelection = {
//   brushBoxType: SelectionType;
//   minX: FilterValueType;
//   maxX: FilterValueType;
//   minY: FilterValueType;
//   maxY: FilterValueType;
// };

// export type OneDimSelection = {
//   brushBoxType: SelectionType;
//   min: FilterValueType;
//   max: FilterValueType;
// };


// export interface ChartSpecBase2D extends ChartSpec {
//   xAttribute: string;
//   yAttribute: string;
// }

// // the following 2 lines are copy-pasted from diel (should refactor...)
// // export type RecordObject = {[index: string]: string | number | Uint8Array};
// // export type RelationObject = RecordObject[];

// /**
//  * overloading map data with this, since lat/long is also just x and y, after some projection
//  */
// export interface ChartSpec2DWithData extends ChartSpecBase2D {
//   data: RelationObject;
// }

// export interface ChartSpec3DWithData extends ChartSpec2DWithData {
//   zAttribute: string;
// }

// export type ChartSpecWithData = ChartSpec2DWithData | ChartSpec3DWithData;