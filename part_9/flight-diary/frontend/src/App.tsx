import { useEffect, useState } from "react";
import axios from "axios";
import { getAllDiaryEntries, addDiaryEntry, deleteDiaryEntry } from "./diaryService";  
import { DiaryEntry } from "./types";
import './App.css';  

const App = () => {
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [formState, setFormState] = useState({
    date: "",
    visibility: "",
    weather: "",
    comment: "",
  });
  const [error, setError] = useState<string | undefined>("");

  const visibilityOptions = ["great", "good", "ok", "poor"];
  const weatherOptions = ["sunny", "rainy", "cloudy", "stormy", "windy"];

  useEffect(() => {
    const fetchDiaryEntries = async () => {
      try {
        const entries = await getAllDiaryEntries();
        setDiaryEntries(entries);
      } catch (error) {
        console.error("Error fetching diary entries:", error);
      }
    };
    fetchDiaryEntries();
  }, []);

  const handleSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();
    try {
      const newEntry = await addDiaryEntry(formState);
      setDiaryEntries([...diaryEntries, newEntry]);
      setFormState({ date: "", visibility: "", weather: "", comment: "" });
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        setError(error.response.data);
        setTimeout(() => setError(""), 5000);
      } else {
        console.error(error);
      }
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteDiaryEntry(id);
      setDiaryEntries(diaryEntries.filter(entry => entry.id !== id));
    } catch (error) {
      console.error("Error deleting entry:", error);
    }
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = event.target;
    setFormState(prevState => ({ ...prevState, [name]: value }));
  };

  return (
    <div className="container">
      <h1 className="heading">Flight Diary</h1>
      <h2 className="subHeading">Add new Entry</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit} className="form">
        <div className="formGroup">
          <label htmlFor="date" className="label">Date</label>
          <input
            type="date"
            id="date"
            name="date"
            value={formState.date}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <div className="formGroup">
          <label htmlFor="visibility" className="label">Visibility</label>
          <select
            id="visibility"
            name="visibility"
            value={formState.visibility}
            onChange={handleInputChange}
            className="select"
          >
            <option value="">Select Visibility</option>
            {visibilityOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="formGroup">
          <label htmlFor="weather" className="label">Weather</label>
          <select
            id="weather"
            name="weather"
            value={formState.weather}
            onChange={handleInputChange}
            className="select"
          >
            <option value="">Select Weather</option>
            {weatherOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        <div className="formGroup">
          <label htmlFor="comment" className="label">Comment</label>
          <input
            type="text"
            id="comment"
            name="comment"
            value={formState.comment}
            onChange={handleInputChange}
            className="input"
          />
        </div>
        <button type="submit">Add</button>
      </form>
      <div className="diaryEntries">
        <h2>Diary entries</h2>
        {diaryEntries.map(entry => (
          <div key={entry.id} className="diaryEntry">
            <h3>{entry.date}</h3>
            <p>visibility: {entry.visibility}</p>
            <p>weather: {entry.weather}</p>
            {entry.comment && <p>comment: {entry.comment}</p>}
            <button onClick={() => handleDelete(entry.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default App;
