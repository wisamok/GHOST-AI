export interface CanvasNodeData extends Record<string, unknown> {
  label: string
  color?: string
  shape?: string
}

export type CanvasNodeType = "canvasNode"
export type CanvasEdgeType = "canvasEdge"
