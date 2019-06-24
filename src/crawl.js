import { tree } from './util'
import fs from 'fs-extra'

for (let file of tree('./')) {
  fs.writeFileSync(file, fs.readFileSync(file).toString().replace(/const (.+) = require\((.+)\)(\r\n|\r|\n)/g, 'import $1 from $2\n'))
}