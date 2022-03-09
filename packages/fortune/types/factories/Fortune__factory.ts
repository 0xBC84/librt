/* Autogenerated file. Do not edit manually. */
/* tslint:disable */
/* eslint-disable */
import { Signer, utils, Contract, ContractFactory, Overrides } from "ethers";
import { Provider, TransactionRequest } from "@ethersproject/providers";
import type { Fortune, FortuneInterface } from "../Fortune";

const _abi = [
  {
    inputs: [],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "fortune",
    outputs: [
      {
        internalType: "string",
        name: "",
        type: "string",
      },
    ],
    stateMutability: "payable",
    type: "function",
  },
];

const _bytecode =
  "0x608060405234801561001057600080fd5b5061016f806100206000396000f3fe60806040526004361061001e5760003560e01c8063177de89c14610023575b600080fd5b61002b610041565b6040516100389190610117565b60405180910390f35b60606040518060400160405280600581526020017f5741474d49000000000000000000000000000000000000000000000000000000815250905090565b600081519050919050565b600082825260208201905092915050565b60005b838110156100b857808201518184015260208101905061009d565b838111156100c7576000848401525b50505050565b6000601f19601f8301169050919050565b60006100e98261007e565b6100f38185610089565b935061010381856020860161009a565b61010c816100cd565b840191505092915050565b6000602082019050818103600083015261013181846100de565b90509291505056fea2646970667358221220208489210c0dfc142c2d031bfd7a9a74ead45f111ba5c2669fff4be3950b613964736f6c63430008090033";

type FortuneConstructorParams =
  | [signer?: Signer]
  | ConstructorParameters<typeof ContractFactory>;

const isSuperArgs = (
  xs: FortuneConstructorParams
): xs is ConstructorParameters<typeof ContractFactory> => xs.length > 1;

export class Fortune__factory extends ContractFactory {
  constructor(...args: FortuneConstructorParams) {
    if (isSuperArgs(args)) {
      super(...args);
    } else {
      super(_abi, _bytecode, args[0]);
    }
    this.contractName = "Fortune";
  }

  deploy(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): Promise<Fortune> {
    return super.deploy(overrides || {}) as Promise<Fortune>;
  }
  getDeployTransaction(
    overrides?: Overrides & { from?: string | Promise<string> }
  ): TransactionRequest {
    return super.getDeployTransaction(overrides || {});
  }
  attach(address: string): Fortune {
    return super.attach(address) as Fortune;
  }
  connect(signer: Signer): Fortune__factory {
    return super.connect(signer) as Fortune__factory;
  }
  static readonly contractName: "Fortune";
  public readonly contractName: "Fortune";
  static readonly bytecode = _bytecode;
  static readonly abi = _abi;
  static createInterface(): FortuneInterface {
    return new utils.Interface(_abi) as FortuneInterface;
  }
  static connect(
    address: string,
    signerOrProvider: Signer | Provider
  ): Fortune {
    return new Contract(address, _abi, signerOrProvider) as Fortune;
  }
}
