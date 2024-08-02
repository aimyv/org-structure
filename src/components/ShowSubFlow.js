import React from "react";
import ReactFlow, {
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  getNodesBounds,
} from "reactflow";
import dagre from "dagre";
import "reactflow/dist/style.css";
import PersonNode from "./PersonNode";
import LevelNode from "./LevelNode";
const nodeTypes = { person: PersonNode, levelNode: LevelNode };

const nodeWidth = 200;
const nodeHeight = 100;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
  dagreGraph.setGraph({ rankdir: direction });

  let connections = new Set();
  edges.forEach((edge) => {
    connections.add(edge.source);
    connections.add(edge.target);
  });
  if (nodes.length > 1) {
    nodes = nodes.filter((node) => connections.has(node.id));
  }

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
    node.targetPosition = "top";
    node.sourcePosition = "bottom";
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    node.draggable = false;
    return node;
  });

  edges.forEach((edge) => {
    edge.type = "smoothstep";
    edge.animated = false;
    return edge;
  });

  const levels = new Map();
  nodes.forEach((node) => {
    if (!levels.get(node.data.value.level)) {
      levels.set(node.data.value.level, [node.id]);
    } else {
      let arr = levels.get(node.data.value.level);
      levels.set(node.data.value.level, [...arr, node.id]);
    }
  });

  function translateNodeIDsToData(nodeIDs) {
    const nodeData = [];
    nodeIDs.forEach((id) => {
      const node = nodes.find((node) => node.id === id);
      if (node) {
        nodeData.push(node);
      }
    });
    return nodeData;
  }

  let rectangleBounds = [];
  // Output the nodes at each level
  let groupNodes = [];
  for (const [key, value] of levels) {
    const nodeData = translateNodeIDsToData(value);

    const bounds = getNodesBounds(nodeData);
    bounds.width += 250;
    bounds.height += 140;
    bounds.x -= 10;
    bounds.y -= 50;

    rectangleBounds.push(bounds);
    const newNode = {
      id: `Level ${key}`,
      type: "levelNode",
      position: { x: bounds.x, y: bounds.y },
      draggable: false,
      deletable: false,
      style: {
        width: bounds.width,
        height: bounds.height,
        border: "2px dashed grey",
        borderRadius: "5px",
        zIndex: -1,
      },
    };
    groupNodes.push(newNode);
  }

  let maxLevelNodeWidth = 0;
  let x = 0;
  groupNodes.forEach((node) => {
    if (node.style.width > maxLevelNodeWidth) {
      maxLevelNodeWidth = node.style.width;
      x = node.position.x;
    }
  });
  groupNodes.every((node) => (node.style.width = maxLevelNodeWidth));
  groupNodes.every((node) => (node.position.x = x));
  nodes.forEach((node) => {
    if (x > node.position.x) {
      let difference = x - node.position.x;
      maxLevelNodeWidth += difference + 10;
      x = node.position.x - 10;
    }
  });
  groupNodes.every((node) => (node.style.width = maxLevelNodeWidth));
  groupNodes.every((node) => (node.position.x = x));
  nodes.forEach((node) => {
    if (node.position.x + 250 >= maxLevelNodeWidth) {
      let difference = node.position.x + 250 - maxLevelNodeWidth;
      maxLevelNodeWidth += difference;
    }
  });
  groupNodes.every((node) => (node.style.width = maxLevelNodeWidth));
  return { nodes, edges, groupNodes };
};

function ShowSubFlow({ initialNodes, initialEdges }) {
  const {
    nodes: layoutedNodes,
    edges: layoutedEdges,
    groupNodes: layoutedGroupNodes,
  } = getLayoutedElements(initialNodes, initialEdges);

  const [nodes, setNodes, onNodesChange] = useNodesState([
    ...layoutedGroupNodes,
    ...layoutedNodes,
  ]);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  return (
    <div
      style={{
        height: "75vh",
        border: "solid 0.5px #ccc",
        borderRadius: "5px",
      }}
    >
      <ReactFlowProvider>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          deleteKeyCode={null}
          nodeTypes={nodeTypes}
          nodesConnectable={false}
          elementsSelectable={false}
          fitView
        >
          <Controls showInteractive={false} />
        </ReactFlow>
      </ReactFlowProvider>
    </div>
  );
}

export default ShowSubFlow