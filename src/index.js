'use strict'

module.exports = function () {
  return function velocity (tree) {
    const noscript = {
      tag: 'noscript',
      content: []
    }
    const isDislpayedProp = function (prop) {
      return typeof prop === 'string' || Boolean(prop)
    }

    let head

    tree.walk((node) => {
      if (!node.tag) {
        return node
      }

      if (node.tag === 'head') {
        head = node
        return node
      }

      if (!node.attrs) {
        return node
      }

      const { src, href, rel, onload } = node.attrs

      if (node.tag === 'script' && src && !isDislpayedProp(node.attrs.async)) {
        const link = {
          tag: 'link',
          attrs: {
            rel: 'preload',
            href: src,
            as: 'script'
          }
        }

        if (head) {
          head.content.push(link)
        } else {
          tree.unshift(link)
        }
      }

      if (node.tag === 'link' && rel === 'stylesheet' && href) {
        noscript.content.push(tree.render(node, tree.options))
        node.attrs.as = 'style'
        node.attrs.rel = 'preload'
        node.attrs.onload = 'this.rel=\'stylesheet\'' + (onload ? ';' + onload : '')
      }

      return node
    })

    if (noscript.content.length) {
      head
        ? head.content.push(noscript)
        : tree.push(noscript)
    }

    return tree
  }
}

// vim: shiftwidth=2
