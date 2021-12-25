import React, { Component } from "react";
import { Link } from "react-router-dom";
import axios from "axios";

class BookDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      book: {},
    };
  }

  componentDidMount() {
    //console.log("Print id: " + this.props.match.params.id);
    const path = window.location.pathname;
    const id = path.split("/");
    //console.log(words[0]);
    axios
      .get("http://localhost:4000/api/books/" + id[2])
      .then((res) => {
        // console.log("Print-showBookDetails-API-response: " + res.data);
        this.setState({
          book: res.data,
        });
      })
      .catch((err) => {
        console.log("Error from ShowBookDetails");
      });
  }

  onDeleteClick(id) {
    axios
      .delete("http://localhost:4000/api/books/" + id)
      .then((res) => {
        this.props.history.push("/");
      })
      .catch((err) => {
        console.log("Error form ShowBookDetails_deleteClick");
      });
  }

  render() {
    const book = this.state.book;
    let BookItem = (
      <div>
        <table className="table table-hover border-success">
          <tbody>
            <tr>
              <td>Title</td>
              <td>{book.bookName}</td>
            </tr>
            <tr>
              <td>Author</td>
              <td>{book.writer}</td>
            </tr>
            <tr>
              <td>Number</td>
              <td>{book.number}</td>
            </tr>
            <tr>
              <td>Pdf Link</td>
              <td>{book.pdfLink}</td>
            </tr>
            <tr>
              <td>Description</td>
              <td>{book.text}</td>
            </tr>
          </tbody>
        </table>
      </div>
    );

    return (
      <div className="ShowBookDetails">
        <div className="container">
          <div className="row">
            {/* <div className="col-md-10 m-auto">
              <br /> <br />
              <Link
                to="/unilib/library"
                className="btn btn-outline-warning float-left"
              >
                Show Book List
              </Link>
            </div> */}
            <br />
            <div className="col-md-8 m-auto">
              <h1 className="display-4 text-center text-success">
                Book's Informaions
              </h1>
              {/* <p className="lead text-center">View Book's Info</p> */}
              <hr /> <br />
            </div>
          </div>
          <div>{BookItem}</div>

          {/* <div className="row">
            <div className="col-md-6">
              <button
                type="button"
                className="btn btn-outline-danger btn-lg btn-block"
                onClick={this.onDeleteClick.bind(this, book._id)}
              >
                Delete Book
              </button>
              <br />
            </div>

            <div className="col-md-6">
              <Link
                to={`/edit-book/${book._id}`}
                className="btn btn-outline-info btn-lg btn-block"
              >
                Edit Book
              </Link>
              <br />
            </div>
    </div>*/}
        </div>
      </div>
    );
  }
}

export default BookDetails;
