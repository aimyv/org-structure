import styled from 'styled-components';
import React, { useContext } from 'react';
import { getSmoothStepPath } from 'reactflow';
import { BaseEdge, EdgeLabelRenderer } from 'reactflow';
import OrgStructureContext from '../context/OrgStructureContext';

const Container = styled.div``;

const DeleteButton = styled.button`
  width: 20px;
  height: 20px;
  border-radius: 50%;
  border: none;
`;

function CustomEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}) {
  const [edgePath, labelX, labelY] = getSmoothStepPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  const { handleDeleteEdge } = useContext(OrgStructureContext);

  const onEdgeClick = (evt, id) => {
    evt.stopPropagation();
    handleDeleteEdge(id);
  };
  return (
    <>
      <BaseEdge path={edgePath} markerEnd={markerEnd} style={style} />
      <EdgeLabelRenderer>
        <Container
          style={{
            position: 'absolute',
            zIndex: 100000,
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 12,
            // everything inside EdgeLabelRenderer has no pointer events by default
            // if you have an interactive element, set pointer-events: all
            pointerEvents: 'all',
          }}
          className="nodrag nopan"
        >
            <DeleteButton
              onClick={(event) => onEdgeClick(event, id)}
            >
              ×
            </DeleteButton>
        </Container>
      </EdgeLabelRenderer>
    </>
  );
}

export default CustomEdge