import { Barretenberg, Fr } from "@aztec/bb.js";
import { toBeHex, zeroPadValue } from "ethers";
import {
  MerkleMountainRange as MMR,
  LevelDB,
  Poseidon2Hasher,
} from "proofbridge-mmr";
import fs from "fs";

async function run() {
  const bb = await Barretenberg.new();

  if (fs.existsSync("./test-db")) {
    fs.rmSync("./test-db", { recursive: true, force: true });
  }

  const db = new LevelDB("./test-db");
  await db.init();

  const hasher = new Poseidon2Hasher();
  const mmr = new MMR("test-mmr", db, hasher);

  let lastElem = 0;
  let lastOrderHash = Fr.ZERO;
  for (let i = 0; i < 20; i++) {
    let x = hex(i);
    let hash = await bb.poseidon2Hash([Fr.fromString(x)]);
    const elementIndex = await mmr.append(hash.toString());
    console.log(elementIndex);

    if (elementIndex == 17) {
      lastElem = elementIndex;
      lastOrderHash = hash;
    }
  }

  const proof = await mmr.getMerkleProof(lastElem);

  const root = mmr.getHexRoot();

  console.log("root: ", root);

  console.log("orderHash: ", lastOrderHash.toString());

  console.log(proof);

  console.log(
    mmr.verify(
      proof.root,
      proof.width,
      lastElem,
      lastOrderHash.toString(),
      proof.peaks,
      proof.siblings
    )
  );

  // mmr.clear();
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
