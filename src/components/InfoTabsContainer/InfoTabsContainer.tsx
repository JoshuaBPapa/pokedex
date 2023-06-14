import { ReactNode, useState } from 'react';

interface Props {
  config: {
    label: string;
    content: ReactNode;
  }[];
}

const InfoTabsContainer: React.FC<Props> = ({ config }) => {
  const [selectedIndex, setSelectedindex] = useState(0);

  const tabs = config.map((tab, index) => (
    <button key={tab.label} onClick={() => setSelectedindex(index)}>
      {tab.label}
    </button>
  ));

  return (
    <div>
      <div>{tabs}</div>
      {config[selectedIndex].content}
    </div>
  );
};

export default InfoTabsContainer;
