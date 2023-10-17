import {Command} from '@oclif/core'
import * as fs from 'node:fs'
import * as os from 'node:os'
import * as path from 'node:path'

import {checkExistingCronJob, scheduleCronJobForUser, selectFile} from '../../utils/helper-utils.js'

export default class ScheduleCommand extends Command {
  static description = 'Schedules a cron job to update the archive of a user’s messages on the Farcaster protocol.'

  async run(): Promise<void> {
    const files = fs.readdirSync(os.homedir()).filter((file) => file.startsWith('fcau_') && file.endsWith('.json'))

    if (files.length === 0) {
      this.log('No message files found. Run the init command first.')
      return this.run() // re-run the command
    }

    const selectedFile = await selectFile(files)

    const cronJobName = `fcau_update_${selectedFile}`

    // Check if the cron job already exists
    const jobExists = await checkExistingCronJob(cronJobName)
    if (jobExists) {
      this.log(`A cron job with the name "${cronJobName}" already exists.`)
      return
    }

    if (!fs.existsSync(path.join(os.homedir(), selectedFile))) {
      this.log('The file is missing. Run the init command first.')
      return
    }

    await scheduleCronJobForUser(cronJobName)
  }
}
