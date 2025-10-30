import { Barretenberg, Fr } from "@aztec/bb.js";
import { toBeHex, zeroPadValue } from "ethers";
import {
  MerkleMountainRange as MMR,
  LevelDB,
  Poseidon2Hasher,
} from "proofbridge-mmr";

async function run() {
  const bb = await Barretenberg.new();

  const db = new LevelDB("./test-mmr-data");
  await db.init();

  const hasher = new Poseidon2Hasher();
  const mmr = new MMR("test-mmr", db, hasher);

  let lastElem = 0;
  let lastOrderHash = Fr.ZERO;
  for (let i = 0; i < 100000; i++) {
    let x = hex(i);
    let hash = await bb.poseidon2Hash([Fr.fromString(x)]);
    // console.log(hash.toString());
    const elementIndex = await mmr.append(hash.toString());
    if (elementIndex == 88929) {
      lastElem = elementIndex;
      lastOrderHash = hash;
    }
  }

  const proof = await mmr.getMerkleProof(lastElem);

  console.log(proof);

  const root = mmr.root;
  console.log("root: ", root);

  console.log(
    mmr.verify(
      proof.root,
      proof.width,
      lastElem,
      lastOrderHash.toString(),
      proof.peakBagging,
      proof.siblings
    )
  );
}

const hex = (n: number) => {
  return zeroPadValue(toBeHex(n), 32);
};

(async () => {
  run()
    .then(() => {
      process.exit(0);
    })
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });
})();
