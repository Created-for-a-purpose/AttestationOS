// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract Cam {
    mapping(address => bytes32) public userAuthMap;
    mapping(bytes32 => bytes) public imageUidMap;
    mapping(bytes32 => uint256) public attestationScore;
    mapping(bytes32 => mapping(address=>uint256)) public attestations;
    bytes32[] public images;
    address ATTESTOR;

    constructor() {
        ATTESTOR = msg.sender;
    }

    modifier onlyAttestor() {
        require(msg.sender == ATTESTOR, "Not attestor");
        _;
    }

    function keccak(uint256 auth) public pure returns (bytes32) {
        return keccak256(abi.encodePacked(auth));
    }

    function setAuth(bytes32 hash, address user) external onlyAttestor {
        userAuthMap[user] = hash;
    }

    function post(bytes32 image, uint256 authCode, bytes memory uid) external {
        bytes32 hash = keccak(authCode);
        require(hash == userAuthMap[msg.sender], "authcode invalid");
        images.push(image);
        imageUidMap[image] = uid;
        attestationScore[image] = 1000;
    }

    function post_without_attestation(bytes32 image) external {
        images.push(image);
    }

    function attest(bytes32 image, bytes memory uid) external {
        imageUidMap[image] = uid;
        uint256 num = attestations[image][msg.sender];
        if(num == 0) attestationScore[image] += 10;
        else {
            attestationScore[image] = attestationScore[image] + (100 - (num*10))/10;
        }
        attestations[image][msg.sender] += 1;
    }
}