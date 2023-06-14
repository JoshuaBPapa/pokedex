import { GenderPercentage } from '../../interfaces';

interface Props {
  species: string;
  abilities: string[];
  genderRatio: GenderPercentage | null;
  eggGroups: string[];
}

const PokemonAbout: React.FC<Props> = ({ species, abilities, genderRatio, eggGroups }) => {
  let gender: string | Element = 'Genderless';
  if (genderRatio) gender = `♂️${genderRatio.male}%,  ♀${genderRatio.female}%`;

  return (
    <table>
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
  );
};

export default PokemonAbout;
