import React from "react";

const Pagination = (props) => {
    const pageNumber = [];
    for (let i = 1; i <= Math.ceil(props.totalItems / props.itemsPerPage); i++) {
        pageNumber.push(i);
    }
    return (
        <nav>
            <ul className="pagination pagination-sm justify-content-end border-0">
                {pageNumber.map(number => {
                    return (
                        <li className="page-item">
                            <a onClick={() => props.selectedPage(number)} href="!#" className="page-link">{number}</a>
                        </li>
                    )
                })}
            </ul>
        </nav>
    )
}
export default Pagination