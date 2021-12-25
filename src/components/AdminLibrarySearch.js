import React, { useRef } from "react";

const AdminLibrarySearch = (props) => {
  const inputBar = useRef("");
  const book = props.books;
  //console.log(props.books);
  const searchKeyword = (searchTerm) => {
    if (searchTerm !== "") {
      const newBookList = book.filter((searchItem) => {
        return Object.values(searchItem)
          .join(" ")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());
      });
      props.updateParent(newBookList);
      // console.log(newBookList);
    } else {
      props.updateParent(props.books);
    }
  };
  const getSearchTerm = () => {
    searchKeyword(inputBar.current.value);
  };
  return (
    <div>
      <div class="input-group mb-3">
        {" "}
        <input
          ref={inputBar}
          type="text"
          class="form-control input-text"
          placeholder="Search books...."
          /*onChange={(event) => {
           
          }}*/
          onChange={getSearchTerm}
        />
        <div class="input-group-append">
          {" "}
          <button
            color="black"
            class="btn btn-outline-warning btn-lg"
            type="button"
          >
            <i style={{ color: "black" }} class="fa fa-search"></i>
          </button>{" "}
        </div>
      </div>
    </div>
  );
};

export default AdminLibrarySearch;
