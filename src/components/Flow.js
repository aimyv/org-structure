import React from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  ReactFlowProvider,
} from "reactflow";
import dagre from "dagre";
import { initialNodes, initialEdges } from "../data.js";
import "reactflow/dist/style.css";
import PersonNode from "./PersonNode.js";
import DepartmentNode from "./DepartmentNode.js";
const nodeTypes = { person: PersonNode, department: DepartmentNode };

const dagreGraph = new dagre.graphlib.Graph();
dagreGraph.setDefaultEdgeLabel(() => ({}));

const nodeWidth = 200;
const nodeHeight = 100;

const getLayoutedElements = (nodes, edges, direction = "LR") => {
  dagreGraph.setGraph({ rankdir: direction });

  nodes.forEach((node) => {
    dagreGraph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
  });

  const nodeIds = nodes.map((node) => node.id);
  edges = edges.filter(
    (edge) => nodeIds.includes(edge.source) && nodeIds.includes(edge.target)
  );

  edges.forEach((edge) => {
    dagreGraph.setEdge(edge.source, edge.target);
  });

  dagre.layout(dagreGraph);

  nodes.forEach((node) => {
    const nodeWithPosition = dagreGraph.node(node.id);
    node.targetPosition = "left";
    node.sourcePosition = "right";
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };

    return node;
  });

  return { nodes, edges };
};

const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
  initialNodes,
  initialEdges
);

function LayoutFlow() {
  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  return (
    <ReactFlowProvider>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodesConnectable={false}
        nodeTypes={nodeTypes}
        fitView
      >
        <Controls showInteractive={false} />
      </ReactFlow>
    </ReactFlowProvider>
  );
};

export default LayoutFlow