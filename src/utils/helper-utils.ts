import inquirer from 'inquirer'
import {exec} from 'node:child_process'

import {scheduleCronJob} from './cron-utils.js'
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

export async function scheduleCronJobForUser(taskName: string): Promise<void> {
  const {cronFrequency} = await inquirer.prompt([
    {
      choices: ['every 1 minute', 'every 10 minutes', 'every hour', 'every day', 'disable'],
      message: 'Select cron frequency:',
      name: 'cronFrequency',
      type: 'list',
    },
  ])

  const {notifyCompletion} = await inquirer.prompt([
    {
      message: 'Do you want to be notified when the job is complete?',
      name: 'notifyCompletion',
      type: 'confirm',
    },
  ])

  let notifyFlag = ''
  if (notifyCompletion) {
    notifyFlag = ' --notify'
  }

  scheduleCronJob(cronFrequency, `fcau update${notifyFlag}`, taskName)
}

export async function updateMessagesForUser(fid: number, filePath: string): Promise<void> {
  await queryMessages(fid, filePath, 100)
  console.log(`Data updated in ${filePath}`)
}

export const checkExistingCronJob = (taskName: string): Promise<boolean> =>
  new Promise((resolve) => {
    if (process.platform === 'win32') {
      // Windows Task Scheduler check
      exec(`schtasks /query /tn "${taskName}"`, (error, stdout) => {
        if (error) {
          resolve(false)
        } else {
          resolve(stdout.includes(taskName))
        }
      })
    } else {
      // Unix-based (Linux, MacOS) cron check
      exec(`crontab -l | grep -c "${taskName}"`, (error, stdout) => {
        if (error) {
          resolve(false)
        } else {
          resolve(Number.parseInt(stdout, 10) > 0)
        }
      })
    }
  })
