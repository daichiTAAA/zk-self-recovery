pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/poseidon.circom";

// When restoring a private key, enter the gmail address and answers to 3 questions
// to create a proof and verify so that the private key can be restored.
// The private key is divided into four parts, encrypted, and stored in separate smart contracts.
// This smart contract is called SCSPK (smart contract to save encrypted private key).
// When generating the proof, the address of this SCSPK and the salt are also used.
// We are considering whether the value of pubSignals should be stored in SCSPK at the time of SCSPK generation,
// and whether pubSignals should be checked for a match at the time of proof verification.

template selfAuth() {
  // Private inputs
  signal input priGmailHash;
  signal input priAnswer1Hash;
  signal input priAnswer2Hash;
  signal input priAnswer3Hash;
  signal input priSCSPKAddressHash;
  signal input priSalt;

  // Output
  signal output hashOut;

  // Create a constraint that the public input salt is equal to the result of salt calculation in circom.
  var poseidonOut;
  component poseidon6 = Poseidon(6);
  poseidon6.inputs[0] <== priGmailHash;
  poseidon6.inputs[1] <== priAnswer1Hash;
  poseidon6.inputs[2] <== priAnswer2Hash;
  poseidon6.inputs[3] <== priAnswer3Hash;
  poseidon6.inputs[4] <== priSCSPKAddressHash;
  poseidon6.inputs[5] <== priSalt;
  poseidonOut = poseidon6.out;

  component poseidon1[10];

  for (var i=0; i<10; i++) {
    poseidon1[i] = Poseidon(1);
    poseidon1[i].inputs[0] <== poseidonOut;
    poseidonOut = poseidon1[i].out;
  }

  hashOut <== poseidonOut;
}

component main = selfAuth();