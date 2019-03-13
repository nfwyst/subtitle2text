#!/usr/bin/env node

const fs = require('fs')
const path = require('path')

  ; (() => {
    const getParameter = (process) => {
      return process.argv.slice(2)
    }

    const getFilename = ([filename]) => {
      if (!filename) return new Error('please provide a file to extract...');
      return filename
    }

    const buildPath = (process) => {
      return (pathlib) => {
        return (filename) => {
          if (filename instanceof Error) {
            return filename
          }
          return pathlib.join(process.cwd(), filename);
        }
      }
    }

    const readFile = (fs) => {
      return (filename) => {
        return (write) => {
          return (cb) => {
            if (filename instanceof Error) return console.error(filename.message)
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
          const [first, second, ...other] = text.split(/\r?\n/g)
          const isVtt = first.trim() === 'WEBVTT'
          let parsedText = [first, second, ...other]
          if (isVtt) {
            parsedText = [second, ...other]
          }
          const result = parsedText
            .filter(item => !!item)
            .map(item => item.trim())
            .filter(
              text => !/^\d+$/.test(text) && !/^\d+\S+\s+-->\s+\S+\d+$/.test(text)
            ).join('\n')
          return writer(result)(filename)((err) => {
            if (err) console.info(err === true ? 'finished' : 'break down')
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
