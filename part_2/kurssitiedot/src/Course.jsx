const Header = ({ label }) => <h1>{label}</h1>;

const Part = ({ content: { name, exercises } }) => (
  <p>{name} {exercises}</p>
);

const Total = ({ parts }) => {
  const totalExercises = parts.reduce((sum, part) => sum + part.exercises, 0);
  return <b>total of {totalExercises} exercises</b>;
};

const Content = ({ parts }) => (
  <div>
    {parts.map((part) => (
      <Part key={part.id} content={part} />
    ))}
    <Total parts={parts} />
  </div>
);

const Course = ({ course }) => (
  <div>
    {course.map(({ id, name, parts }) => (
      <div key={id}>
        <Header label={name} />
        <Content parts={parts} />
      </div>
    ))}
  </div>
);

export default Course;
