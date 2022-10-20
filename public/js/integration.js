const Web3Modal = window.Web3Modal.default;
const WalletConnectProvider = window.WalletConnectProvider.default;

let web3Modal, hash_proof, provider, web3, contract, user_address, checkInterval

let publicMint = false
let mint_count;
var mintCost; // Change cost here
let test_httpProvider = "https://goerli.infura.io/v3/c0db0b85222f4f5c82dd2bed1fc843f9"
let main_httpProvider = "https://mainnet.infura.io/v3/c0db0b85222f4f5c82dd2bed1fc843f9"
var chainId = 1; // should be 5 for georli and 1 for mainnet

var t_address = "0x2eEF0fBd9cD1D3A1D509B5f7a32B2a3045248473" // testnet
// var t_address = "0xa51b708cd0dee2058c2b75bcf22c71741ff303b1"
var t_abi = [{ "inputs": [], "stateMutability": "nonpayable", "type": "constructor" }, { "inputs": [], "name": "ApprovalCallerNotOwnerNorApproved", "type": "error" }, { "inputs": [], "name": "ApprovalQueryForNonexistentToken", "type": "error" }, { "inputs": [], "name": "BalanceQueryForZeroAddress", "type": "error" }, { "inputs": [], "name": "MintERC2309QuantityExceedsLimit", "type": "error" }, { "inputs": [], "name": "MintToZeroAddress", "type": "error" }, { "inputs": [], "name": "MintZeroQuantity", "type": "error" }, { "inputs": [], "name": "OwnerQueryForNonexistentToken", "type": "error" }, { "inputs": [], "name": "OwnershipNotInitializedForExtraData", "type": "error" }, { "inputs": [], "name": "TransferCallerNotOwnerNorApproved", "type": "error" }, { "inputs": [], "name": "TransferFromIncorrectOwner", "type": "error" }, { "inputs": [], "name": "TransferToNonERC721ReceiverImplementer", "type": "error" }, { "inputs": [], "name": "TransferToZeroAddress", "type": "error" }, { "inputs": [], "name": "URIQueryForNonexistentToken", "type": "error" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "approved", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Approval", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "owner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "operator", "type": "address" }, { "indexed": false, "internalType": "bool", "name": "approved", "type": "bool" }], "name": "ApprovalForAll", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "uint256", "name": "fromTokenId", "type": "uint256" }, { "indexed": false, "internalType": "uint256", "name": "toTokenId", "type": "uint256" }, { "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }], "name": "ConsecutiveTransfer", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "previousOwner", "type": "address" }, { "indexed": true, "internalType": "address", "name": "newOwner", "type": "address" }], "name": "OwnershipTransferred", "type": "event" }, { "anonymous": false, "inputs": [{ "indexed": true, "internalType": "address", "name": "from", "type": "address" }, { "indexed": true, "internalType": "address", "name": "to", "type": "address" }, { "indexed": true, "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "Transfer", "type": "event" }, { "inputs": [{ "internalType": "uint256", "name": "_mintAmount", "type": "uint256" }, { "internalType": "address[]", "name": "_receiver", "type": "address[]" }], "name": "Airdrop", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "MAxminTPrisma", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "PublicMintStarted", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_state", "type": "bool" }], "name": "StartPublicSale", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "approve", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }], "name": "balanceOf", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "cost", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "costPrisma", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_mintAmount", "type": "uint256" }, { "internalType": "address", "name": "_to", "type": "address" }], "name": "crossmint_Public", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "getApproved", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "hiddenMetadataUri", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "owner", "type": "address" }, { "internalType": "address", "name": "operator", "type": "address" }], "name": "isApprovedForAll", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxMintPerTx", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "maxSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "merkleRoot", "outputs": [{ "internalType": "bytes32", "name": "", "type": "bytes32" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_mintAmount", "type": "uint256" }], "name": "mintPrisma", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_mintAmount", "type": "uint256" }], "name": "mintPublic", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_mintAmount", "type": "uint256" }, { "internalType": "bytes32[]", "name": "_merkleProof", "type": "bytes32[]" }], "name": "mintWL", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [], "name": "name", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "owner", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "ownerOf", "outputs": [{ "internalType": "address", "name": "", "type": "address" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "renounceOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "revealed", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }, { "internalType": "bytes", "name": "_data", "type": "bytes" }], "name": "safeTransferFrom", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "operator", "type": "address" }, { "internalType": "bool", "name": "approved", "type": "bool" }], "name": "setApprovalForAll", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes32", "name": "_merkleRoot", "type": "bytes32" }], "name": "setMerkleRoot", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_cost", "type": "uint256" }], "name": "setPublicCost", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bool", "name": "_state", "type": "bool" }], "name": "setRevealed", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "string", "name": "_uriPrefix", "type": "string" }], "name": "setUriPrefix", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_wlSupply", "type": "uint256" }], "name": "setWlSupply", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_costPrisma", "type": "uint256" }], "name": "setcostPrisma", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [{ "internalType": "bytes4", "name": "interfaceId", "type": "bytes4" }], "name": "supportsInterface", "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "symbol", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "uint256", "name": "_tokenId", "type": "uint256" }], "name": "tokenURI", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "totalSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "from", "type": "address" }, { "internalType": "address", "name": "to", "type": "address" }, { "internalType": "uint256", "name": "tokenId", "type": "uint256" }], "name": "transferFrom", "outputs": [], "stateMutability": "payable", "type": "function" }, { "inputs": [{ "internalType": "address", "name": "newOwner", "type": "address" }], "name": "transferOwnership", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "uriPrefix", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "uriSuffix", "outputs": [{ "internalType": "string", "name": "", "type": "string" }], "stateMutability": "view", "type": "function" }, { "inputs": [], "name": "withdraw", "outputs": [], "stateMutability": "nonpayable", "type": "function" }, { "inputs": [], "name": "wlSupply", "outputs": [{ "internalType": "uint256", "name": "", "type": "uint256" }], "stateMutability": "view", "type": "function" }]

