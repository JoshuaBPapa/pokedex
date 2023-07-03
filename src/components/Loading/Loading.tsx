import './Loading.scss';

interface Props {
  message?: string;
}

const Loading: React.FC<Props> = ({ message }) => {
  return (
    <div className="loading-container">
      <div className="pokeball"></div>
      {message && <p className="loading-message">{message}</p>}
    </div>
  );
};

export default Loading;
