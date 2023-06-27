import { Fragment, ReactNode } from 'react';
import { useWaitForImgsLoad } from '../../hooks';
import { EvoPath } from '../../interfaces';
import './PokemonEvolutionPaths.scss';

interface Props {
  evolutionPaths: EvoPath[][];
  bgColour: string;
}

const PokemonEvolutionPaths: React.FC<Props> = ({ evolutionPaths, bgColour }) => {
  const { allImgsLoaded, handleImgLoad, totalToLoadCount } = useWaitForImgsLoad();

  let content: string | ReactNode = 'Loading Evolution Paths';
  if (evolutionPaths[0].length === 1) content = 'This Pokémon is not part of any evolutions';
  else {
    content = (
      <Fragment>
        {!allImgsLoaded && 'loading images'}
        <ul className={allImgsLoaded ? 'evolution-path-list' : 'display-none'}>
          {evolutionPaths.map((path, index) => {
            totalToLoadCount.current += path.length - 1;

            return (
              <li key={index}>
                <div className="evolution-path-number" style={{ backgroundColor: bgColour }}>
                  Evolution Path {index + 1}
                </div>
                <div className="evolution-path">
                  {path.map((pokemon) => (
                    <div key={pokemon.name} className="evolution-path-pokemon">
                      <p>{pokemon.name}</p>
                      <img src={pokemon.spriteImgSrc} alt={pokemon.name} onLoad={handleImgLoad} />
                    </div>
                  ))}
                </div>
              </li>
            );
          })}
        </ul>
      </Fragment>
    );
  }

  return <div className="pokemon-evolution-paths-container">{content}</div>;
};

export default PokemonEvolutionPaths;
