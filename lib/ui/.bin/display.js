#!/usr/bin/env node

const component = process.argv[2]

if (!component) {
  console.error("component not specified")
  process.exit(0)
}

require("../dist/components/" + component + ".example.js")
