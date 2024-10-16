import { useMutation, useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_AUTHORS, EDIT_AUTHOR } from "../queries";
import PropTypes from "prop-types";

const EditAuthor = ({ show }) => {
  const [name, setName] = useState("");
  const [born, setBorn] = useState("");
  const { loading, error, data } = useQuery(ALL_AUTHORS);

  const [updateAuthor] = useMutation(EDIT_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }],
  });

  if (!show) {
    return null;
  }

  // Handle loading state
  if (loading) {
    return <div>Loading authors...</div>;
  }

  // Handle error state
  if (error) {
    return <div>Error loading authors: {error.message}</div>;
  }

  // Safeguard for undefined data
  if (!data || !data.allAuthors) {
    return <div>No authors found</div>;
  }

  const authors = data.allAuthors;

  const submit = async (e) => {
    e.preventDefault();
    await updateAuthor({ variables: { name: name, setBornTo: born } });
    setName("");
    setBorn("");
  };

  return (
    <div>
      <h3>Edit Author</h3>
      <form onSubmit={submit}>
        <select defaultValue={""} onChange={(e) => setName(e.target.value)}>
          {authors.map((a) => (
            <option key={a.name} value={a.name}>
              {a.name}
            </option>
          ))}
        </select>
        <div>
          Born:
          <input
            type="number"
            value={born}
            onChange={({ target }) => setBorn(Number(target.value))}
          />
        </div>
        <button type="submit">Update Author</button>
      </form>
    </div>
  );
};

EditAuthor.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default EditAuthor;
