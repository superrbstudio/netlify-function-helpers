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

## Google Recaptcha

You can use Google Recaptcha. You will need keys from https://www.google.com/recaptcha/about/

#### Usage

Using the example above use the following snippet to validate with recaptcha.

You will need to send the recaptcha token with the form information and extract it first, how you do this depends on your front end set up.

```
// validate recaptcha
try {
  await GoogleRecaptcha.verify(recaptchaToken, process.env.RECAPTCHA_SECRET_KEY, process.env.RECAPTCHA_MINSCORE)
} catch (error) {
  throw new ValidationError(error.toString(), 400)
}
```