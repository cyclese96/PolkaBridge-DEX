/* eslint-disable prefer-const */
import { log, BigInt, BigDecimal, Address, ethereum } from '@graphprotocol/graph-ts'
import { ERC20 } from '../../generated/Factory/ERC20'
import { ERC20SymbolBytes } from '../../generated/Factory/ERC20SymbolBytes'
import { ERC20NameBytes } from '../../generated/Factory/ERC20NameBytes'
// import { Bundle, Token, Pair } from '../../generated/schema'
import { Factory as FactoryContract } from '../../generated/templates/Pair/Factory'
// import { TokenDefinition } from './tokenDefinition'

export const ADDRESS_ZERO = "0x0000000000000000000000000000000000000000"
export const FACTORY_ADDRESS = "0xA1853078D1447C0060c71a672E6D13882f61A0a6"

export let ZERO_BI = BigInt.fromI32(0)
export let ONE_BI = BigInt.fromI32(1)
export let ZERO_BD = BigDecimal.fromString('0')
export let ONE_BD = BigDecimal.fromString('1')
export let BI_18 = BigInt.fromI32(18)

export let factoryContract = FactoryContract.bind(Address.fromString(FACTORY_ADDRESS))

// rebass tokens, dont count in tracked volume
export let UNTRACKED_PAIRS: string[] = []

export function exponentToBigDecimal(decimals: BigInt): BigDecimal {
  let bd = BigDecimal.fromString('1')
  for (let i = ZERO_BI; i.lt(decimals as BigInt); i = i.plus(ONE_BI)) {
    bd = bd.times(BigDecimal.fromString('10'))
  }
  return bd
}

export function bigDecimalExp18(): BigDecimal {
  return BigDecimal.fromString('1000000000000000000')
}

export function convertEthToDecimal(eth: BigInt): BigDecimal {
  return eth.toBigDecimal().div(exponentToBigDecimal(BI_18))
}

export function convertTokenToDecimal(tokenAmount: BigInt, exchangeDecimals: BigInt): BigDecimal {
  if (exchangeDecimals == ZERO_BI) {
    return tokenAmount.toBigDecimal()
  }
  return tokenAmount.toBigDecimal().div(exponentToBigDecimal(exchangeDecimals))
}

export function equalToZero(value: BigDecimal): boolean {
  const formattedVal = parseFloat(value.toString())
  const zero = parseFloat(ZERO_BD.toString())
  if (zero == formattedVal) {
    return true
  }
  return false
}

export function isNullEthValue(value: string): boolean {
  return value == "0x0000000000000000000000000000000000000000000000000000000000000001"
}

export function fetchTokenSymbol(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);
  let contractSymbolBytes = ERC20SymbolBytes.bind(tokenAddress);

  let symbolValue = "unknown";
  let symbolResult = contract.try_symbol();
  if (symbolResult.reverted) {
    let symbolResultBytes = contractSymbolBytes.try_symbol();
    if (!symbolResultBytes.reverted) {
      if (!isNullEthValue(symbolResultBytes.value.toHex())) {
        symbolValue = symbolResultBytes.value.toString();
      }
    }
  } else {
    symbolValue = symbolResult.value;
  }
  return symbolValue;
}

export function fetchTokenName(tokenAddress: Address): string {
  let contract = ERC20.bind(tokenAddress);
  let contractNameBytes = ERC20NameBytes.bind(tokenAddress);

  let nameValue = "unknown";
  let nameResult = contract.try_name();
  if (nameResult.reverted) {
    let nameResultBytes = contractNameBytes.try_name();
    if (!nameResultBytes.reverted) {
      if (!isNullEthValue(nameResultBytes.value.toHex())) {
        nameValue = nameResultBytes.value.toString();
      }
    }
  } else {
    nameValue = nameResult.value;
  }
  return nameValue;
}

export function fetchTokenDecimals(tokenAddress: Address): BigInt {
  let contract = ERC20.bind(tokenAddress);
  let decimalValue = null;
  let decimalResult = contract.try_decimals();
  if (!decimalResult.reverted) {
    decimalValue = decimalResult.value;
  }
  return BigInt.fromI32(decimalValue as i32);
}

// export function createLiquidityPosition(exchange: Address, user: Address): LiquidityPosition {
//   let id = exchange
//     .toHexString()
//     .concat('-')
//     .concat(user.toHexString())
//   let liquidityTokenBalance = LiquidityPosition.load(id)
//   if (liquidityTokenBalance === null) {
//     let pair = Pair.load(exchange.toHexString())
//     pair.liquidityProviderCount = pair.liquidityProviderCount.plus(ONE_BI)
//     liquidityTokenBalance = new LiquidityPosition(id)
//     liquidityTokenBalance.liquidityTokenBalance = ZERO_BD
//     liquidityTokenBalance.pair = exchange.toHexString()
//     liquidityTokenBalance.user = user.toHexString()
//     liquidityTokenBalance.save()
//     pair.save()
//   }
//   if (liquidityTokenBalance === null) log.error('LiquidityTokenBalance is null', [id])
//   return liquidityTokenBalance as LiquidityPosition
// }

// export function createUser(address: Address): void {
//   let user = User.load(address.toHexString())
//   if (user === null) {
//     user = new User(address.toHexString())
//     user.usdSwapped = ZERO_BD
//     user.save()
//   }
// }

// export function createLiquiditySnapshot(position: LiquidityPosition, event: ethereum.Event): void {
//   let timestamp = event.block.timestamp.toI32()
//   let bundle = Bundle.load('1')
//   let pair = Pair.load(position.pair)
//   let token0 = Token.load(pair.token0)
//   let token1 = Token.load(pair.token1)

//   // create new snapshot
//   let snapshot = new LiquidityPositionSnapshot(position.id.concat(timestamp.toString()))
//   snapshot.liquidityPosition = position.id
//   snapshot.timestamp = timestamp
//   snapshot.block = event.block.number.toI32()
//   snapshot.user = position.user
//   snapshot.pair = position.pair
//   snapshot.token0PriceUSD = token0.derivedETH.times(bundle.ethPrice)
//   snapshot.token1PriceUSD = token1.derivedETH.times(bundle.ethPrice)
//   snapshot.reserve0 = pair.reserve0
//   snapshot.reserve1 = pair.reserve1
//   snapshot.reserveUSD = pair.reserveUSD
//   snapshot.liquidityTokenTotalSupply = pair.totalSupply
//   snapshot.liquidityTokenBalance = position.liquidityTokenBalance
//   snapshot.liquidityPosition = position.id
//   snapshot.save()
//   position.save()
// }
