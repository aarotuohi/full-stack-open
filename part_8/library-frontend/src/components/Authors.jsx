import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { ALL_AUTHORS } from "../queries";

const Authors = (props) => {
  const { loading, error, data } = useQuery(ALL_AUTHORS);

  if (!props.show) {
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

  return (
    <div>
      <h2>Authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>Born</th>
            <th>Books</th>
          </tr>
          {authors.map((a) => (
            <tr key={a.name}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Authors.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Authors;
