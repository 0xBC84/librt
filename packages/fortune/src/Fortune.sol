// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract Fortune {

  constructor() {}

  function fortune() public payable returns(string memory) {
    return "WAGMI";
  }

}
