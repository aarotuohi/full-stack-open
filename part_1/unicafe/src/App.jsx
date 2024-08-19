import { useState } from "react";

const Button = ({ handleClick, label }) => (
  <button onClick={handleClick}>{label}</button>
);

const StatisticLine = ({ label, value }) => (
  <tr>
    <td>{label}</td>
    <td>{value}</td>
  </tr>
);


const Statistics = ({ good, neutral, bad }) => {
  const allFeedback = good + neutral + bad;
  const averageScore = ((good - bad) / allFeedback).toFixed(1);
  const positivePercentage = ((good / allFeedback) * 100).toFixed(1);

  
  if (allFeedback === 0) {
    return <p>No feedback given</p>;
  }

  
  return (
    <table>
      <tbody>
        <StatisticLine label="Good" value={good} />
        <StatisticLine label="Neutral" value={neutral} />
        <StatisticLine label="Bad" value={bad} />
        <StatisticLine label="All" value={allFeedback} />
        <StatisticLine label="Average" value={averageScore} />
        <StatisticLine label="Positive" value={positivePercentage + " %"} />
      </tbody>
    </table>
  );
};

const App = () => {
  const [good, setGood] = useState(0);
  const [neutral, setNeutral] = useState(0);
  const [bad, setBad] = useState(0);

  const incrementGood = () => setGood(good + 1);
  const incrementNeutral = () => setNeutral(neutral + 1);
  const incrementBad = () => setBad(bad + 1);

  return (
    <>
      <h1>Give Feedback</h1>
      <Button handleClick={incrementGood} label="Good" />
      <Button handleClick={incrementNeutral} label="Neutral" />
      <Button handleClick={incrementBad} label="Bad" />
      <h1>Statistics</h1>
      <Statistics good={good} neutral={neutral} bad={bad} />
    </>
  );
};

export default App;