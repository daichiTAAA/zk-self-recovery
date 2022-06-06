cd contracts/circuits/selfAuth_js

echo "check witness generating process..."

# check witness generating process
snarkjs wtns debug selfAuth.wasm ../../input.json ../../witness.wtns ../selfAuth.sym --trigger -set -get

cd ../../..