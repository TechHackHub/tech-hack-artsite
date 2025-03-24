import bcrtpt from 'bcrypt';

export default class Bcrypt {
  static async hashPassword(password: string): Promise<string> {
    return await bcrtpt.hash(password, 10);
  }

  static async comparePassword(
    plainPassword: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrtpt.compare(plainPassword, hashedPassword);
  }
}
