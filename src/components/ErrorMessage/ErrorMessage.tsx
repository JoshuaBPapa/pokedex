import { CustomError } from '../../classes';
import Message from '../Message/Message';

interface Props {
  error: CustomError;
}

const ErrorMessage: React.FC<Props> = ({ error }) => {
  const status = error.status + ': ' || null;
  const message = error.message || 'Something went wrong. Please refresh and try again';

  return <Message message={status + message} messageType="error" />;
};

export default ErrorMessage;
