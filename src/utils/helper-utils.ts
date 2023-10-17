import * as fs from 'node:fs'
import inquirer from 'inquirer'
import {exec} from 'node:child_process'

import {queryMessages} from './query-utils.js'

export async function selectFile(files: string[]): Promise<string> {
  const {selectedFile} = await inquirer.prompt([
    {
      choices: files,
      message: 'Select a file:',
      name: 'selectedFile',
      type: 'list',
    },
  ])
  return selectedFile
}

export async function updateMessagesForUser(fid: number, filePath: string, pageSize: number): Promise<void> {
  const data = await queryMessages(fid, filePath, pageSize)

  if (data !== undefined) {
    // Write the data to the file
    fs.writeFileSync(filePath, JSON.stringify(data))
    console.log(`Data updated in ${filePath}`)
  } else {
    console.log('There was an error talking to the hub. Please try again later.')
  }
}
