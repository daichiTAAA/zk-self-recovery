#!/bin/bash

cd contracts/circuits

if [ -f ./powersOfTau28_hez_final_13.ptau ]; then
    echo "powersOfTau28_hez_final_13.ptau already exists. Skipping."
else
    echo 'Downloading powersOfTau28_hez_final_13.ptau'
    wget https://hermez.s3-eu-west-1.amazonaws.com/powersOfTau28_hez_final_13.ptau
fi

echo "Compiling selfAuth.circom..."

# compile circuit

circom selfAuth.circom --r1cs --wasm --sym -o .
snarkjs r1cs info selfAuth.r1cs

# Start a new zkey and make a contribution

snarkjs groth16 setup selfAuth.r1cs powersOfTau28_hez_final_13.ptau circuit_0000.zkey
snarkjs zkey contribute circuit_0000.zkey circuit_final.zkey --name="1st Contributor Name" -v -e="random text"
snarkjs zkey export verificationkey circuit_final.zkey verification_key.json

# generate solidity contract
snarkjs zkey export solidityverifier circuit_final.zkey ../verifier.sol

cd ../..