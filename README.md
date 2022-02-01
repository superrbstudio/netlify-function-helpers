# Netlify Function Helpers

A library of helpers to use when writing Netlify functions.

## `withCors`

A wrapper around the netlify function callback to handle CORS and parse posted data.

#### Usage

```
const { withCors, ValidationError } = require('@superrb/netlify-function-helpers')

exports.handler = withCors((data) => {
  // Throw `ValidationError` to respond with an error message and a 400 status code
  if (!data) {
    throw new ValidationError('Missing data')
  }

  // Throw any other error to respond with the error message and a 500 status code
  try {
    doSomething()
  } catch (err) {
    throw new Error('Something went wrong')
  }

  // Return an object, which will be sent to the client as JSON
  return {
    success: true
  }
})
```