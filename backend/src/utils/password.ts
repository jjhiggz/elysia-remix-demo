const encrypt = (password: string) => {
  return [...password].reverse().join("");
};
const compare = (passwordHash: string, compareWith: string) => {
  return encrypt(passwordHash) === compareWith;
};

export const PasswordFns = {
  encrypt,
  compare,
};
