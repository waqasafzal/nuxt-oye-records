export default async function ({ isServer, apolloProvider }) {
  if (isServer) {
    const ensureReady = apolloProvider.collect({
      waitForLoaded: false
    })
    console.log('Call ensureReady!')
    ensureReady().then(results => {
      console.log(results.length, 'queries ready')
    })
    await ensureReady()
  }
}
