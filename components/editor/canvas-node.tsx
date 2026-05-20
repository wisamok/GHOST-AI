"use client"

import { type NodeProps } from "@xyflow/react"
import type { CanvasNodeData } from "@/types/canvas"

export function CanvasNode({ data }: NodeProps) {
  const nodeData = data as CanvasNodeData
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: 12,
        border: "1px solid var(--border-default)",
        background: nodeData.color ?? "var(--bg-elevated)",
        color: "var(--text-primary)",
        borderRadius: 4,
      }}
    >
      {nodeData.label || nodeData.shape || ""}
    </div>
  )
}
