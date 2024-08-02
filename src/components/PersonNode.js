import { Handle, Position, useNodeId } from "reactflow";
import styled from "styled-components";
import { Info, Check, X, Trash2, Pencil } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
import { useState, useContext } from "react";
import { Badge } from "@mui/material";
import OrgStructureContext from "../context/OrgStructureContext";

const Node = styled.div`
  width: 200px;
  border: 1px solid #ccc;
  padding: 5px 15px;
  border-radius: 5px;
  background: white;
`;

const Name = styled.p`
  margin-bottom: 0;
  font-size: 1rem;
`;

const Title = styled.p`
  margin-top: 5px;
  font-size: 0.75rem;
  color: grey;
`;

const DefaultProfile = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 50%;
  background: ${(props) => props.color};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
`;

const Details = styled.div``;

const HorizontalFlex = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

const StyledInfo = styled(Info)`
  transform: translateY(2px);
`;

const SaveDetail = styled(Check)`
  color: green;
`;

const Cancel = styled(X)`
  color: red;
`;

const EditButtons = styled.div``;

const Display = styled.div`
  display: flex;
  flex-directon: row;
  align-items: center;
  justify-content: space-between;
`;

const Edit = styled.div`
  display: flex;
  flex-directon: row;
  align-items: center;
  justify-content: space-between;
  width: 90%;
`;

const EditName = styled(Edit)`
  margin-top: 10px;
`;

const Input = styled.input`
  width: 75%;
  border: solid 0.5px lightgrey;
`;

const EditTitle = styled(Edit)`
  margin-bottom: 10px;
`;

const StyledPencil = styled(Pencil)`
  margin: 0;
`;

const Trash = styled(Trash2)`
  margin: 0;
`;

function PersonNode({ data, isConnectable }) {
  const titles = data.value.titles;
  const [details, setDetails] = useState({
    name: data.value.name,
    titles: data.value.titles,
  });
  const [editName, setEditName] = useState(false);
  const [editTitles, setEditTitles] = useState(false);
  const nodeId = useNodeId();
  const [showEdit, setShowEdit] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const { handleDeleteNode } = useContext(OrgStructureContext);

  return (
    <Badge
      onMouseEnter={() => setShowEdit(true)}
      onMouseLeave={() => setShowEdit(false)}
      invisible={!showEdit}
      color="warning"
      badgeContent={
        <Tooltip title="Edit Member">
          <StyledPencil
            size={15}
            color="white"
            onClick={() => {
              setEditName(true);
              setEditTitles(true);
            }}
          />
        </Tooltip>
      }
    >
      <Badge
        onMouseEnter={() => setShowDelete(true)}
        onMouseLeave={() => setShowDelete(false)}
        invisible={!showDelete}
        color="error"
        badgeContent={
          <Tooltip title="Delete Member">
            <Trash
              size={15}
              color="white"
              onClick={() => handleDeleteNode(nodeId)}
            />
          </Tooltip>
        }
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
      >
        <Node>
          <Handle
            type="target"
            position={Position.Top}
            isConnectable={isConnectable}
          />
          <HorizontalFlex>
            <Details>
              {!editName ? (
                <Display>
                  <Name>{data.value.name}</Name>
                </Display>
              ) : (
                <EditName>
                  <Input
                    type="text"
                    placeholder="Enter name"
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        name: e.target.value,
                      })
                    }
                  />
                  <EditButtons>
                    <SaveDetail
                      size={12}
                      onClick={() => {
                        setEditName(!editName);
                        data.value.name = details.name;
                      }}
                    />
                    <Cancel
                      size={12}
                      onClick={() => {
                        setEditName(!editName);
                        details.name = data.value.name;
                      }}
                    />
                  </EditButtons>
                </EditName>
              )}
              {!editTitles ? (
                <Title>
                  {titles[0]}{" "}
                  {titles.length > 1 && (
                    <Tooltip
                      title={`Other Positions: ${titles.slice(1).join(", ")}`}
                    >
                      <StyledInfo size={12} />
                    </Tooltip>
                  )}
                </Title>
              ) : (
                <EditTitle>
                  <Input
                    type="text"
                    placeholder="Enter roles"
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        titles: e.target.value.split(","),
                      })
                    }
                  />
                  <EditButtons>
                    <SaveDetail
                      size={12}
                      onClick={() => {
                        setEditTitles(!editTitles);
                        data.value.titles = details.titles;
                      }}
                    />
                    <Cancel
                      size={12}
                      onClick={() => {
                        setEditTitles(!editTitles);
                        details.titles = data.value.titles;
                      }}
                    />
                  </EditButtons>
                </EditTitle>
              )}
            </Details>
            {!editName && !editTitles && (
              <DefaultProfile color={data.value.color}>
                {data.value.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </DefaultProfile>
            )}
          </HorizontalFlex>
          <Handle
            type="source"
            position={Position.Bottom}
            isConnectable={isConnectable}
          />
        </Node>
      </Badge>
    </Badge>
  );
}

export default PersonNode