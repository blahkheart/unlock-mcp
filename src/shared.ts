import { ethers } from "ethers";

export const CHAINS = {
  8453: { name: "Base", short: "base-mainnet" },
  84532: { name: "Base-Sepolia", short: "base-sepolia" },
};

export function rpc(chainId: 8453 | 84532): string {
  const { short } = CHAINS[chainId];
  if (process.env.INFURA_API_KEY) {
    return `https://${short}.infura.io/v3/${process.env.INFURA_API_KEY}`;
  }
  if (process.env.ALCHEMY_API_KEY) {
    return `https://${short}.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
  }
  throw new Error("Provide INFURA_API_KEY or ALCHEMY_API_KEY");
}