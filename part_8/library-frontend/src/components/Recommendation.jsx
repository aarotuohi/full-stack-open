import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { ALL_BOOKS, ME } from "../queries";

const Recommendation = (props) => {
  const { data: userResult } = useQuery(ME);
  const { data: bookResult, loading: booksLoading } = useQuery(ALL_BOOKS, {
    variables: { genre: userResult?.me?.favoriteGenre },
  });

  if (!props.show) {
    return null;
  }

  if (booksLoading || !bookResult || !userResult) {
    return <div>loading recommendations...</div>;
  }

  const books = bookResult.allBooks;

  return (
    <div>
      <h2>Recommendations</h2>
      <h3>Books in your favorite genre: {userResult.me.favoriteGenre}</h3>
      <table>
        <tbody>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
          {books.map((book) => (
            <tr key={book.title}>
              <td>{book.title}</td>
              <td>{book.author.name}</td>
              <td>{book.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

Recommendation.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Recommendation;
