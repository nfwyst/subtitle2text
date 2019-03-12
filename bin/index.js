const fs = require('fs')
const path = require('path')

  ; (() => {
    const getParameter = (process) => {
      return process.argv.slice(2)
    }

    const getFilename = ([filename]) => {
      return filename
    }

    const buildPath = (process) => {
      return (pathlib) => {
        return (filename) => {
          return pathlib.join(process.cwd(), filename);
        }
      }
    }

    const readFile = (fs) => {
      return (filename) => {
        return (write) => {
          return (cb) => {
            try {
              return fs.readFile(filename, (err, data) => {
                if (!err) {
                  return cb(data)(filename)(write)
                }
                return cb(err)(filename)(write)
              })
            } catch (err) {
              return cb(err)(filename)(write)
            }
          }
        }
      }
    }

    const write = (fs) => {
      return (result) => {
        return (filename) => {
          const nameArr = filename.split('/')
          const { [nameArr.length - 1]: last } = nameArr;
          const name = last.split('.').map((item, index) => {
            if (index === 0) return item + 'Extracted'
            return item
          }).join('.')
          const destPath = nameArr.slice(0, -1).concat(name).join('/')
          return (cb) => {
            fs.writeFile(destPath, result, (err) => {
              if (err) {
                return cb(err)
              }
              return cb(true)
            })
          }
        }
      }
    }


    const handler = (buffer) => {
      return (filename) => {
        return (writer) => {
          if (buffer instanceof Error) return console.error(
            `${buffer.message}`
          )
          const text = buffer.toString('utf-8')
          const parsedText = text.split(/\r?\n/g)
          const result = parsedText.map((item, index) => {
            if ((index + 1) % 4 === 3) {
              return item
            }
            return null
          }).filter(item => !!item).join('\n')
          return writer(result)(filename)((err) => {
            if (err) console.error(err.message)
          });
        }
      }
    }

    readFile(fs)(
      buildPath(process)(path)(
        getFilename(
          getParameter(process)
        )
      )
    )(
      write(fs)
    )(handler)
  })();
