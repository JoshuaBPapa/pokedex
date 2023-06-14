import { PokemonMove } from '../../interfaces';

interface Props {
  levelUpMoves: PokemonMove[];
  taughtMoves: PokemonMove[];
}

const PokemonMovesTable: React.FC<Props> = ({ levelUpMoves, taughtMoves }) => {
  const allMoves = [...levelUpMoves, ...taughtMoves];

  const tableBody = allMoves.map((move) => (
    <tr key={move.name}>
      <td>{move.level || '-'}</td>
      <td>{move.name}</td>
      <td>{move.method}</td>
    </tr>
  ));

  return (
    <table>
      <thead>
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
