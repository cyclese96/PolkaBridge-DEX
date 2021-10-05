import Decimal from "decimal.js-light"
import { Numeral } from "numeral"


export const formatNumber = (num) => {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,')
}

// using a currency library here in case we want to add more in future
export const formatDollarAmount = (num, digits) => {
    const formatter = new Intl.NumberFormat([], {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: digits,
        maximumFractionDigits: digits,
    })
    return formatter.format(num)
}

export const toSignificant = (number, significantDigits) => {
    Decimal.set({ precision: significantDigits + 1, rounding: Decimal.ROUND_UP })
    const updated = new Decimal(number).toSignificantDigits(significantDigits)
    return updated.toFormat(updated.decimalPlaces(), { groupSeparator: '' })
}


export const toK = (num) => {
    return Numeral(num).format('0.[00]a')
}

export const formattedNum = (number, usd = false, acceptNegatives = false) => {
    if (isNaN(number) || number === '' || number === undefined) {
        return usd ? '$0' : 0
    }
    let num = parseFloat(number)

    if (num > 500000000) {
        return (usd ? '$' : '') + toK(num.toFixed(0), true)
    }

    if (num === 0) {
        if (usd) {
            return '$0'
        }
        return 0
    }

    if (num < 0.0001 && num > 0) {
        return usd ? '< $0.0001' : '< 0.0001'
    }

    if (num > 1000) {
        return usd ? formatDollarAmount(num, 0) : Number(parseFloat(num).toFixed(0)).toLocaleString()
    }

    if (usd) {
        if (num < 0.1) {
            return formatDollarAmount(num, 4)
        } else {
            return formatDollarAmount(num, 2)
        }
    }

    return Number(parseFloat(num).toFixed(4)).toString()
}