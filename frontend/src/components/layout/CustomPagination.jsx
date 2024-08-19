import React, { useEffect, useState } from "react";
import Pagination from "react-js-pagination";
import { useNavigate, useSearchParams } from "react-router-dom";

const CustomPagination = ({ resPerPage, filteredProductsCount }) => {
  const [activePage, setActivePage] = useState();

  let [searchParams] = useSearchParams();

  const page = Number(searchParams.get("page")) || 1;
  const navigate = useNavigate();

  useEffect(() => {
    setActivePage(page);
  }, [page]);

  const setActivePageNumber = (pageNumber) => {
    setActivePage(pageNumber);

    if (searchParams.has("page")) {
      searchParams.set("page", pageNumber);
    } else {
      searchParams.append("page", pageNumber);
    }

    const path = window.location.pathname + "?" + searchParams.toString();
    navigate(path);
  };
  return (
    <div className="d-flex justify-content-center">
      {resPerPage < filteredProductsCount && (
        <Pagination
          activePage={activePage}
          itemsCountPerPage={resPerPage}
          totalItemsCount={filteredProductsCount}
          onChange={setActivePageNumber}
          nextPageText={"Next"}
          prevPageText={"Prev"}
          firstPageText={"First"}
          lastPageText={"Last"}
          itemClass="page-item"
          linkClass="page-link"
        />
      )}
    </div>
  );
};

export default CustomPagination;
