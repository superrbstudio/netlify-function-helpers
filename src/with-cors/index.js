const ValidationError = require("../errors/validation-error")

const DEFAULT_OPTIONS = {
  contentType: "application/json",
  allowOrigin: "*",
  allowMethods: "POST",
  allowHeaders: "Content-Type",
}

module.exports = (callback, providedOptions = {}) => {
  const options = {
    ...DEFAULT_OPTIONS,
    ...providedOptions,
  }

  const responseHeaders = {
    "Content-Type": options.contentType,
    "Access-Control-Allow-Origin": options.allowOrigin,
    "Access-Control-Allow-Methods": options.allowMethods,
    "Access-Control-Allow-Headers": options.allowHeaders,
  }

  const preflight = {
    statusCode: 204,
    headers: responseHeaders,
    body: "",
  }

  const respond = (response, status = 200, opts = {}) => {
    const { headers, ...rest } = opts
    return {
      statusCode: status,
      body: JSON.stringify(response),
      headers: {
        ...responseHeaders,
        ...headers,
      },
      ...rest,
    }
  }

  return async (event, context) => {
    if (event.httpMethod === "OPTIONS") {
      return preflight
    }

    if (event.httpMethod !== "POST") {
      return respond("Method not allowed", 405)
    }

    let incoming
    try {
      incoming = JSON.parse(event.body)
    } catch (err) {
      return respond(err.toString(), 400)
    }

    try {
      const response = await callback(incoming)

      return respond(response)
    } catch (err) {
      if (err instanceof ValidationError) {
        return respond(err.toString(), err.statusCode || 400)
      }

      if (err instanceof Error) {
        return respond(err.toString(), 500)
      }

      return respond("Server Error", 500)
    }
  }
}
