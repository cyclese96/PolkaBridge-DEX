import {
  Address,
  BigInt,
} from "@graphprotocol/graph-ts"

// Initialize a Token Definition with the attributes
export class TokenDefinition {
  address: Address
  symbol: string
  name: string
  decimals: BigInt

  // Initialize a Token Definition with its attributes
  constructor(address: Address, symbol: string, name: string, decimals: BigInt) {
    this.address = address
    this.symbol = symbol
    this.name = name
    this.decimals = decimals
  }

  // Get all tokens with a static defintion
  static getStaticDefinitions(): Array<TokenDefinition> {
    let staticDefinitions = new Array<TokenDefinition>(6)


    // Add PBR
    let tokenPBR = new TokenDefinition(
      Address.fromString('0xf6c9FF0543f932178262DF8C81A12A3132129b51'),
      'PBR',
      'Polkabridge',
      BigInt.fromI32(9)
    )
    staticDefinitions.push(tokenPBR)

    // Add USDT
    let tokenUSDT = new TokenDefinition(
      Address.fromString('0x117e41ec3ec246873D69BFA5659B8eB209e687d8'),
      'USDT',
      'US Tether',
      BigInt.fromI32(9)
    )
    staticDefinitions.push(tokenUSDT)

    // Add 1INCH
    let token1INCH = new TokenDefinition(
      Address.fromString('0xcc521406C8F796169DCe1D10bDe6AaA60847FB63'),
      '1INCH',
      '1INCH Token',
      BigInt.fromI32(9)
    )
    staticDefinitions.push(token1INCH)

    // Add Weth
    let token1ETH = new TokenDefinition(
      Address.fromString('0xc778417e063141139fce010982780140aa0cd5ab'),
      'ETH',
      'Ethereum',
      BigInt.fromI32(9)
    )
    staticDefinitions.push(token1ETH)

    // Add DGD
    // let tokenDGD = new TokenDefinition(
    //   Address.fromString('0xe0b7927c4af23765cb51314a0e0521a9645f0e2a'),
    //   'DGD',
    //   'DGD',
    //   BigInt.fromI32(9)
    // )
    // staticDefinitions.push(tokenDGD)

    // // Add AAVE
    // let tokenAAVE = new TokenDefinition(
    //   Address.fromString('0x7fc66500c84a76ad7e9c93437bfc5ac33e2ddae9'),
    //   'AAVE',
    //   'Aave Token',
    //   BigInt.fromI32(18)
    // )
    // staticDefinitions.push(tokenAAVE)

    // // Add LIF
    // let tokenLIF = new TokenDefinition(
    //   Address.fromString('0xeb9951021698b42e4399f9cbb6267aa35f82d59d'),
    //   'LIF',
    //   'Lif',
    //   BigInt.fromI32(18)
    // )
    // staticDefinitions.push(tokenLIF)

    // // Add SVD
    // let tokenSVD = new TokenDefinition(
    //   Address.fromString('0xbdeb4b83251fb146687fa19d1c660f99411eefe3'),
    //   'SVD',
    //   'savedroid',
    //   BigInt.fromI32(18)
    // )
    // staticDefinitions.push(tokenSVD)

    // Add TheDAO
    // let tokenTheDAO = new TokenDefinition(
    //   Address.fromString('0xbb9bc244d798123fde783fcc1c72d3bb8c189413'),
    //   'TheDAO',
    //   'TheDAO',
    //   BigInt.fromI32(16)
    // )
    // staticDefinitions.push(tokenTheDAO)

    // // Add HPB
    // let tokenHPB = new TokenDefinition(
    //   Address.fromString('0x38c6a68304cdefb9bec48bbfaaba5c5b47818bb2'),
    //   'HPB',
    //   'HPBCoin',
    //   BigInt.fromI32(18)
    // )
    // staticDefinitions.push(tokenHPB)

    return staticDefinitions
  }

  // Helper for hardcoded tokens
  static fromAddress(tokenAddress: Address): TokenDefinition | null {
    let staticDefinitions = this.getStaticDefinitions()
    let tokenAddressHex = tokenAddress.toHexString()

    // Search the definition using the address
    for (let i = 0; i < staticDefinitions.length; i++) {
      let staticDefinition = staticDefinitions[i]
      if (staticDefinition.address.toHexString() == tokenAddressHex) {
        return staticDefinition
      }
    }

    // If not found, return null
    return null
  }

}