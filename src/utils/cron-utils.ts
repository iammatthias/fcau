import {exec} from 'node:child_process'

export const scheduleCronJob = (frequency: string, commandWithFlags: string, taskName: string): void => {
  const cronExpression = getCronExpression(frequency)
  if (cronExpression) {
    if (process.platform === 'win32') {
      // Windows Task Scheduler setup
      exec(`schtasks /create /sc ${frequency} /tn "${taskName}" /tr ${commandWithFlags}`)
    } else {
      // Unix-based (Linux, MacOS) cron setup
      exec(`(crontab -l ; echo "${cronExpression} ${commandWithFlags}") | crontab -`)
    }
  }
  // Handle the 'disable' case here
  else if (process.platform === 'win32') {
    // Windows Task Scheduler setup
    exec(`schtasks /delete /tn "${taskName}" /f`)
  } else {
    // Unix-based (Linux, MacOS) cron setup
    exec(`(crontab -l | grep -v "${commandWithFlags}") | crontab -`)
  }
}

export const getCronExpression = (frequency: string): null | string => {
  switch (frequency) {
    case 'every 1 minute': {
      return '* * * * *'
    }

    case 'every 10 minutes': {
      return '*/10 * * * *'
    }

    case 'every hour': {
      return '0 * * * *'
    }

    case 'every day': {
      return '0 0 * * *'
    }

    case 'disable': {
      return null
    }

    default: {
      return null
    }
  }
}
