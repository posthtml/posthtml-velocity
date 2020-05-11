'use strict'

const test = require('ava')
const plugin = require('..')
const { readFileSync } = require('fs')
const path = require('path')
const posthtml = require('posthtml')
const fixtures = path.join(__dirname, 'fixtures')

test('preload', (t) => {
  return compare(t, 'preload')
})

function compare (t, name) {
  const html = readFileSync(path.join(fixtures, `${name}.html`), 'utf8')
  const expected = readFileSync(path.join(fixtures, `${name}.expected.html`), 'utf8')

  return posthtml([plugin()])
    .process(html)
    .then((res) => {
      return t.truthy(res.html === expected)
    })
}

// vim: shiftwidth=2
