const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
import store from '../src/store'

function handleError(e) {
    console.error(e.stack)
}


let orbitdb, db

const ipfs = new IPFS({
    EXPERIMENTAL: {
        pubsub: true
    }
})
//This implementation uses IPFS log. this can be easily changed to other forms, such as document store
ipfs.on('ready', async () => {
    orbitdb = new OrbitDB(ipfs)
    db = await orbitdb.eventlog('SampleLogDB')

    console.log("DB address")
    console.log(db.address.toString())

})

const addValueToLog = async (c) => {
    db.add(c)
}

const getValuesFromLog = async (c) => {
    return db.iterator({ limit: 5 }).collect()
}

export {addValueToLog, getValuesFromLog}