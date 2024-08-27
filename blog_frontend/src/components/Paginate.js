import React from 'react';
import { Pagination } from 'react-bootstrap';

const Paginate = ({ totalPages, currentPage, onPageChange }) => {
    const handlePageClick = (page) => {
        if (page !== currentPage) {
            onPageChange(page);
        }
    };

    const renderPageNumbers = () => {
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(
                <Pagination.Item 
                    key={i} 
                    active={i === currentPage}
                    onClick={() => handlePageClick(i)}
                >
                    {i}
                </Pagination.Item>
            );
        }
        return pageNumbers;
    };

    return (
        <Pagination>
            <Pagination.Prev 
                disabled={currentPage === 1}
                onClick={() => handlePageClick(currentPage - 1)}
            />
            {renderPageNumbers()}
            <Pagination.Next 
                disabled={currentPage === totalPages}
                onClick={() => handlePageClick(currentPage + 1)}
            />
            <Pagination.Item disabled>
                Total Pages: {totalPages}
            </Pagination.Item>
        </Pagination>
    );
};

export default Paginate;
