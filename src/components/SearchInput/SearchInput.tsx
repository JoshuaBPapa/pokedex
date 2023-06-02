import { FormEvent, useState } from 'react';

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
    <form onSubmit={(e) => onSubmit(e)}>
      <input
        value={input}
        type="text"
        placeholder="Search by name"
        readOnly={disabled}
        onChange={(e) => setInput(e.target.value)}
      />
      <button disabled={disabled}>search</button>
    </form>
  );
};

export default SearchInput;
