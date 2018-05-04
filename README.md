If you want to create a whole bunch of fees on the network in order to make it more attractive to run a POS staking node,
just clone this repository and do

```bash
git clone https://github.com/OrdinaryDude/pos_incentivizer
cd pos_incentivizer
```

Then edit ```pos.js``` to add a passphrase to an account with a few XEL in it. Also configure the node's ip address and the fees you are willing to spend:

```javascript
// ONLY EDIT THIS: BEGIN
const account_secret_phrase = "YOUR PASSPHRASE";
const public_node_ip = "127.0.0.1";
const testnet = false;
const port = ((testnet)?16876:17876)
const send_how_much_fee = 20000000; // 100000000 = 0.1 XEL FEE
const rpcurl = 'http://' + public_node_ip + ":" + port + "/nxt";
const send_on_first_start = true; // Send a transaction immediately or wait for the first block change (true = immediately)
// ONLY EDIT THIS: END
```

And run it:
```bash
node pos.js
```

Evey block, it will generate a transaction to yourself spending ```send_how_much_fee``` fees (in the example above, 0.2 XEL).
This might incentivize people to run a few POS nodes.

Important, do not use an account with more XEL that you are willing to lose. While I think this is bug free, I cannot guarantee it.
