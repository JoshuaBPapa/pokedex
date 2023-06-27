import { ReactNode, useState } from 'react';
import './InfoTabsContainer.scss';

interface Props {
  config: {
    label: string;
    content: ReactNode;
  }[];
}

const InfoTabsContainer: React.FC<Props> = ({ config }) => {
  const [selectedIndex, setSelectedindex] = useState(0);

  const tabs = config.map((tab, index) => (
    <button
      className={`tab-button + ${index === selectedIndex ? 'active' : ''}`}
      key={tab.label}
      onClick={() => setSelectedindex(index)}
    >
      {tab.label}
    </button>
  ));

  return (
    <div className="info-tabs-container">
      <div className="info-tabs">{tabs}</div>
      <div className="info-content">{config[selectedIndex].content}</div>
    </div>
  );
};

export default InfoTabsContainer;
