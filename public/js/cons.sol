// SPDX-License-Identifier: UNLICENSED
/*
******************************************************************
                 
                 Contract Tropical Sloths

  
******************************************************************
              Developed by Meraj khalid
*/
       

pragma solidity ^0.8.0;


import "https://github.com/chiru-labs/ERC721A/blob/main/contracts/ERC721A.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/cryptography/MerkleProof.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/access/Ownable.sol";
import "https://github.com/OpenZeppelin/openzeppelin-contracts/blob/master/contracts/utils/Strings.sol";

contract Tropical_Sloths is ERC721A, Ownable {
  using Strings for uint256;

  constructor() ERC721A("Tropical Sloths", "NTS")  {}

  string public uriPrefix = "ipfs://QmaZJXP7fkg1qPq5XSRL5zibEdkFnCz7B2VkqY7xwwX5fi/";
  string public uriSuffix = ".json";
  
  uint256 public cost = 0 ether;
  uint256 public WLcost = 0.55 ether;
  uint256 public costPrisma = 1.75 ether;
  uint256 public maxSupply = 12121;
  uint256 public wlSupply = 1221;
  uint256 public maxMintPerTx = 3;
  uint256 public MAxmintWL = 2;
  uint256 public MAxminTPrisma = 1;

  bool public paused = false;
  bool public PublicMintStarted = false;
  bytes32 public merkleRoot;



  modifier mintCompliance(uint256 _mintAmount) {
    require(totalSupply() + _mintAmount <= maxSupply, "Max supply exceeded!");
    require(!paused, "The contract is paused!");
    _;
  }

  function mintPublic(uint256 _mintAmount) public payable mintCompliance(_mintAmount) {
   require(msg.value >= cost * _mintAmount, "Insufficient funds!");
   require(PublicMintStarted, "Public mint is not active");
   require( _mintAmount <= maxMintPerTx , "Exceeds Max mint Per Tx!");

    _safeMint(msg.sender, _mintAmount);
  }

  function mintWl(uint256 _mintAmount, bytes32[] memory _merkleProof) public payable mintCompliance(_mintAmount) {
    require(msg.value >= WLcost * _mintAmount, "Insufficient funds!");
    require(!PublicMintStarted, "The Whitelist sale is ended!");
    require(_numberMinted(msg.sender) + _mintAmount <= MAxmintWL , "Exceeds Per wallet limit!");
    require(totalSupply() + _mintAmount <= wlSupply, "The presale ended!");
    bytes32 leaf = keccak256(abi.encodePacked(msg.sender));
    require(
        MerkleProof.verify(_merkleProof, merkleRoot, leaf),
        "Invalid Merkle Proof."
    );

    _safeMint(msg.sender, _mintAmount);
  }

  function mintPrisma(uint256 _mintAmount) public payable mintCompliance(_mintAmount) {
    require(msg.value >= costPrisma * _mintAmount, "Insufficient funds!");
    require(totalSupply() >= 12000, "Prisma mint is not active");
    require(_mintAmount <= MAxminTPrisma , "Exceeds max Mint Prisma!");

    _safeMint(msg.sender, _mintAmount);
  }
  
  
  function Airdrop(uint256 _mintAmount, address[] memory _receiver) public onlyOwner {
    for (uint256 i = 0; i < _receiver.length; i++) {
      _safeMint(_receiver[i], _mintAmount);
    }
  }

  function tokenURI(uint256 _tokenId) public view virtual override returns (string memory){
    require(_exists(_tokenId),"ERC721Metadata: URI query for nonexistent token");
    string memory currentBaseURI = _baseURI();
    _tokenId = _tokenId+1;
    return bytes(currentBaseURI).length > 0
        ? string(abi.encodePacked(currentBaseURI, _tokenId.toString(), uriSuffix))
        : "";
  }

  function StartPublicSale(bool _state) public onlyOwner {
    PublicMintStarted = _state;
  }

  function setMerkleRoot(bytes32 _merkleRoot) public onlyOwner {
    merkleRoot = _merkleRoot;
  }

  function setPublicCost(uint256 _cost) public onlyOwner {
    cost = _cost;
  }

  
  function setWLcost(uint256 _WLcost) public onlyOwner {
    WLcost = _WLcost;
  }

  function setcostPrisma(uint256 _costPrisma) public onlyOwner {
    costPrisma = _costPrisma;
  }

  function setUriPrefix(string memory _uriPrefix) public onlyOwner {
    uriPrefix = _uriPrefix;
  }

  function setWlSupply(uint256 _wlSupply) public onlyOwner {
    wlSupply = _wlSupply;
  }

  function setPaused(bool _state) public onlyOwner {
    paused = _state;
  }

  function withdraw() public onlyOwner {
    (bool os, ) = payable(owner()).call{value: address(this).balance}("");
    require(os);
  }

  function _baseURI() internal view virtual override returns (string memory) {
    return uriPrefix;
  }
}