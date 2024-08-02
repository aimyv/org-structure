import { createContext } from "react";

const OrgStructureContext = createContext({
  handleDeleteNode: (nodeId) => {},
  handleDeleteEdge: (edgeId) => {},
});

export default OrgStructureContext
