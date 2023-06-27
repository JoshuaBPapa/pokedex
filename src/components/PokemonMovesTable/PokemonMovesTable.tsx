import { PokemonMove } from '../../interfaces';
import './PokemonMovesTable.scss';

interface Props {
  levelUpMoves: PokemonMove[];
  taughtMoves: PokemonMove[];
  bgColour: string;
}

const PokemonMovesTable: React.FC<Props> = ({ levelUpMoves, taughtMoves, bgColour }) => {
  const allMoves = [...levelUpMoves, ...taughtMoves];

  const tableBody = allMoves.map((move) => (
    <tr key={move.name}>
      <td>{move.level || '-'}</td>
      <td>{move.name}</td>
      <td>{move.method}</td>
    </tr>
  ));

  return (
    <table className="pokemon-moves-table">
      <thead style={{ backgroundColor: bgColour }}>
        <tr>
          <th>Level</th>
          <th>Move Name</th>
          <th>Method</th>
        </tr>
      </thead>
      <tbody>{tableBody}</tbody>
    </table>
  );
};

export default PokemonMovesTable;
