/* eslint-disable no-var */

// mocking TextEncoder/TextDecoder
const { TextEncoder, TextDecoder } = require('util')

global.TextEncoder = TextEncoder
global.TextDecoder = TextDecoder
