import { ethers } from 'ethers';

class InvalidHexString extends Error {}

export const validateHexString = (str) => {
  if (!ethers.utils.isHexString(str)) {
    throw new InvalidHexString(`Expected a valid hexstring, got: ${str}`);
  }

  return str;
};
