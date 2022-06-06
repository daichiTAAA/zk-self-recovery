cd contracts/circuits/selfAuth_js

echo "Genarate witness..."

# generate witness
node generate_witness.js selfAuth.wasm ../../input.json ../../witness.wtns

cd ../../..