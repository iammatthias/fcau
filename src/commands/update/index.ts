import {Command} from '@oclif/core'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import {selectFile, updateMessagesForUser} from '../../utils/helper-utils.js'

export default class UpdateCommand extends Command {
  static description =
    'Updates the existing archive of a users messages on the Farcaster protocol. Run the init command first.'

  extractFIDFromFilename(filename: string): null | number {
    const match = filename.match(/fcau_(\d+)\.json/)
    return match ? Number.parseInt(match[1], 10) : null
  }

  async run() {
    const files = fs.readdirSync(os.homedir()).filter((file) => file.startsWith('fcau_') && file.endsWith('.json'))

    if (files.length === 0) {
      this.log('No message files found. Run the init command first.')
      return
    }

    const selectedFile = await selectFile(files)
    const fid = this.extractFIDFromFilename(selectedFile)
    if (fid) {
      await updateMessagesForUser(fid, path.join(os.homedir(), selectedFile))
    }
  }
}
