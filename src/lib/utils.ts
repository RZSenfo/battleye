
import * as crypto from 'crypto'
import * as fs from 'fs'
import * as path from 'path'

export const hashAddress = (ip: string, port: number): string => crypto.createHash('md5').update(`${ip}:${port}`).digest('hex')

export interface IBEConfig {
  rconpassword?: string,
  rconport?: number,
  rconip?: string,
  maxping?: number,
}

export const readCfg = async (bepath: string): Promise<IBEConfig> => {
  const beServer = path.join(bepath, 'BEServer.cfg')
  const beServerX64 = path.join(bepath, 'BEServer_x64.cfg')

  let file = beServer
  if (!fs.existsSync(beServer)) {
    if (!fs.existsSync(beServerX64)) {
      throw new Error('Could not find BEServer or BEServer_x64')
    }
    file = beServerX64
  }

  const data = (await fs.promises.readFile(file))?.toString()

  if (!data) {
    throw new Error('No data found in cfg!')
  }

  const config: IBEConfig = {}
  const regex = /([a-z]\w*) (.*)/gmi
  let matches
  while ((matches = regex.exec(data.toString())) !== null) {
    const [match1, match2] = matches
    switch (match1.toLowerCase()) {
      case 'rconpassword':
        config.rconpassword = match2
        break
      case 'rconport':
        config.rconport = parseInt(match2, 10)
        break
      case 'rconip':
        config.rconip = match2
        break
      case 'maxping':
        config.maxping = parseInt(match2, 10)
        break
    }
  }
  return config
}
