import cloneDeep from 'lodash.clonedeep';
import { EvoPath, NameUrlPairing } from '../interfaces';

interface EvoNode {
  evolution_details: [];
  evolves_to: EvoNode[];
  is_baby: boolean;
  species: NameUrlPairing;
}

interface EvoChainRes {
  id: number;
  chain: EvoNode;
}

export const serialiseEvolutionTree = (evoChainRes: EvoChainRes): EvoPath[][] => {
  let evolutionPaths: EvoPath[][] = [];
  const buildEvolutionPath = (node: EvoNode, path: EvoPath[], pathLength: number) => {
    if (!node) return;
    const { name, url } = node.species;
    const splitUrl = url.split('/');
    const pokemonId = splitUrl[splitUrl.length - 2];
    const spriteImgSrc = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${pokemonId}.png`;

    path[pathLength] = { name, spriteImgSrc };
    pathLength++;

    if (!node.evolves_to.length) {
      const newEvolutionPaths = [...cloneDeep(evolutionPaths), cloneDeep(path)];
      evolutionPaths = newEvolutionPaths;
    } else {
      node.evolves_to.forEach((childNode) => {
        buildEvolutionPath(childNode, path, pathLength);
      });
    }
  };
  buildEvolutionPath(evoChainRes.chain, [], 0);

  return evolutionPaths;
};
