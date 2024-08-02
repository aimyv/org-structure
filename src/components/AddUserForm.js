import React, { useState } from "react";
import styled from "styled-components";
import { ChevronRight } from 'lucide-react';
import Tooltip from "@mui/material/Tooltip";
import { useForm } from "react-hook-form";
import Drawer from '@mui/material/Drawer';

const Close = styled(ChevronRight)`
  color: grey;
  &:hover {
    color: #4c90ff;
    transition: 0.3s;
  }
`

const Header = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding: 0 10px;
  margin: 10px 0;
`

const Heading = styled.p`
  font-size: 1rem;
  font-weight: 500;
`

const Form = styled.form`
  padding: 0 15px;
`

const Input = styled.input`
  width: 100%;
  height: 30px;
  border: solid 0.5px lightgrey;
  margin: 5px 0;
  border-radius: 5px;
`;

const Submit = styled.input`
  width: 102.5%;
  border: none;
  padding: 10px;
  border-radius: 10px;
  background: #4c90ff;
  margin: 10px auto;
  color: white;
  &:hover {
    opacity: 0.7;
    transition: 0.3s;
  }
`;

function getRandomInt(min, max) {
  const minCeiled = Math.ceil(min);
  const maxFloored = Math.floor(max);
  return Math.floor(Math.random() * (maxFloored - minCeiled) + minCeiled); // The maximum is exclusive and the minimum is inclusive
}

export function AddUserForm({ title, initialNodes, setPNodes, openDrawer, setOpenDrawer }) {
  const [data, setData] = useState("");
  const { register, handleSubmit } = useForm();

  return (
      <Drawer
      sx={{
        width: 240,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: 240,
        },
      }}
        variant="persistent"
        anchor="right"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <Header>
          <Tooltip title='Close Form'>
            <Close onClick={() => {
              setOpenDrawer(!openDrawer)
              // setEdit(true)
              }} />
          </Tooltip>
          <Heading>Add User</Heading>
          </Header>
          <Form onSubmit={handleSubmit((data) => {
            setData(() => JSON.stringify(data))
            // console.log(data)
            const newNode =  {
                id: `${getRandomInt(20, 100)}`,
                type: 'person',
                department: title,
                data: {
                  value: {
                    name: `${data.firstName} ${data.secondName}`,
                    titles: data.roles.split(","),
                    image: '',
                    level: null,
                  }
                },
                position: { x: 0, y: 0 },
                draggable: false,
              }
            console.log(newNode)
            // setPNodes([
            //   ...initialNodes,
            //   newNode
            // ])
            initialNodes.push(newNode)
            console.log(initialNodes)
            })}>
            <Input {...register("firstName", { required: true })} placeholder="Enter first name" />
            <Input {...register("secondName", { required: true })} placeholder="Enter second name" />
            <Input {...register("roles", { required: true })} placeholder="Enter all roles e.g. founder, CEO" />
            <Submit type="submit" />
          </Form>
      </Drawer>
  );
}