function init() {

    const providerOptions = {
        walletconnect: {
            package: WalletConnectProvider,
            options: {
                infuraId: "c0db0b85222f4f5c82dd2bed1fc843f9",
            }
        }
    };

    web3Modal = new Web3Modal({
        cacheProvider: false,
        providerOptions,
    });

}

function truncateString(str, length) {
    return str.length > length ? str.substring(0, length - 1) + '.....' : str
}

async function updateSupply() {
    await contract.methods.maxSupply().call().then(function (res, err) {
        if (res) {
            $('#maxSupply').html(res)
        }
    });
    await contract.methods.totalSupply().call().then(async function (res, err) {
        if (res) {
            // Prisma Activation
            if (parseInt(res) > 5) {

                publicMint = 'prisma'

                await contract.methods.costPrisma().call().then(function (res, err) {
                    if (res) {
                        mintCost = parseFloat(web3.utils.fromWei(res, 'ether'))
                        $('#mintCost').html(mintCost);
                    }
                });
                await contract.methods.MAxminTPrisma().call().then(function (res, err) {
                    if (res) {
                        $('#max_count').html(res)
                    }
                });
            }
            $('#totalSupply').html(res)
        }
    });
    $("#box-total-count").show()
}

async function updateCost(publicMint) {
    await contract.methods.cost().call().then(function (res, err) {
        if (res) {
            mintCost = parseFloat(web3.utils.fromWei(res, 'ether'))
            $('#mintCost').html(mintCost);
        }
    });
}

async function setting_interval() {
    checkInterval = setInterval(async () => {
        hash_proof = $('#hash_proof').text()
        if (hash_proof !== '') {
            hash_proof = hash_proof.split(',')
            // console.log(hash_proof)
            clearInterval(checkInterval)
            // Raise Minting
            mint_count = parseInt($('#mint_count').text());
            await WLMint(mintCost * mint_count, mint_count, hash_proof)
        }
    }, 500);
}

async function updateMintType() {
    await contract.methods.PublicMintStarted().call().then(function (res, err) {
        if (res === true) {
            publicMint = true
        } else if (res === false) {
            publicMint = false
        }
    });
}

async function updateMaxCount() {
    await contract.methods.maxMintPerTx().call().then(function (res, err) {
        if (res) {
            // resetting the values of MAXCOUNT & MINTCOUNT
            $('#max_count').html(res)
        }
    });
}

