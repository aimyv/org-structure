const position = { x: 0, y: 0 };
const draggable = false;

export const personNodes = [
  {
    id: "1",
    type: "person",
    department: "Design",
    data: {
      value: {
        name: "Isabelle Sanders",
        titles: ["Chief Innovation Officer"],
        image: "",
        level: 1,
        color: "#507944",
      },
    },
    position,
    draggable,
  },
  {
    id: "2",
    type: "person",
    department: "Design",
    data: {
      value: {
        name: "Joe Daly",
        titles: ["UX/UI Designer", "Project Manager"],
        image: "",
        level: 2,
        color: "#dcc01b",
      },
    },
    position,
    draggable,
  },
  {
    id: "3",
    type: "person",
    department: "Design",
    data: {
      value: {
        name: "Danielle Begum",
        titles: ["Product Designer"],
        image: "",
        level: 2,
        color: "#b22222",
      },
    },
    position,
    draggable,
  },
  {
    id: "4",
    type: "person",
    department: "Design",
    data: {
      value: {
        name: "Kauan Gomes",
        titles: ["Designer", "Architect"],
        image: "",
        level: 2,
        color: "#e35822",
      },
    },
    position,
    draggable,
  },
  {
    id: "6",
    type: "person",
    department: "Tech",
    data: {
      value: {
        name: "Joel Watkins",
        titles: ["Chief Technology Officer", "Lead Developer"],
        image: "",
        level: 1,
        color: "#b22222",
      },
    },
    position,
    draggable,
  },
  {
    id: "7",
    type: "person",
    department: "Tech",
    data: {
      value: {
        name: "Sarah Bachmeier",
        titles: ["AI Engineer", "Senior Developer"],
        image: "",
        level: 2,
        color: "#e35822",
      },
    },
    position,
    draggable,
  },
  {
    id: "8",
    type: "person",
    department: "Tech",
    data: {
      value: {
        name: "Edward Tyler",
        titles: ["Cloud Engineer"],
        image: "",
        level: 2,
        color: "#dcc01b",
      },
    },
    position,
    draggable,
  },
  {
    id: "9",
    type: "person",
    department: "Tech",
    data: {
      value: {
        name: "Isabella Alves",
        titles: ["Full Stack Developer"],
        image: "",
        level: 2,
        color: "#57b0bc",
      },
    },
    position,
    draggable,
  },
  {
    id: "10",
    type: "person",
    department: "Tech",
    data: {
      value: {
        name: "Odo Laframboise",
        titles: ["Frontend Intern"],
        image: "",
        level: 3,
        color: "#507944",
      },
    },
    position,
    draggable,
  },
  {
    id: "11",
    type: "person",
    department: "Tech",
    data: {
      value: {
        name: "Kevin Wechsler",
        titles: ["Full-Stack Intern"],
        image: "",
        level: 3,
        color: "#b22222",
      },
    },
    position,
    draggable,
  },
  {
    id: "12",
    type: "person",
    department: "Tech",
    data: {
      value: {
        name: "Mario Weber",
        titles: ["Backend Intern"],
        image: "",
        level: 3,
        color: "#fa8183",
      },
    },
    position,
    draggable,
  },
];

let departmentNodes = [];

personNodes.forEach((node) => {
  if (!departmentNodes.includes(node.department)) {
    departmentNodes.push(node.department);
  }
});

departmentNodes = departmentNodes.map((dep) => ({
  id: dep,
  type: "department",
  data: { value: { name: dep } },
  position,
  draggable,
  deletable: false,
}));

export const initialNodes = departmentNodes;

export let initialEdges = [
  { id: "1-2", source: "1", target: "2", type: "smoothstep", animated: false },
  { id: "1-3", source: "1", target: "3", type: "smoothstep", animated: false },
  { id: "2-4", source: "1", target: "4", type: "smoothstep", animated: false },
  { id: "3-5", source: "3", target: "5", type: "smoothstep", animated: false },
  {
    id: "6-7",
    source: "6",
    target: "7",
    type: "smoothstep",
    animated: false,
  },
  { id: "6-8", source: "6", target: "8", type: "smoothstep", animated: false },
  { id: "6-9", source: "6", target: "9", type: "smoothstep", animated: false },
  {
    id: "9-10",
    source: "9",
    target: "10",
    type: "smoothstep",
    animated: false,
  },
  {
    id: "9-11",
    source: "9",
    target: "11",
    type: "smoothstep",
    animated: false,
  },
  {
    id: "9-12",
    source: "9",
    target: "12",
    type: "smoothstep",
    animated: false,
  },
];

for (var i = 0; i < departmentNodes.length - 1; i++) {
  initialEdges = [
    ...initialEdges,
    {
      id: `${departmentNodes[i].id}-${departmentNodes[i + 1].id}`,
      source: departmentNodes[i].id,
      target: departmentNodes[i + 1].id,
      type: "smoothstep",
      animated: false,
      deletable: false,
    },
  ];
}
