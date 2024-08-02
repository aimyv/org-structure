import { useState } from "react";
import { Handle, Position } from "reactflow";
import styled from "styled-components";
import { personNodes, initialEdges } from "../data";
import Modal from "./Modal";
import ShowSubFlow from "./ShowSubFlow";
import EditSubFlow from "./EditSubFlow";

const Node = styled.div`
  width: 192px;
  border: none;
  padding: 5px 20px;
  border-radius: 50px;
  background: black;
  color: white;
`;

const Name = styled.p`
  font-size: 1rem;
`;

const NumberOfMembers = styled.p`
  color: #ddd;
`;

const HorizontalFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

function DepartmentNode({ data, isConnectable }) {
  const [open, setOpen] = useState(false);
  const [pnodes, setPNodes] = useState(
    personNodes.filter((node) => node.department === data.value.name)
  );
  const [pedges, setPEdges] = useState(initialEdges);
  const [edit, setEdit] = useState(false);

  const onClick = () => {
    setOpen(true);
  };

  return (
    <>
      <Node onClick={onClick}>
        <Handle
          type="target"
          position={Position.Left}
          isConnectable={isConnectable}
        />
        <HorizontalFlex>
          <Name>{data.value.name}</Name>
          <NumberOfMembers>{pnodes.length}</NumberOfMembers>
        </HorizontalFlex>
      </Node>
      <Modal
        title={data.value.name}
        subtitle={pnodes.length}
        open={open}
        setOpen={setOpen}
        edit={edit}
        setEdit={setEdit}
        initialNodes={pnodes}
        setPNodes={setPNodes}
      >
        {!edit ? (
          <ShowSubFlow initialNodes={pnodes} initialEdges={pedges} />
        ) : (
          <EditSubFlow
            initialNodes={pnodes}
            setPNodes={setPNodes}
            initialEdges={pedges}
            setPEdges={setPEdges}
          />
        )}
      </Modal>
      <Handle
        type="source"
        position={Position.Right}
        isConnectable={isConnectable}
      />
    </>
  );
}

export default DepartmentNode;