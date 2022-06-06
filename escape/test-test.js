const { groth16 } = require('snarkjs');

INPUT1 = {
  priGmailHash:
    '0xab8853e93ca93a09bbe4e40b0200c1f456888c6e7405aa72f2982066f188c0c544088d7c71e5fdda7ef12ac98c34292f88331324934654dc165d2b4cdea0ab5d',
  priAnswer1Hash:
    '0xbdd745216b57afe2e5ca1d1a669953f96300efbbdc242fa58833c032e0889c3e33cba21b8f40ed936c3d46fed4d4f9fe6eabaf7410d374f7f4df27c90985fdbb',
  priAnswer2Hash:
    '0x9c199420189377164d7d6a2def5e6f501f542fa439eedabf1526c6c0b09dcfc10417fc0a8c7b7db09bbbac380e8d7be2b45eaaf733f7fa1ee926001ffae61d72',
  priAnswer3Hash:
    '0x0b28330c00bccfa45446fde65873402180f541e7be7698674301dcc68754520211e0ef265096e27168d29a06f9fc326e78320e02b104eef6975f641f179c7b95',
  priSCSPKAddressHash:
    '0x36cacfd5cff0c9ffd8b1c23868bbea84ea7cedb6e380046c0ef524f517719bd96665e1b57094fd9a026d84eb8ff70e5110efa6150d73963e5fce28386ca5ee6e',
  priSalt:
    '0x2ea782ad3ddbae7b8b8d91322efb177e6ad54c4474979b5463d779dc10dcd78139d82d814c2bed2eac177f30bf8e31ea38c6179505378c8a4a1416cafc269798',
};

async function test() {
  const { proof, publicSignals } = await groth16.fullProve(
    INPUT1,
    './contracts/circuits/selfAuth_js/selfAuth.wasm',
    './contracts/circuits/circuit_final.zkey'
  );
  console.log('publicSignals is: ', publicSignals);
  console.log('proof is: ', proof);

  return;
}

test();
