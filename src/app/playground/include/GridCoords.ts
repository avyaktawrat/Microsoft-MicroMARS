export interface GridCoords {
    x: number;
    y: number;
    f: number;
    g: number;
    h: number;
    isEndPoint: number;
    isTerrain: boolean;
    isPath: boolean;
    value: number;
    destOrder:number;
    parent: number;
    visited: boolean;
    open : boolean;
    // debug : boolean;
}
