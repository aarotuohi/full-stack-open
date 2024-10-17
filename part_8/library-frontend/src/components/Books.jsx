import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState("");
  const { data: allBooksData, loading: allBooksLoading, error: allBooksError } = useQuery(ALL_BOOKS);
  const { data: filteredBooksData, loading: filteredBooksLoading, error: filteredBooksError } = useQuery(ALL_BOOKS, {
    variables: { genre: genreFilter },
  });

  if (!props.show) {
    return null;
  }

  // Error handling
  if (allBooksLoading || filteredBooksLoading) {
    return <div>Loading books...</div>;
  }

  if (allBooksError) {
    return <div className="error-message">Error fetching all books: {allBooksError.message}</div>;
  }

  if (filteredBooksError) {
    return <div className="error-message">Error fetching filtered books: {filteredBooksError.message}</div>;
  }

  // Safeguard for undefined data
  if (!filteredBooksData || !filteredBooksData.allBooks) {
    return <div>No books found</div>;
  }

  const books = filteredBooksData.allBooks;

  return (
    <div>
      <h2>Books</h2>
      <table>
        <thead>
          <tr>
            <th>Title</th>
            <th>Author</th>
            <th>Published</th>
          </tr>
        </thead>
        <tbody>
          {books.map((a) => (
            <tr key={a.title}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div>
        {Array.from(new Set(allBooksData.allBooks.flatMap(b => b.genres))).map((genre) => (
          <button key={genre} onClick={() => setGenreFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenreFilter("")}>All genres</button>
      </div>
    </div>
  );
};

Books.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Books;
