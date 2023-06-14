import { Fragment, ReactNode } from 'react';
import { useWaitForImgsLoad } from '../../hooks';
import { EvoPath } from '../../interfaces';

interface Props {
  evolutionPaths: EvoPath[][];
}

const PokemonEvolutionPaths: React.FC<Props> = ({ evolutionPaths }) => {
  const { allImgsLoaded, handleImgLoad, totalToLoadCount } = useWaitForImgsLoad();

  let content: string | ReactNode = 'Loading Evolution Paths';
  if (evolutionPaths[0].length === 1) content = 'This Pokémon is not part of any evolutions';
  else {
    content = (
      <Fragment>
        {!allImgsLoaded && 'loading images'}
        <ul>
          {evolutionPaths.map((path, index) => {
            totalToLoadCount.current += path.length - 1;
            return (
              <li key={index} style={{ display: allImgsLoaded ? 'block' : 'none' }}>
                {path.map((pokemon) => (
                  <div key={pokemon.name}>
                    {pokemon.name}
                    <img src={pokemon.spriteImgSrc} alt={pokemon.name} onLoad={handleImgLoad} />
                  </div>
                ))}
              </li>
            );
          })}
        </ul>
      </Fragment>
    );
  }

  return <div>{content}</div>;
};

export default PokemonEvolutionPaths;
