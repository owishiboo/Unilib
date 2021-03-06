import { React } from "react";
import { Card } from "react-bootstrap";
import teacherImg from "../../images/teacher.png";
import studentImg from "../../images/student.png";
import adminImg from "../../images/manager.png";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import "../../styles/Fonts.css";
import axios from "axios";
import selectType from "../popups";

/**
 * Creates card out of all user data
 * @param {array} props description of individual users
 * @returns cards containing user description
 */
const UserCard = (props) => {
  const user = props.user;
  let menu;
  /**
   * checking if the logged in user is admin or if he is in the spefic page we want
   */
  const requireAuth = () => {
    const path = window.location.pathname;
    const words = path.split("/");
    console.log(`in user card ${words[0]}`);
    if (words[1] === "unilib") {
      menu = (
        <div className="text-end">
          <div>
            <Link to={`/send-email/${user.email}`}>
              {" "}
              <button
                type="button"
                className="btn btn-info btn-block m-2"
                data-toggle="tooltip"
                data-placement="top"
                title="Click to send an email to the user"
              >
                <i class="fas fa-paper-plane" style={{ color: "white" }} />
              </button>
            </Link>

            <button
              type="button"
              className="btn btn-danger btn-block m-2"
              data-toggle="tooltip"
              data-placement="top"
              title="Click to delete the account of the user"
              onClick={onDeleteClick.bind(this, user._id)}
            >
              <i class="fas fa-trash-alt" style={{ color: "white" }} />
            </button>
          </div>
        </div>
      );
    } else if (words[1] === "show-book") {
      menu = (
        <div>
          <button
            type="button"
            className="btn btn-success btn-block"
            onClick={onIssueClick.bind(this, user._id)}
          >
            Issue This Book
          </button>
        </div>
      );
    } else {
      menu = <div></div>;
    }
  };

  const onIssueClick = (id) => {
    const path = window.location.pathname;
    const bookRef = path.split("/");
    axios
      .post("http://localhost:4000/issue-book", {
        email: user.email,
        book: bookRef[2],
      })
      .then(
        (success) => {
          selectType("small");
          console.log("sucessfully issued this book");
        },
        (error) => {
          console.log(error);
        }
      );
  };

  const onDeleteClick = (id) => {
    selectType("small");
    axios
      .delete("http://localhost:4000/api/delete/user/" + id)
      .then((res) => {
        window.location.reload();
        this.props.history.push("/unilib/admin/library");
      })
      .catch((err) => {
        console.log("Error form ShowBookDetails_deleteClick");
      });
  };

  requireAuth();

  return (
    <div>
      <Card style={{ height: "22rem" }} className="p-2">
        <Card.Title className="mt-2">
          {user.role === "teacher" ? (
            <img
              src={teacherImg}
              style={{ width: "50px", height: "50px" }}
              alt="teacher"
              data-toggle="tooltip"
              data-placement="top"
              title="Teacher Badge"
            />
          ) : user.role === "admin" ? (
            <img
              src={adminImg}
              style={{ width: "50px", height: "50px" }}
              alt="student"
              data-toggle="tooltip"
              data-placement="top"
              title="Admin Badge"
            />
          ) : (
            <img
              src={studentImg}
              style={{ width: "50px", height: "50px" }}
              alt="student"
              data-toggle="tooltip"
              data-placement="top"
              title="Student Badge"
            />
          )}
        </Card.Title>
        <Card.Body className="text-start">
          {/* <Card.Title>
            <Link to={`/show-book/${book._id}`}>{book.bookName}</Link>
         </Card.Title>*/}
          <Card.Text className="fnt-showUser text-capitalize">
            <span className="text-success " style={{ fontWeight: "bold" }}>
              Name:{" "}
            </span>
            {user.name}
          </Card.Text>
          <Card.Text className="fnt-showUser">
            <span className="text-success" style={{ fontWeight: "bold" }}>
              Email:{" "}
            </span>
            {user.email}
          </Card.Text>
          <Card.Text className="fnt-showUser">
            <span className="text-success" style={{ fontWeight: "bold" }}>
              Reg. number:{" "}
            </span>
            {user.registration}
          </Card.Text>
          <Card.Text className="fnt-showUser text-uppercase">
            <span
              className="text-success text-capitalize"
              style={{ fontWeight: "bold" }}
            >
              Department:{" "}
            </span>
            {user.department}
          </Card.Text>
        </Card.Body>
        <div>{menu}</div>
      </Card>
    </div>
  );
};

export default UserCard;
