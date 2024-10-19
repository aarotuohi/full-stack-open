import diagnoseData from '../../data/diagnoses';
import { Diagnosis } from '../utils/types';

const getDiagnoses = (): Array<Diagnosis> => {
  return diagnoseData;
};

export default {
  getDiagnoses
};