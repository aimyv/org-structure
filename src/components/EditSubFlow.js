import React, { useCallback, useEffect } from "react";
import ReactFlow, {
  addEdge,
  ConnectionLineType,
  useNodesState,
  useEdgesState,
  Controls,
  Background,
  BackgroundVariant,
  ReactFlowProvider,
  getIncomers,
  getOutgoers,
  getConnectedEdges,
  getRectOfNodes,
} from "reactflow";
import dagre from "dagre";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import OrgStructureContext from "../context/OrgStructureContext";
import "reactflow/dist/style.css";
import PersonNode from "./PersonNode";
import CustomEdge from "./CustomEdge";
const nodeTypes = { person: PersonNode };
const edgeTypes = {
  customEdge: CustomEdge,
};

const nodeWidth = 200;
const nodeHeight = 100;

const getLayoutedElements = (nodes, edges, direction = "TB") => {
  const dagreGraph = new dagre.graphlib.Graph();
  dagreGraph.setDefaultEdgeLabel(() => ({}));
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
    node.targetPosition = "top";
    node.sourcePosition = "bottom";
    node.position = {
      x: nodeWithPosition.x - nodeWidth / 2,
      y: nodeWithPosition.y - nodeHeight / 2,
    };
    node.draggable = true;
    return node;
  });

  edges.forEach((edge) => {
    edge.type = "customEdge";
    return edge;
  });

  return { nodes, edges };
};

function EditSubFlow({ initialNodes, setPNodes, initialEdges, setPEdges }) {
  const { nodes: layoutedNodes, edges: layoutedEdges } = getLayoutedElements(
    initialNodes,
    initialEdges
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(layoutedEdges);

  const onConnect = useCallback((params) => {
    const { source, _sourceHandle, target, _targetHandle } = params;
    const sourceNode = nodes.find((node) => node.id === source);
    const targetNode = nodes.find((node) => node.id === target);
    // set edge if 2 assigned nodes are one level apart
    const condition1 =
      targetNode.data.value.level - sourceNode.data.value.level === 1 &&
      targetNode.data.value.level &&
      sourceNode.data.value.level;
    // set edge from an assigned source node to unassigned target node, the unassigned node will be assigned to a level lower than the source node
    const condition2 =
      !targetNode.data.value.level && sourceNode.data.value.level;
    // set edge between an unassigned source node and a node on level 2, the unassigned node will be assigned to level 1
    const condition3 =
      !sourceNode.data.value.level &&
      targetNode.data.value.level &&
      targetNode.data.value.level == 2;
    if (condition1 || condition2 || condition3) {
      if (condition2 && !condition1 && !condition3) {
        targetNode.data.value.level = sourceNode.data.value.level + 1;
      }
      if (condition3 && !condition1 && !condition2) {
        sourceNode.data.value.level = 1;
      }
      setEdges(
        (eds) =>
          addEdge(
            {
              source,
              target,
              type: "customEdge",
              animated: true,
              id: `${source}-${target}`,
            },
            eds
          ),
        []
      );
      setPEdges(
        (eds) =>
          addEdge(
            {
              source,
              target,
              type: "customEdge",
              animated: true,
              id: `${source}-${target}`,
            },
            eds
          ),
        []
      );
    } else {
      toast.info("Connection not allowed.", {
        position: "top-center",
      });
    }
  });

  // only delete node if parent node available for each of deleted node's children
  const handleDeleteNode = useCallback((nodeId) => {
    const deleted = [nodes.find((node) => node.id === nodeId)];
    const outgoing_nodes = getOutgoers(deleted[0], nodes, edges);
    let canDelete = true;
    const edgesWithoutNode = edges.filter(
      (edge) => edge.source !== deleted[0].id
    );
    outgoing_nodes.forEach((node) => {
      if (getIncomers(node, nodes, edgesWithoutNode).length < 1) {
        canDelete = false;
      }
    });
    const children = outgoing_nodes.map((node) => node.data.value.name);
    const childrenString = `${children
      .slice(0, -1)
      .join(", ")} and ${children.slice(-1)}`;
    if (canDelete) {
      setNodes((nodes) => nodes.filter((node) => node.id !== deleted[0].id));
      setPNodes((nodes) => nodes.filter((node) => node.id !== deleted[0].id));
    } else {
      toast.info(
        `Cannot delete ${
          deleted[0].data.value.name
        } yet. Assign an alternative manager to ${
          children.length > 1 ? childrenString : children[0]
        } first.`,
        {
          position: "top-center",
        }
      );
    }
  });

  // only delete edge if alternative source node available for children of source node
  const handleDeleteEdge = (edgeId) => {
    const edgeIdArray = edgeId.split("-");
    const [sourceId, targetId] = edgeIdArray;
    let sources = [];
    let targets = [];
    edges.forEach((edge) => {
      sources.push(edge.source);
      targets.push(edge.target);
    });
    const sourceNode = nodes.find((node) => node.id === sourceId);
    const targetNode = nodes.find((node) => node.id === targetId);
    const sourceEdges = sources.filter((source) => source === sourceId).length;
    const targetEdges = targets.filter((target) => target === targetId).length;
    // delete an edge if there's at least one parent for each child
    const condition1 = sourceEdges >= 1 && targetEdges > 1;
    // delete an edge if the target node is a leaf node
    const condition2 = getOutgoers(targetNode, nodes, edges).length == 0;
    if (condition1 || condition2) {
      setEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
      setPEdges((edges) => edges.filter((edge) => edge.id !== edgeId));
    } else {
      toast.info(
        `Cannot delete connection. Assign an alternative manager to ${targetNode.data.value.name} first.`,
        {
          position: "top-center",
        }
      );
    }
    if (condition2 && !condition1) {
      targetNode.data.value.level = null;
    }
    // set level of source/target to null if it's not connected to any nodes
    const newEdges = edges.filter((edge) => edge.id !== edgeId);
    if (
      getIncomers(sourceNode, nodes, newEdges).length == 0 &&
      getOutgoers(sourceNode, nodes, newEdges).length == 0
    ) {
      sourceNode.data.value.level = null;
    }
    if (
      getIncomers(targetNode, nodes, newEdges).length == 0 &&
      getOutgoers(targetNode, nodes, newEdges).length == 0
    ) {
      targetNode.data.value.level = null;
    }
  };

  return (
    <OrgStructureContext.Provider
      value={{ handleDeleteNode, handleDeleteEdge }}
    >
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
            onConnect={onConnect}
            connectionLineType={"customEdge"}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
          >
            <Controls showInteractive={false} />
          </ReactFlow>
        </ReactFlowProvider>
      </div>
      <ToastContainer />
    </OrgStructureContext.Provider>
  );
}

export default EditSubFlow