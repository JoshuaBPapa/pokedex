interface Props {
  handlePageClick: (direction: string) => void;
  currentPage: number;
  onLastPage: boolean;
  allDisabled: boolean;
}

const Pagination: React.FC<Props> = ({ handlePageClick, currentPage, onLastPage, allDisabled }) => {
  return (
    <div>
      {currentPage}
      <button onClick={() => handlePageClick('prev')} disabled={currentPage <= 1 || allDisabled}>
        prev
      </button>
      <button onClick={() => handlePageClick('next')} disabled={onLastPage || allDisabled}>
        next
      </button>
    </div>
  );
};

export default Pagination;
