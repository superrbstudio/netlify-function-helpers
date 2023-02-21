class GoogleRecaptcha {
  static async verify(token, secretKey, minScore = 0.5) {
    const resp = await fetch(
      `https://www.google.com/recaptcha/api/siteverify?secret=${secretKey}&response=${token}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    )
    .then(resp => {
      return resp.json()
    })
    .catch(e => {
      throw new Error(e.message)
    })

    const { success, score } = resp

    if (!success) {
      throw new Error(resp['error-codes'])
    }

    if (score < minScore) {
      throw new Error('Score is too low')
    }

    return success
  }
}

module.exports = GoogleRecaptcha