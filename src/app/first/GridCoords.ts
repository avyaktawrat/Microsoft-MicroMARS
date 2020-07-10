export interface GridCoords {
    x: number;
    y: number;
    f: number;
    g: number;
    h: number;
    isEndPoint: boolean;
    isTerrain: boolean;
    isPath: boolean;
    value: number;
    parent: number;
  }
