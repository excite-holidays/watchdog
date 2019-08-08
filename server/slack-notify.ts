import got from 'got'

export const slackNotify = (text: string) => {
  got.post(process.env.SLACK_API, {
    body: JSON.stringify({ text })
  })
}
