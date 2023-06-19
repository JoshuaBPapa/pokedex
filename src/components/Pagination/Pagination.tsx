import { PokedexScreen } from '../PokedexScreen/PokedexScreen';
import { ReactComponent as PrevIcon } from '../../imgs/icons/prev-arrow.svg';
import { ReactComponent as NextIcon } from '../../imgs/icons/next-arrow.svg';
import './Pagination.scss';

interface Props {
  handlePageClick: (direction: string) => void;
  currentPage: number;
  onLastPage: boolean;
  allDisabled: boolean;
}

const Pagination: React.FC<Props> = ({ handlePageClick, currentPage, onLastPage, allDisabled }) => {
  return (
    <div className="pagination">
      <button
        className="param-button"
        aria-label="previous"
        title="previous"
        onClick={() => handlePageClick('prev')}
        disabled={currentPage <= 1 || allDisabled}
      >
        <PrevIcon />
      </button>
      <PokedexScreen styleProps={{ padding: '5px 15px', textAlign: 'center', margin: '0 5px' }}>
        Page: {currentPage}
      </PokedexScreen>
      <button
        className="param-button"
        aria-label="next"
        title="next"
        onClick={() => handlePageClick('next')}
        disabled={onLastPage || allDisabled}
      >
        <NextIcon />
      </button>
    </div>
  );
};

export default Pagination;