function after_mint(res) {
    if (res) {
        alert("MINTED SUCCESSFULLY!")
    } else {
        alert("MINTING FAILED!")
    }
}

async function WLMint(final_cost, mint_count, hash_proof) {
    var final_wei_Val = (final_cost * Math.pow(10, 18)).toFixedSpecial(0)
    await contract.methods.mintWL(String(mint_count), hash_proof)
        .send({
            from: user_address,
            value: final_wei_Val
        }).then(function (res, err) {
            after_mint(res)
        });
}

async function PrismaMint(final_cost, mint_count) {
    var final_wei_Val = (final_cost * Math.pow(10, 18)).toFixedSpecial(0)
    await contract.methods.mintPrisma(String(mint_count))
        .send({
            from: user_address,
            value: final_wei_Val
        }).then(function (res, err) {
            after_mint(res)
        });
}

async function public_Mint(final_cost, mint_count) {
    var final_wei_Val = (final_cost * Math.pow(10, 18)).toFixedSpecial(0)
    await contract.methods.mintPublic(String(mint_count))
        .send({
            from: user_address,
            value: final_wei_Val
        }).then(function (res, err) {
            after_mint(res)
        });

}

async function switch_network(chainId) {
    await window.ethereum.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: web3.utils.toHex(chainId) }]
    });
}

async function do_it_Asside() {

    $('#connect_btn').html('....')

    $('#connect_btn').html('Connected : ' + truncateString(String(user_address), 10));
}

function check() {

    web3.eth.getAccounts().then(async (tx) => {
        if (tx[0] !== undefined) {
            user_address = tx[0]

            // $('#user_address').html('0x1f9E9d8420387D6B8e74d71468Ae17b693ec537f')
            $('#user_address').html(user_address)

            web3.eth.net.getId().then(async (netId) => {
                if (netId === chainId) {

                    await do_it_Asside()

                    if (publicMint === true) {
                        $('#publicMintBtn').removeClass("hidden");
                        $('#publicMintBtn').click(async () => {
                            mint_count = parseInt($('#mint_count').text());
                            await public_Mint(mintCost * mint_count, mint_count)
                        })
                    } else if (publicMint === false) {
                        $('#WLmintBtn').removeClass("hidden");
                        await setting_interval();
                        setTimeout(() => {
                            $('#WLmintBtn').on('click', async () => {
                                mint_count = parseInt($('#mint_count').text());
                                await WLMint(mintCost * mint_count, mint_count, hash_proof)
                            });
                        }, 2000);
                    } else if (publicMint === 'prisma') {
                        $('#publicMintBtn').removeClass("hidden");
                        $('#publicMintBtn').click(async () => {
                            mint_count = parseInt($('#mint_count').text());
                            await PrismaMint(mintCost * mint_count, mint_count)
                        })
                    }

                } else {

                    await switch_network(chainId)


                    switch (chainId) {
                        case 1:
                            alert("Connect to ETH mainnet");
                            break;
                        case 4:
                            alert("Connect to Rinkeby");
                            break;
                    }



                }
            });
        }
    });
}

async function connectweb3() {
    try {
        provider = await web3Modal.connect();
        web3 = new Web3(provider);
        contract = new web3.eth.Contract(t_abi, t_address);
        check()
    } catch (e) {
        console.log("Could not get a wallet connection", e);
        return;
    }

    provider.on("accountsChanged", (accounts) => {
        location.reload();
    });

    provider.on("chainChanged", (chainId) => {
        location.reload();
    });

    provider.on("networkChanged", (networkId) => {
        location.reload();
    });

}

$(document).ready(async () => {
    init();

    web3 = new Web3(new Web3.providers.HttpProvider(main_httpProvider));
    contract = new web3.eth.Contract(t_abi, t_address);

    await updateMintType()

    await updateMaxCount();

    await updateCost(publicMint);

    await updateSupply();

    $('#connect_btn').click(async () => { await connectweb3(); })
});



Number.prototype.toFixedSpecial = function (n) {
    var str = this.toFixed(n);
    if (str.indexOf("e+") === -1) return str;

    str = str
        .replace(".", "")
        .split("e+")
        .reduce(function (p, b) {
            return p + Array(b - p.length + 2).join(0);
        });

    if (n > 0) str += "." + Array(n + 1).join(0);

    return str;
};