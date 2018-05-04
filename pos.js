const https = require('http');
const BigInteger = require("big-integer");
const xel = require('nxtjs');
const querystring = require('querystring');
const logger = require('node-color-log');
const setting = {
    bold: true,
    dim: true,
    underscore: true,
    reverse: true,
    italic: true,
    strikethrough: true
}

// ONLY EDIT THIS: BEGIN
const account_secret_phrase = "YOURPASSPHRASEMUSTGOHERE";
const public_node_ip = "127.0.0.1";
const testnet = false;
const port = ((testnet)?16876:17876)
const send_how_much_fee = 20000000; // 100000000 = 0.1 XEL FEE
const rpcurl = 'http://' + public_node_ip + ":" + port + "/nxt";
const send_on_first_start = true; // Send a transaction immediately or wait for the first block change (true = immediately)
// ONLY EDIT THIS: END

var initialBlock = 0;

logger.info(" started POS incentivization engine")
var acc = xel.secretPhraseToAccountId(account_secret_phrase);
var apubkey = xel.secretPhraseToPublicKey(account_secret_phrase);
var aid = xel.rsConvert(acc)["account"];
var acc_rs = xel.rsConvert(acc)["accountRS"].replace("XEL","NXT");
logger.info(" Your account ID:\t" + aid);
logger.info(" Your account:\t" + acc_rs);
logger.info(" Your public key:\t" + apubkey);


const postRequest = function(command, postData) {
    return new Promise((resolve, reject) => {
        var post_options = {
            host: public_node_ip,
            port: port,
            path: '/nxt?requestType=' + command,
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Content-Length': Buffer.byteLength(postData)
            }
        };
        const request = https.request(post_options, (response) => {
            if (response.statusCode < 200 || response.statusCode > 299) {
                reject(new Error('Failed to load page, status code: ' + response.statusCode));
            }
            const body = [];
            response.on('data', (chunk) => {
                body.push(chunk)
            });
            response.on('end', () => resolve(JSON.parse(body.join(''))));
        });
        request.on('error', (err) => reject(err));
        request.write(postData);
        request.end();
    })
};

function checkNewBlock(){
    return new Promise((resolve) => {
        https.get(rpcurl + "?requestType=getState", (resp) => {
              let data = '';
              resp.on('data', (chunk) => {
                data += chunk;
              });
              resp.on('end', () => {
                    var resp = JSON.parse(data);
                    if ("lastBlock" in resp){
                        if(resp["lastBlock"]!=initialBlock){
                            logger.info(" Detected a new block on the blockchain: ID = " + resp["lastBlock"]);
                            
                            if((initialBlock==0 && send_on_first_start) || (initialBlock!=0)){
                                initialBlock = resp["lastBlock"];
                                logger.debug("preparing to send a transaction with " + (send_how_much_fee/100000000) + " XEL fee");
                                sendTransactionToMyself().then(function(){
                                    resolve();
                                });
                            }
                        }else{
                            logger.info(" Blockchain is still at block " + resp["lastBlock"] + " ... retrying later");
                            resolve();
                        }

                    }
                    else if("errorDescription" in resp){
                        logger.error("Connection troubles: " + resp["errorDescription"]);
                        resolve();
                    }
                    else {
                        logger.error("Connection troubles: unknown error");
                        resolve();
                    }
              });
            }).on("error", (err) => {
                logger.error("Connection troubles: " + err);
                resolve();
            });
    });
}

function sendTransactionToMyself(){
    var myPromise = new Promise(function(resolve){
        var postData = 'publicKey=' +  apubkey + '&recipient=' + aid + "&deadline=1400&account=" + aid + "&amountNQT=100000000&feeNQT=" + send_how_much_fee;
        postRequest("sendMoney",postData).then(function(resp) {
                if ("errorDescription" in resp) {
                    logger.error("Failed to construct unsigned transaction: " + resp["errorDescription"]);
                    resolve();
                } else if ("unsignedTransactionBytes" in resp) {
                    var ub = resp["unsignedTransactionBytes"];
                    var stx = xel.signTransactionBytes(ub, account_secret_phrase);
                    logger.debug("Finished signing transaction, we will try to broadcast it now");
                    postRequest("sendTransaction","transactionBytes=" + stx).then(function(resp) {
                        if("fullHash" in resp){
                            logger.info(" Finished broadcasting transaction: " + resp["fullHash"] + " (" + resp["transaction"] + ")");
                        }else if ("errorDescription" in resp) {
                            logger.error("Failed to broadcast: " + resp["errorDescription"]);
                        }else{
                            logger.error("Failed to broadcast: unknown error");
                        }
                        resolve();
                    });
                } else {
                    logger.error("Failed to construct unsigned transaction: server returned something we can't understand");
                    resolve();
                }
        }, function(err) {
                logger.error("Failed to construct unsigned transaction: " + err);
                resolve();
        });
       
    });
    return myPromise;
}

function mainLoop(){
   checkNewBlock().then(function(res){
    // check back in 30 seconds
    setTimeout(mainLoop, 30000, 'funky');
}) 
}

logger.debug("Fetching the blockchain's current height ...");
mainLoop();

