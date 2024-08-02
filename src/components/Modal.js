import React, { useState } from "react";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import styled from "styled-components";
import { Pencil, Network, UserPlus } from "lucide-react";
import Tooltip from "@mui/material/Tooltip";
// import { AddUserForm } from "./index";

const Title = styled.p`
  font-size: 1.25rem;
  margin-top: 5px;
  margin-bottom: 0;
`;

const Subtitle = styled.p`
  font-size: 1rem;
  margin-top: 5px;
  color: #aaa;
`;

const StyledPencil = styled(Pencil)`
  color: grey;
  position: absolute;
  top: 40px;
  right: 25px;
  &:hover {
    color: #4c90ff;
    transition: 0.3s;
  }
`;

const StyledNetwork = styled(Network)`
  color: grey;
  position: absolute;
  top: 40px;
  right: 25px;
  &:hover {
    color: #4c90ff;
    transition: 0.3s;
  }
`;

const AddUser = styled(UserPlus)`
  color: grey;
  position: absolute;
  top: 40px;
  right: 60px;
  &:hover {
    color: #4c90ff;
    transition: 0.3s;
  }
`;

const Content = styled(DialogContent)`
  position: relative;
`;

function Modal({
  title,
  subtitle,
  open,
  setOpen,
  edit,
  setEdit,
  initialNodes,
  setPNodes,
  children,
}) {
  const [openDrawer, setOpenDrawer] = useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="dialog-title"
      aria-describedby="dialog-description"
      // fullWidth
      // maxWidth="lg"
      PaperProps={{
        style: {
          minHeight: "90%",
          minWidth: "90%",
        },
      }}
    >
      <Content>
        <Title id="dialog-title">{title}</Title>
        <Subtitle id="dialog-subtitle">{subtitle} members</Subtitle>
        {
          !edit ? (
            <>
              <Tooltip title="Edit Department Content">
                <StyledPencil size={25} onClick={() => setEdit(!edit)} />
              </Tooltip>
            </>
          ) : (
            // <>
            // <Tooltip title='Add User'>
            //     <AddUser size={25} onClick={() => setOpenDrawer(!openDrawer)} />
            //   </Tooltip>
            <Tooltip title="See Hierarchy">
              <StyledNetwork size={25} onClick={() => setEdit(!edit)} />
            </Tooltip>
          )
          // </>
        }
        {children}
      </Content>
      {/* <AddUserForm
        title={title}
        initialNodes={initialNodes}
        setPNodes={setPNodes}
        openDrawer={openDrawer}
        setOpenDrawer={setOpenDrawer}
      /> */}
    </Dialog>
  );
}

export default Modal