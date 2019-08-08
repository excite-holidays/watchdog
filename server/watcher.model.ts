import { Worker } from "./worker";

export interface Watcher {
  id: string
  enable: boolean
  name: string
  url: string
  basicAuth?: string
  interval: number
  timeout: number
  healthKey: string
  healthValue: string
  versionKey: string

  worker?: Worker
  groupName?: string
}
