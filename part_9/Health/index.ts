import express, { Request, Response } from 'express';
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();
const port = 3003;

// Middleware to parse JSON
app.use(express.json());

app.get('/hello', (_req: Request, res: Response): void => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req: Request, res: Response): void => {
  const height = Number(req.query.height);
  const weight = Number(req.query.weight);

  if (!height || !weight) {
    res.status(400).json({ error: 'malformatted parameters' });
    return; 
  }

  const bmi = calculateBmi(height, weight);
  res.json({ height, weight, bmi });
  return; 
});

app.post('/exercises', (req: Request, res: Response): void => {
  const { daily_exercises, target } = req.body;

  if (!daily_exercises || !target) {
    res.status(400).json({ error: 'parameters missing' });
    return;
  }

  if (isNaN(Number(target)) || !Array.isArray(daily_exercises) || daily_exercises.some(isNaN)) {
    res.status(400).json({ error: 'malformatted parameters' });
    return;
  }

  const result = calculateExercises(daily_exercises, Number(target));
  res.json(result);
  return;
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
