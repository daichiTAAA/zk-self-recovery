const snarkjs = require('snarkjs');
const fs = require('fs');

const INPUT = {
  priGmailHash:
    '0xc72b429cab47b6cbe1504fc70d7be8fcf9531a67b661780e1494e8b683b3f311',
  priAnswer1Hash:
    '0x5ec6006e00903bd654f9971946c72b5cc8d386eb9a2c276f6f0dad7bb33df23a',
  priAnswer2Hash:
    '0xc4cb4240125983950a6998743e37785e25e4838f4eaeb7d9135475d47777a49d',
  priAnswer3Hash:
    '0x37d2e5150d9b44f46ff06683a2eb6f5cdb8c9dc02cb1cc7dda7cd03f27be617e',
  priSCSPKAddressHash:
    '0xcc639912531c7b4119573bbfd9cad4c488167cd8d3fc49cf8913ca6f57b45476',
  priSalt: '0x5c1002d8eaa844c4ec1f937927ca026ff3c1104061ddbbdb38c2fb222a9f4bd3',
};

async function run() {
  const { proof, publicSignals } = await snarkjs.groth16.fullProve(
    INPUT,
    './contracts/circuits/selfAuth_js/selfAuth.wasm',
    './contracts/circuits/circuit_final.zkey'
  );

  // console.log('Proof: ');
  // console.log(JSON.stringify(proof, null, 1));
  console.log('publicSignals is: ', publicSignals);

  const vKey = JSON.parse(
    fs.readFileSync('./contracts/circuits/verification_key.json')
  );

  const res = await snarkjs.groth16.verify(vKey, publicSignals, proof);

  if (res === true) {
    console.log('Verification OK');
  } else {
    console.log('Invalid proof');
  }
}

run().then(() => {
  process.exit(0);
});
