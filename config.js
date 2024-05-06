import App from 'resource:///com/github/Aylur/ags/app.js';
import * as Utils from 'resource:///com/github/Aylur/ags/utils.js'

const outdir = '/tmp/ags/js'

try {
    // @ts-ignore
    await Utils.execAsync([
        'bun', 'build', `${App.configDir}/src/main.ts`,
        '--outdir', outdir,
        '--external', 'resource://*',
        '--external', 'gi://*',
    ])
    // @ts-ignore
    await import(`file://${outdir}/main.js`)
} catch (error) {
    // @ts-ignore
    console.error(error)
}