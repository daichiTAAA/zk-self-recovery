const chai = require('chai');
const path = require('path');
const ethers = require('ethers');
const fs = require('fs');

// reference: https://github.com/iden3/circomlib/blob/master/test/poseidoncircuit.js

const buildPoseidon = require('circomlibjs').buildPoseidon;

const wasm_tester = require('circom_tester').wasm;

const F1Field = require('ffjavascript').F1Field;
const Scalar = require('ffjavascript').Scalar;
exports.p = Scalar.fromString(
  '21888242871839275222246405745257275088548364400416034343698204186575808495617'
);
const Fr = new F1Field(exports.p);

const expect = chai.expect;
const assert = chai.assert;

chai.use(require('chai-as-promised'));

const hashTimes = 10 ** 4;

describe('selfAuth circuit test', function () {
  this.timeout(100000000);

  let poseidon;
  let F;
  let circuit;

  before(async () => {
    poseidon = await buildPoseidon();
    F = poseidon.F;
    circuit = await wasm_tester('contracts/circuits/selfAuth.circom');
    await circuit.loadConstraints();
  });

  it('should match circom pubSignals and local calculation value', async () => {
    // Define a function to hash more than n * 2 times
    const nTimesHashFunction = (n, inputArray) => {
      let _inputArray;
      if (Array.isArray(inputArray)) {
        _inputArray = poseidon([...inputArray]);
      } else {
        _inputArray = ethers.utils.toUtf8Bytes(inputArray);
      }
      for (let i = 0; i < n; i++) {
        _inputArray = ethers.utils.keccak256(_inputArray);
      }
      for (let i = 0; i < n; i++) {
        _inputArray = ethers.utils.sha256(_inputArray);
      }
      return _inputArray;
    };

    // Define a function to calculate circom output(pubSignals)
    const calcPubSignals = (INPUT) => {
      let _poseidonOut;
      _poseidonOut = poseidon(Object.values(INPUT));

      for (let i = 0; i < 10; i++) {
        _poseidonOut = poseidon(_poseidonOut);
      }

      return _poseidonOut;
    };

    const priGmail = '12345@gmail.com';
    const priAnswer1 = 'ABCDEFafasfdasfafdafasdfafasfdasfasf';
    const priAnswer2 = 'GHIJKLfadfadfasdfadfafdafdfad';
    const priAnswer3 = 'MNOPQRfadfasdfafafdafdfadfadsfasdfsa';
    const priSCSPKAddress0 = '0x0000000000000000000000000000000000000000';
    const priSCSPKAddress1 = '0x4b530443A78001F38d96A272f0d5eD3eB0A5328e';
    const priSCSPKAddress2 = '0x881d4032abe4188e2237efcd27ab435e81fc6bb1';
    const priSCSPKAddress3 = '0x5f65f7b609678448494de4c87521cdf6cef1e932';
    const priSCSPKAddress4 = '0x7f268357a8c2552623316e2562d90e642bb538e5';

    const inputs = [priGmail, priAnswer1, priAnswer2, priAnswer3];
    const SCSPKAddresses = [
      priSCSPKAddress0,
      priSCSPKAddress1,
      priSCSPKAddress2,
      priSCSPKAddress3,
      priSCSPKAddress4,
    ];

    const priGmailHash = nTimesHashFunction(hashTimes, inputs[0]);
    const priAnswer1Hash = nTimesHashFunction(hashTimes, inputs[1]);
    const priAnswer2Hash = nTimesHashFunction(hashTimes, inputs[2]);
    const priAnswer3Hash = nTimesHashFunction(hashTimes, inputs[3]);
    const priSCSPKAddress0Hash = nTimesHashFunction(
      hashTimes,
      SCSPKAddresses[0]
    );
    const priSCSPKAddress1Hash = nTimesHashFunction(
      hashTimes,
      SCSPKAddresses[1]
    );
    const priSCSPKAddress2Hash = nTimesHashFunction(
      hashTimes,
      SCSPKAddresses[2]
    );
    const priSCSPKAddress3Hash = nTimesHashFunction(
      hashTimes,
      SCSPKAddresses[3]
    );
    const priSCSPKAddress4Hash = nTimesHashFunction(
      hashTimes,
      SCSPKAddresses[4]
    );

    const saltInputArray = [
      priGmailHash,
      priAnswer1Hash,
      priAnswer2Hash,
      priAnswer3Hash,
    ];

    const priSalt = nTimesHashFunction(hashTimes, saltInputArray);

    //The n-1st SCSPKAddresses[n-1] are used in the calculation of pubSingnals in the constructor when generating the nth SCSPK. When generating the first SCSPK, SCSPKAddresses[0] is calculated as '0x0000000000000000000000000000000000000000'.

    //pubSignals for SCSPK1

    let INPUT1 = {
      priGmailHash,
      priAnswer1Hash,
      priAnswer2Hash,
      priAnswer3Hash,
      priSCSPKAddressHash: priSCSPKAddress0Hash,
      priSalt,
    };

    console.log('INPUT1 is: ', INPUT1);

    const circuitWitness1 = await circuit.calculateWitness(INPUT1, true);

    console.log('circuitOutput1 is : ', circuitWitness1[1]);

    // const jsonObject = JSON.stringify(circuitWitness1);

    // fs.writeFileSync('./escape/selfAuth-test-witness.json', jsonObject);

    const calcPubSignalsResult = calcPubSignals(INPUT1);

    console.log('calcPubSignalsResult is: ', F.toString(calcPubSignalsResult));

    await circuit.assertOut(circuitWitness1, {
      hashOut: F.toObject(calcPubSignalsResult),
    });
    await circuit.checkConstraints(circuitWitness1);

    //pubSignals for SCSPK2

    let INPUT2 = {
      priGmailHash,
      priAnswer1Hash,
      priAnswer2Hash,
      priAnswer3Hash,
      priSCSPKAddressHash: priSCSPKAddress1Hash,
      priSalt,
    };

    console.log('INPUT2 is: ', INPUT2);

    const circuitWitness2 = await circuit.calculateWitness(INPUT2, true);

    console.log('circuitOutput1 is : ', circuitWitness2[1]);

    const calcPubSignalsResult2 = calcPubSignals(INPUT2);

    console.log(
      'calcPubSignalsResult2 is: ',
      F.toString(calcPubSignalsResult2)
    );

    await circuit.assertOut(circuitWitness2, {
      hashOut: F.toObject(calcPubSignalsResult2),
    });
    await circuit.checkConstraints(circuitWitness2);

    //pubSignals for SCSPK3

    let INPUT3 = {
      priGmailHash,
      priAnswer1Hash,
      priAnswer2Hash,
      priAnswer3Hash,
      priSCSPKAddressHash: priSCSPKAddress2Hash,
      priSalt,
    };

    console.log('INPUT3 is: ', INPUT3);

    const circuitWitness3 = await circuit.calculateWitness(INPUT3, true);

    console.log('circuitOutput3 is : ', circuitWitness3[1]);

    const calcPubSignalsResult3 = calcPubSignals(INPUT3);

    console.log(
      'calcPubSignalsResult3 is: ',
      F.toString(calcPubSignalsResult3)
    );

    await circuit.assertOut(circuitWitness3, {
      hashOut: F.toObject(calcPubSignalsResult3),
    });
    await circuit.checkConstraints(circuitWitness3);

    //pubSignals for SCSPK4

    let INPUT4 = {
      priGmailHash,
      priAnswer1Hash,
      priAnswer2Hash,
      priAnswer3Hash,
      priSCSPKAddressHash: priSCSPKAddress3Hash,
      priSalt,
    };

    console.log('INPUT1 is: ', INPUT1);

    const circuitWitness4 = await circuit.calculateWitness(INPUT4, true);

    console.log('circuitOutput4 is : ', circuitWitness4[1]);

    const calcPubSignalsResult4 = calcPubSignals(INPUT4);

    console.log(
      'calcPubSignalsResult4 is: ',
      F.toString(calcPubSignalsResult4)
    );

    await circuit.assertOut(circuitWitness4, {
      hashOut: F.toObject(calcPubSignalsResult4),
    });
    await circuit.checkConstraints(circuitWitness4);
  });
});
