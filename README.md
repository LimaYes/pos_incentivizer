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

And this is how it looks
```bash
INFO  started POS incentivization engine
INFO  Your account ID:	16931417076965841821
INFO  Your account:	NXT-J8WX-622A-E4TH-GU5YP
INFO  Your public key:	4526edf3d1a4f787a2537f610ed542c5852e1e70bb97f8a3c566615f0c00222e
DEBUG Fetching the blockchain's current height ...
INFO  Detected a new block on the blockchain: ID = 6992151992373956096
DEBUG preparing to send a transaction with 0.2 XEL fee
DEBUG Finished signing transaction, we will try to broadcast it now
INFO  Finished broadcasting transaction: 41a01ffdeb1f82774944d5c777f3ffdfe17dc19d67622dff5eda92c1e93a62cd (8611480535910293569)
INFO  Blockchain is still at block 6992151992373956096 ... retrying later
INFO  Detected a new block on the blockchain: ID = 14894348027630937623
DEBUG preparing to send a transaction with 0.2 XEL fee
DEBUG Finished signing transaction, we will try to broadcast it now
INFO  Finished broadcasting transaction: 42171f3708febac3b30b3b37e7673a955e8e1741975cc0c305fa4b0cc10171d4 (14103864494302107458)
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Blockchain is still at block 14894348027630937623 ... retrying later
INFO  Detected a new block on the blockchain: ID = 9742514067103454122
DEBUG preparing to send a transaction with 0.2 XEL fee
DEBUG Finished signing transaction, we will try to broadcast it now
INFO  Finished broadcasting transaction: 1d58aad7ddd4c58050a6dd8652ab610bccb2c8a0f66947826b3c03abdd6d0d11 (9279056656537901085)
INFO  Blockchain is still at block 9742514067103454122 ... retrying later
INFO  Blockchain is still at block 9742514067103454122 ... retrying later
```
