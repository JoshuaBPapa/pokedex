import { GenderPercentage } from '../../interfaces';
import { ReactElement } from 'react';
import './PokemonAbout.scss';

interface Props {
  species: string;
  abilities: string[];
  genderRatio: GenderPercentage | null;
  eggGroups: string[];
}

const PokemonAbout: React.FC<Props> = ({ species, abilities, genderRatio, eggGroups }) => {
  let gender: string | ReactElement = 'Genderless';
  if (genderRatio) {
    gender = (
      <div>
        Male: {genderRatio.male}%, Female: {genderRatio.female}%
      </div>
    );
  }

  return (
    <div className="pokemon-about-container">
      <table className="pokemon-about-table">
        <tbody>
          <tr>
            <td>Species</td>
            <td>{species}</td>
          </tr>
          <tr>
            <td>Abilities</td>
            <td>{abilities.join(', ')}</td>
          </tr>
          <tr>
            <td>Gender</td>
            <td>{gender}</td>
          </tr>
          <tr>
            <td>Egg Groups</td>
            <td>{eggGroups.join(', ')}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default PokemonAbout;
