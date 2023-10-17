import {Command, Flags} from '@oclif/core'
import inquirer from 'inquirer'
import fs from 'node:fs'
import * as os from 'node:os'
import path from 'node:path'

import {checkExistingCronJob, scheduleCronJobForUser, updateMessagesForUser} from '../../utils/helper-utils.js'
import {queryApi} from '../../utils/query-utils.js'

export default class InitCommand extends Command {
  static description = 'Performs an initial archive of a users messages on the Farcaster protocol.'

  static flags = {
    cron: Flags.boolean({char: 'c', description: 'is cron job'}),
    username: Flags.string({char: 'u', description: 'username to query'}),
  }

  async run(): Promise<void> {
    const {flags}: {flags: {cron?: boolean; username?: string}} = await this.parse(InitCommand)
    let {cron: isCron, username} = flags

    if (!username) {
      const response = await inquirer.prompt([{message: 'Enter Farcaster username:', name: 'username', type: 'input'}])
      username = response.username
    }

    if (!username) {
      this.log('Username is required. Please try again.')
      return this.run() // re-run the command
    }

    const fid = await queryApi(username!)
    const taskName = `fcau_update_${fid}`
    const archivePath = path.join(os.homedir(), `fcau_${fid}.json`)

    if (fs.existsSync(archivePath) && fs.readFileSync(archivePath, 'utf8').trim()) {
      const jobExists = await checkExistingCronJob(taskName)
      if (jobExists) {
        await updateMessagesForUser(fid!, archivePath)
        const response = await inquirer.prompt([
          {message: 'Do you want to adjust the schedule?', name: 'adjustSchedule', type: 'confirm'},
        ])
        if (response.adjustSchedule) {
          // Code to adjust the schedule
        }

        return
      }
    }

    if (isCron === undefined) {
      const response = await inquirer.prompt([
        {message: 'Schedule as a cron job?', name: 'scheduleCron', type: 'confirm'},
      ])
      isCron = response.scheduleCron
    }

    if (isCron) {
      // Check if the cron job already exists
      const jobExists = await checkExistingCronJob(taskName)
      if (jobExists) {
        this.log(`A cron job with the name "${taskName}" already exists.`)
        return
      }

      await scheduleCronJobForUser(taskName)
    }

    await updateMessagesForUser(fid!, archivePath)
  }
}
