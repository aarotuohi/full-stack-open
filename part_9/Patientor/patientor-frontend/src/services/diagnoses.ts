import axios from "axios";
import { Diagnosis } from "../types";

import { apiBaseUrl } from "../constants";

const getAll = async () => {
  const { data: diagnoses } = await axios.get<Diagnosis[]>(`${apiBaseUrl}/diagnoses`);
  return diagnoses;
};

// eslint-disable-next-line
export default {
  getAll
};