import config from 'config';
import bcrypt from 'bcrypt';

export default async function getHashPass(pass: string) {
  const saltWorkFactor = config.get<number>('saltWorkFactor');
  const salt = await bcrypt.genSalt(saltWorkFactor);
  const hash = bcrypt.hashSync(pass, salt);

  return hash;
}
