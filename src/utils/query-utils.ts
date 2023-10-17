import * as fs from 'node:fs'
import fetch from 'node-fetch'

interface Message {
  hash: string
  timestamp: number
}

interface Data {
  messages: Message[]
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

export async function queryMessages(fid: number, filePath: string, pageSize: number) {
  let nextPageToken: null | string = null
  let allMessages: Message[] = []

  while (nextPageToken !== null) {
    let url = `https://nemes.farcaster.xyz:2281/v1/castsByFid?reverse=1&pageSize=${pageSize}&fid=${fid}`
    if (nextPageToken) {
      url += `&pageToken=${nextPageToken}`
    }

    // eslint-disable-next-line no-await-in-loop
    const response = await fetch(url)
    // eslint-disable-next-line no-await-in-loop
    const data = (await response.json()) as Data

    allMessages = [...allMessages, ...data.messages]
    nextPageToken = data.nextPageToken || null
  }

  let existingMessages: Message[] = []

  if (fs.existsSync(filePath)) {
    existingMessages = JSON.parse(fs.readFileSync(filePath, 'utf8')).messages || []
  }

  const newMessages = allMessages.filter(
    (message: Message) => !existingMessages.some((existing: Message) => existing.hash === message.hash),
  )

  const combinedMessages = [...newMessages, ...existingMessages].sort((a, b) => b.timestamp - a.timestamp)
  const combinedData = {messages: combinedMessages}

  fs.writeFileSync(filePath, JSON.stringify(combinedData))
}
