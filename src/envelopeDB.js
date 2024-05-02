import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue, remove } from 'firebase/database'

const appSettings = {
  databaseURL: 'https://envelope-8551e-default-rtdb.firebaseio.com/',
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsDB = ref(database, 'items')

export const saveItem = (itemData) => {
  return push(itemsDB, itemData)
}

export const refreshItems = (callback) => {
  onValue(itemsDB, (snapshot) => {
    if (snapshot.exists()) {
      const itemsArray = Object.entries(snapshot.val())
      const finalArray = itemsArray.map(([id, value]) => ({
        id,
        ...value,
      }))
      callback(finalArray)
    }
  })
}

export const removeItem = (itemId) => {
  const itemRef = ref(database, `items/${itemId}`)
  return remove(itemRef)
}
