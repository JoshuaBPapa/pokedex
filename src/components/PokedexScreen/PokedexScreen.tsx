import { CSSProperties, ReactNode } from 'react';
import './PokedexScreen.scss';

interface Props {
  children: ReactNode;
  styleProps?: CSSProperties;
}

export const PokedexScreen: React.FC<Props> = ({ children, styleProps }) => {
  return (
    <div className="pokedex-screen" style={styleProps}>
      {children}
    </div>
  );
};
