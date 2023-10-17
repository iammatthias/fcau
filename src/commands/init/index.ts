import {Command, Flags} from '@oclif/core'
import inquirer from 'inquirer'
import * as os from 'node:os'
import path from 'node:path'

import {queryApi, updateMessagesForUser} from '../../utils/helper-utils.js'

export default class InitCommand extends Command {
  static description = 'Performs an initial archive of a users messages on the Farcaster protocol.'

  static flags = {
    username: Flags.string({char: 'u', description: 'username to query'}),
  }

  async run(): Promise<void> {
    const {flags}: {flags: {username?: string}} = await this.parse(InitCommand)
    let {username} = flags

    if (!username) {
      const response = await inquirer.prompt([{message: 'Enter Farcaster username:', name: 'username', type: 'input'}])
      username = response.username
    }

    if (!username) {
      this.log('Username is required. Please try again.')
      return this.run() // re-run the command
    }

    const fid = await queryApi(username!)
    const archivePath = path.join(os.homedir(), `fcau_${fid}.json`)

    await updateMessagesForUser(fid!, archivePath, 1000)
  }
}
