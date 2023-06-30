import informationMessageImg from '../../imgs/message-imgs/information-message.png';
import instructionMessageImg from '../../imgs/message-imgs/instruction-message.png';
import errorMessageImg from '../../imgs/message-imgs/error-message.png';
import './Message.scss';

interface Props {
  message: string;
  messageType: 'error' | 'instruction' | 'information';
}

const Message: React.FC<Props> = ({ message, messageType }) => {
  let messageImgSrc = informationMessageImg;
  switch (messageType) {
    case 'error':
      messageImgSrc = errorMessageImg;
      break;

    case 'information':
      messageImgSrc = informationMessageImg;
      break;

    case 'instruction':
      messageImgSrc = instructionMessageImg;
      break;

    default:
      messageImgSrc = informationMessageImg;
      break;
  }

  return (
    <div className="message">
      <img src={messageImgSrc} alt={`${messageType} message`} />
      <p>{message}</p>
    </div>
  );
};

export default Message;
