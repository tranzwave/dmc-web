import { ChevronLeft, ChevronRight } from "lucide-react"; // Import Lucide icons
import { JSX } from "react";
import { Button } from "~/components/ui/button";

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const Pagination = ({ currentPage, totalPages, onPageChange }: PaginationProps) => {
  const pageNumbers: JSX.Element[] = [];
  const maxPagesToShow = 5; // Number of page links to show before using "..."

  const renderPageNumbers = () => {
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    if (endPage - startPage < maxPagesToShow - 1) {
      startPage = Math.max(1, endPage - (maxPagesToShow - 1));
      endPage = Math.min(totalPages, startPage + (maxPagesToShow - 1));
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(
        <Button
          key={i}
          variant={i === currentPage ? "secondary" : "ghost"}
          onClick={() => onPageChange(i)}
          className={i === currentPage ? "bg-secondary-green" : ""}
        >
          {i}
        </Button>
      );
    }

    if (startPage > 1) {
      pageNumbers.unshift(<span key="start-ellipsis">...</span>);
      pageNumbers.unshift(
        <Button key={1} variant="ghost" onClick={() => onPageChange(1)}>
          1
        </Button>
      );
    }

    if (endPage < totalPages) {
      pageNumbers.push(<span key="end-ellipsis">...</span>);
      pageNumbers.push(
        <Button key={totalPages} variant="ghost" onClick={() => onPageChange(totalPages)}>
          {totalPages}
        </Button>
      );
    }

    return pageNumbers;
  };

  return (
    <div className="flex items-center justify-center gap-2 mt-4">
      {/* Previous Button with ChevronLeft Icon */}
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center"
      >
        <ChevronLeft className="mr-1" size={18} />
        Previous
      </Button>
      
      {renderPageNumbers()}
      
      {/* Next Button with ChevronRight Icon */}
      <Button
        variant="ghost"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center"
      >
        Next
        <ChevronRight className="ml-1" size={18} />
      </Button>
    </div>
  );
};

export default Pagination;
