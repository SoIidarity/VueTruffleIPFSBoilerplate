const IPFS = require('ipfs')
const OrbitDB = require('orbit-db')
import store from '../src/store'

function handleError(e) {
    console.error(e.stack)
}


let orbitdb, db

const ipfs = new IPFS({
    // repo: '/orbitdb/examples/browser/new/ipfs/0vcd .27.3',
    // start: true,
    EXPERIMENTAL: {
        pubsub: true,
    },
    config: {
        Addresses: {
            Swarm: [
                // Use IPFS dev signal server
                // '/dns4/star-signal.cloud.ipfs.team/wss/p2p-webrtc-star',
                '/dns4/ws-star.discovery.libp2p.io/tcp/443/wss/p2p-websocket-star',
                // Use local signal server
                // '/ip4/0.0.0.0/tcp/9090/wss/p2p-webrtc-star',
            ]
        },
    }
})
//This implementation uses ORBITDB log. this can be easily changed to other forms, such as document store
// ipfs.on('ready', async () => {
//     orbitdb = new OrbitDB(ipfs)
// })

// const ipfs = new IPFS()
ipfs.on('ready', async () => {
    const orbitdb = new OrbitDB(ipfs)

    const db1 = await orbitdb.keyvalue('first-database')
    await db1.put('name', 'hello')
    await db1.close()

    const db2 = await orbitdb.keyvalue('first-database')
    await db2.load()
    const value = db2.get('name')
    console.log(value)
})

const createDB = async (name) => {
    db = await orbitdb.eventlog(name)
    console.log("DB address")
    console.log(db.address.toString())
}

const loadDB = async (address) => {
    const valudb = await orbitdb.eventlog(address, {sync: true})
    await valudb.load()
    console.log("DB address")
    console.log(valudb.address.toString())
    let allValues = await valudb.iterator({limit: -1}).collect()
    console.log(allValues)
    const all = valudb.iterator({ limit: -1 })
        .collect()
        .map((e) => e.payload.value)
    console.log(all)
    valudb.events.on('replicated', () => console.log("rep!"))
    console.log(valudb.get())
}

const addValueToLog = async (c) => {
    db.add(c)
}

const getValuesFromLog = async (c) => {
    const values = await db.iterator({limit: -1}).collect()
    console.log(values)
    return(values)
}

export {createDB, loadDB, addValueToLog, getValuesFromLog}