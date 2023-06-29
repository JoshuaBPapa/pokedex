import { CustomError } from '../classes';
import { Serialiser } from '../interfaces';

export const fetchHandler = (
  response: Promise<Response>,
  serialiser?: Serialiser
): Promise<Response> => {
  return response
    .then((res) => {
      if (res.status >= 400) {
        throw new CustomError(res.status, res.statusText);
      }
      return res.json();
    })
    .then((resJson) => {
      return serialiser ? serialiser(resJson) : resJson;
    });
};
