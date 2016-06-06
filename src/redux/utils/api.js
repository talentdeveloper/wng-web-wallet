import { getPublicKey, signBytes } from './cryptoOld'

// const nrsUrl = 'http://otd.sd.otdocs.com:17876'
// const nrsUrl = 'http://localhost:6876'
const nrsUrl = 'http://nrs.scripterron.org:6876'
let apiUrl = 'http://localhost:3001'

if (process.env.API_URL) {
  apiUrl = process.env.API_URL
}

function _parseData (data) {
  if (!data.secretPhrase) return data

  if (typeof data.feeNQT === 'undefined') {
    data.feeNQT = 1e8
  }

  if (typeof data.deadline === 'undefined') {
    data.deadline = 24
  }

  return data
}

function _parseResult (result, textStatus, jqXHR) {
  if (typeof result === 'string') {
    try {
      result = JSON.parse(result)
    } catch (e) {
      return e
    }
  }

  if (result.errorCode || result.errorDescription) {
    return $.Deferred().reject(jqXHR, textStatus, result.errorDescription)
  }
  return result
}

export function post (url, data) {
  return $.ajax({
    type: 'POST',
    url: `${apiUrl}/${url}`,
    data
  }).then(_parseResult)
}

export function get (url, data) {
  return $.ajax({
    type: 'GET',
    url: `${apiUrl}/${url}`,
    data
  }).then(_parseResult)
}

export function sendRequest (requestType, data, async = true) {
  data = _parseData(data)

  // no secretphrase, we can just broadcast
  if (!data.secretPhrase) {
    return $.ajax({
      type: 'POST',
      url: `${nrsUrl}/nxt?requestType=${requestType}`,
      data: data,
      async: async
    }).then(_parseResult)
  }

  // sign transactions locally
  let secretPhrase = data.secretPhrase
  data.secretPhrase = null
  data.publicKey = getPublicKey(secretPhrase)

  return $.ajax({
    type: 'POST',
    url: `${nrsUrl}/nxt?requestType=${requestType}`,
    data: data,
    async: async
  })
  .then(_parseResult)
  .then(function (result) {
    try {
      let unsignedTransactionBytes = data.unsignedTransactionBytes
      let signature = signBytes(unsignedTransactionBytes, secretPhrase)

      return {
        transactionBytes: unsignedTransactionBytes.substr(0, 192) + signature + unsignedTransactionBytes.substr(320),
        prunableAttachmentJSON: JSON.stringify(data.transactionJSON.attachment)
      }
    } catch (e) {
      return false
    }
  })
}