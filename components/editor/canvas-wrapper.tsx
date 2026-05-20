"use client"

import { Component, type ReactNode } from "react"
import { LiveblocksProvider, RoomProvider, ClientSideSuspense } from "@liveblocks/react/suspense"
import {
  ReactFlow,
  ReactFlowProvider,
  MiniMap,
  Background,
  BackgroundVariant,
  ConnectionMode,
  useReactFlow,
  type NodeTypes,
} from "@xyflow/react"
import { useLiveblocksFlow, Cursors } from "@liveblocks/react-flow"
import "@xyflow/react/dist/style.css"
import "@liveblocks/react-ui/styles.css"
import "@liveblocks/react-flow/styles.css"
import { CanvasNode } from "./canvas-node"
import { SHAPE_DATA_KEY } from "./shape-panel"

class LiveblocksErrorBoundary extends Component<
  { fallback: ReactNode; children: ReactNode },
  { hasError: boolean }
> {
  state = { hasError: false }
  static getDerivedStateFromError() {
    return { hasError: true }
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children
  }
}

const nodeTypes: NodeTypes = {
  canvasNode: CanvasNode,
}

let nodeCounter = 0

function CanvasInner() {
  const { nodes, edges, onNodesChange, onEdgesChange, onConnect, onDelete } =
    useLiveblocksFlow({ suspense: true, nodes: { initial: [] }, edges: { initial: [] } })
  const { screenToFlowPosition, addNodes } = useReactFlow()

  function onDragOver(e: React.DragEvent) {
    e.preventDefault()
    e.dataTransfer.dropEffect = "copy"
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault()
    const raw = e.dataTransfer.getData(SHAPE_DATA_KEY)
    if (!raw) return
    const { shape, width, height } = JSON.parse(raw) as {
      shape: string
      width: number
      height: number
    }
    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY })
    const id = `${shape}-${Date.now()}-${++nodeCounter}`
    addNodes({
      id,
      type: "canvasNode",
      position,
      data: { label: "", shape },
      style: { width, height },
    })
  }

  return (
    <div className="relative h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onDelete={onDelete}
        connectionMode={ConnectionMode.Loose}
        nodeTypes={nodeTypes}
        onDragOver={onDragOver}
        onDrop={onDrop}
        minZoom={0.1}
        maxZoom={4}
        fitView
        fitViewOptions={{ padding: 0.4, maxZoom: 1 }}
        style={{ backgroundColor: "var(--bg-base)" }}
      >
        <MiniMap
          style={{
            backgroundColor: "var(--bg-elevated)",
            border: "1px solid var(--border-default)",
            borderRadius: 8,
          }}
          nodeColor="var(--bg-subtle)"
          nodeStrokeColor="var(--border-subtle)"
          maskColor="rgba(8,8,9,0.65)"
        />
        <Background
          variant={BackgroundVariant.Dots}
          color="var(--border-subtle)"
          gap={20}
          size={1.5}
        />
        <Cursors />
      </ReactFlow>
    </div>
  )
}

function CanvasFlow() {
  return (
    <ReactFlowProvider>
      <CanvasInner />
    </ReactFlowProvider>
  )
}

export function CanvasWrapper({ roomId }: { roomId: string }) {
  return (
    <div className="relative h-full w-full">
      <LiveblocksProvider authEndpoint="/api/liveblocks-auth">
        <RoomProvider id={roomId} initialPresence={{ cursor: null, isThinking: false }}>
          <LiveblocksErrorBoundary
            fallback={
              <div
                className="flex h-full w-full items-center justify-center text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                Unable to connect to collaboration server.
              </div>
            }
          >
            <ClientSideSuspense
              fallback={
                <div
                  className="flex h-full w-full items-center justify-center text-sm"
                  style={{ color: "var(--text-muted)" }}
                >
                  Connecting…
                </div>
              }
            >
              <CanvasFlow />
            </ClientSideSuspense>
          </LiveblocksErrorBoundary>
        </RoomProvider>
      </LiveblocksProvider>
    </div>
  )
}
