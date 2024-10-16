import PropTypes from "prop-types";
import { useQuery } from "@apollo/client";
import { useState } from "react";
import { ALL_BOOKS } from "../queries";

const Books = (props) => {
  const [genreFilter, setGenreFilter] = useState("");
  const allBooks = useQuery(ALL_BOOKS);
  const filteredBooks = useQuery(ALL_BOOKS, { variables: { genre: genreFilter } });

  if (!props.show) {
    return null;
  }

  if (allBooks.loading || filteredBooks.loading) {
    return <div>loading...</div>;
  }

  const books = filteredBooks.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
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
        {Array.from(new Set(allBooks.data.allBooks.flatMap(b => b.genres))).map((genre) => (
          <button key={genre} onClick={() => setGenreFilter(genre)}>
            {genre}
          </button>
        ))}
        <button onClick={() => setGenreFilter("")}>all genres</button>
      </div>
    </div>
  );
};

Books.propTypes = {
  show: PropTypes.bool.isRequired,
};

export default Books;
