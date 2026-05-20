"use client"

import { RectangleHorizontal, Diamond, Circle, Pill, Cylinder, Hexagon } from "lucide-react"
import type { LucideIcon } from "lucide-react"

interface ShapeDef {
  name: string
  icon: LucideIcon
  width: number
  height: number
}

const SHAPES: ShapeDef[] = [
  { name: "rectangle", icon: RectangleHorizontal, width: 160, height: 80 },
  { name: "diamond", icon: Diamond, width: 120, height: 120 },
  { name: "circle", icon: Circle, width: 80, height: 80 },
  { name: "pill", icon: Pill, width: 160, height: 60 },
  { name: "cylinder", icon: Cylinder, width: 100, height: 80 },
  { name: "hexagon", icon: Hexagon, width: 100, height: 100 },
]

export const SHAPE_DATA_KEY = "application/ghost-shape"

export function ShapePanel() {
  function handleDragStart(e: React.DragEvent, shape: ShapeDef) {
    e.dataTransfer.setData(
      SHAPE_DATA_KEY,
      JSON.stringify({ shape: shape.name, width: shape.width, height: shape.height })
    )
    e.dataTransfer.effectAllowed = "copy"
  }

  return (
    <div
      className="pointer-events-auto absolute bottom-6 left-1/2 z-10 flex -translate-x-1/2 items-center gap-1 rounded-full border px-4 py-2 shadow-xl"
      style={{
        background: "var(--bg-elevated)",
        borderColor: "var(--border-default)",
        boxShadow: "0 4px 20px rgba(0,0,0,0.6)",
      }}
    >
      {SHAPES.map((s) => (
        <button
          key={s.name}
          draggable
          onDragStart={(e) => handleDragStart(e, s)}
          title={s.name}
          className="flex cursor-grab items-center justify-center rounded-lg p-2.5 transition-colors hover:bg-[var(--bg-subtle)] active:opacity-70"
          style={{ color: "var(--text-muted)", border: "none", lineHeight: 0 }}
        >
          <s.icon size={22} />
        </button>
      ))}
    </div>
  )
}
