import bcrypt from 'bcryptjs';

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(
    password,
    salt
  );
  return hashedPassword;
}

export const comparePassword = async (
  password,
  hashedPassword
) => {
  const isMatch = await bcrypt.compare(
    password,
    hashedPassword
  );
  return isMatch;
};
