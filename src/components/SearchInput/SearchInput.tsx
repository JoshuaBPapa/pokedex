import { FormEvent, useState } from 'react';
import { PokedexScreen } from '../PokedexScreen/PokedexScreen';
import { ReactComponent as SearchIcon } from '../../imgs/icons/search.svg';
import './SearchInput.scss';

interface Props {
  handleSearchInput: (query: string) => void;
  disabled: boolean;
}

const SearchInput: React.FC<Props> = ({ handleSearchInput, disabled }) => {
  const [input, setInput] = useState('');

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!disabled) {
      handleSearchInput(input.trim().toLowerCase());
    }
  };

  return (
    <form onSubmit={(e) => onSubmit(e)} className="search-input">
      <PokedexScreen styleProps={{ marginRight: '10px', width: '100%' }}>
        <input
          value={input}
          type="text"
          placeholder="Search by name..."
          readOnly={false}
          onChange={(e) => setInput(e.target.value)}
          disabled={disabled}
        />
      </PokedexScreen>
      <button aria-label="search" disabled={disabled} className="param-button">
        <SearchIcon />
      </button>
    </form>
  );
};

export default SearchInput;
