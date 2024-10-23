
interface HeaderProps {
  courseName: string;
}

const Header = ({ courseName }: HeaderProps) => {
  return <h1>{courseName}</h1>;
};


interface PartProps {
  part: CoursePart;
}

const Part = ({ part }: PartProps) => {
  switch (part.kind) {
    case "basic":
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>
            <em>{part.description}</em>
          </p>
        </div>
      );
    case "group":
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>project exercises {part.groupProjectCount}</p>
        </div>
      );
    case "background":
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>
            <em>{part.description}</em>
          </p>
          <p>background material: {part.backgroundMaterial}</p>
        </div>
      );
    case "special":
      return (
        <div>
          <h3>
            {part.name} {part.exerciseCount}
          </h3>
          <p>
            <em>{part.description}</em>
          </p>
          <p>required skills: {part.requirements.join(", ")}</p>
        </div>
      );
    default:
      return null;
  }
};


interface ContentProps {
  courseParts: CoursePart[];
}

const Content = ({ courseParts }: ContentProps) => {
  return (
    <div>
      {courseParts.map((part, index) => (
        <Part key={index} part={part} />
      ))}
    </div>
  );
};


interface TotalProps {
  courseParts: CoursePart[];
}

const Total = ({ courseParts }: TotalProps) => {
  return (
    <p>
      Number of exercises{" "}
      {courseParts.reduce((carry, part) => carry + part.exerciseCount, 0)}
    </p>
  );
};


interface CoursePartBase {
  name: string;
  exerciseCount: number;
}

interface CoursePartDescription extends CoursePartBase {
  description: string;
}

interface CoursePartBasic extends CoursePartDescription {
  kind: "basic";
}

interface CoursePartGroup extends CoursePartBase {
  groupProjectCount: number;
  kind: "group";
}

interface CoursePartBackground extends CoursePartDescription {
  backgroundMaterial: string;
  kind: "background";
}

interface CoursePartSpecial extends CoursePartDescription {
  requirements: string[];
  kind: "special";
}

type CoursePart =
  | CoursePartBasic
  | CoursePartGroup
  | CoursePartBackground
  | CoursePartSpecial;


const MergedApp = () => {
  const courseName = "Half Stack application development";
  const courseParts: CoursePart[] = [
    {
      name: "Fundamentals",
      exerciseCount: 10,
      description: "This is an awesome course part",
      kind: "basic",
    },
    {
      name: "Using props to pass data",
      exerciseCount: 7,
      groupProjectCount: 3,
      kind: "group",
    },
    {
      name: "Basics of type Narrowing",
      exerciseCount: 7,
      description: "How to go from unknown to string",
      kind: "basic",
    },
    {
      name: "Deeper type usage",
      exerciseCount: 14,
      description: "Confusing description",
      backgroundMaterial:
        "https://type-level-typescript.com/template-literal-types",
      kind: "background",
    },
    {
      name: "Backend development",
      exerciseCount: 21,
      description: "Typing the backend",
      requirements: ["nodejs", "jest"],
      kind: "special",
    },
  ];

  return (
    <div>
      <Header courseName={courseName} />
      <Content courseParts={courseParts} />
      <Total courseParts={courseParts} />
    </div>
  );
};

export default MergedApp;
