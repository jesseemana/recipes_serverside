import { randomInt } from 'crypto';

const randomCode = (): string => {
  const code = randomInt(1000000000);
  const now = Date.now();
  return `${code}_${now}`;
}

export default randomCode;
