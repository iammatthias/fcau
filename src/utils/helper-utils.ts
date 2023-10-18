import inquirer from 'inquirer'
import * as fs from 'node:fs'
import fetch from 'node-fetch'

interface Data {
  messages: any[]
  nextPageToken: null | string
}

export async function queryApi(username: string): Promise<null | number> {
  const url = `https://nemes.farcaster.xyz:2281/v1/userNameProofByName?name=${username}`
  try {
    const response = await fetch(url)
    const data = (await response.json()) as {fid: number}
    return data.fid || null
  } catch (error) {
    console.error('Fetch failed:', error)
    return null
  }
}

/* eslint-disable no-await-in-loop */
export async function queryMessages(fid: number, filePath: string, pageSize: number) {
  let nextPageToken: null | string = null

  let existingMessages: any[] = []
  const existingHashes = new Set()

  if (fs.existsSync(filePath)) {
    existingMessages = JSON.parse(fs.readFileSync(filePath, 'utf8')).messages || []
    existingMessages.forEach((msg) => existingHashes.add(msg.hash))
  }

  do {
    let url = `https://nemes.farcaster.xyz:2281/v1/castsByFid?reverse=1&pageSize=${pageSize}&fid=${fid}`
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`
    }

    try {
      const response = await fetch(url)
      const data = (await response.json()) as Data
      const newMessages = data.messages

      let allMessagesExisting = true

      for (const message of newMessages) {
        if (!existingHashes.has(message.hash)) {
          existingMessages.push(message)
          existingHashes.add(message.hash)
          allMessagesExisting = false
        }
      }

      if (allMessagesExisting) {
        console.log('All messages in current page exist. Exiting.')
        break
      }

      nextPageToken = data.nextPageToken || null
    } catch (error) {
      console.error('Fetch in queryMessages failed:', error)
      return
    }
  } while (nextPageToken !== null)

  if (existingMessages.length === 0) {
    console.log('No new data added. Exiting.')
    return
  }

  // Sort by timestamp, most recent first
  existingMessages.sort((a, b) => b.data.timestamp - a.data.timestamp)

  fs.writeFileSync(filePath, JSON.stringify({messages: existingMessages}))
  console.log(`All pages have been processed and results written to ${filePath}`)
}

/* eslint-enable no-await-in-loop */

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
  await queryMessages(fid, filePath, pageSize)
}
