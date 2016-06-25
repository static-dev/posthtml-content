// ------------------------------------
// #POSTHTML - CONTENT - TEST
// ------------------------------------

const test = require('ava')

const { join } = require('path')
const { readFileSync } = require('fs')

const posthtml = require('posthtml')
const plugin = require('..')

const fixtures = (file) => readFileSync(join(__dirname, 'fixtures', file))

test('1 - Text', (t) => {
  const html = fixtures('txt.html')
  const plugins = [ plugin({ txt: () => 'Lorem' }) ]

  posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => {
      t.regex(/<p>Lorem<\/p>/, html)
    })
})

test('2 - Text Lorem', (t) => {
  const html = fixtures('txt.lorem.html')
  const plugins = [ plugin({
    txt: () => `Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
    eiusmodtempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim
    veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea
    commodo consequat. Duis aute irure dolor in reprehenderit in voluptate
    velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
    cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id
    est laborum.`
  }) ]

  posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => {
      t.regex(/<aritcle>Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.<\/article>/, html)
    })
})

test('3 - Markdown', (t) => {
  const html = fixtures('md.html')

  const markdown = require('markdown-it')()

  const plugins = [ plugin({
    md: (ctx) => markdown.renderInline(ctx)
  }) ]

  posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => {
      console.log(html)
      t.regex(/<p><strong>Markdown<\/strong><\/p><article>Markdown is an <strong>easy<\/strong> to <em>learn<\/em> and <em>write<\/em> language.If you want to learn more about it checkout the following link: <a href="https:\/\/github.com\/markdown-it\/markdown-it">Markdown<\/a><\/article>/, html)
    })
})

test('4 - PostCSS', (t) => {
  const html = fixtures('style.html')

  const postcss = require('postcss')([ require('postcss-nested')() ])
  const options = { map: false }

  const plugins = [ plugin({
    style: (ctx) => postcss.process(ctx, options).css
  }) ]

  posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => {
      console.log(html)
      t.regex(/<style>.test {text-transform: uppercase;}.test__hello {color: red}.test__world {color: blue;}<\/style>/, html)
    })
})

test('5 - Babel', (t) => {
  const html = fixtures('script.html')

  const babel = require('babel-core')
  const options = { presets: ['es2015'], compact: false, sourceMaps: false }

  const plugins = [ plugin({
    script: (ctx) => babel.transform(ctx, options).code
  }) ]

  posthtml(plugins)
    .process(html)
    .then((result) => result.html)
    .then((html) => {
      console.log(html)
      t.regex(/<script>'use strict';var hello = 'Hello!';var person = {greeting: function greeting(txt) {console.log(text);}};person.greeting(hello);<\script>/, html)
    })
})
