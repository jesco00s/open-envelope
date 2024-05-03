import { initializeApp } from 'firebase/app'
import { getDatabase, ref, push, onValue, remove } from 'firebase/database'

const appSettings = {
  databaseURL: 'https://envelope-8551e-default-rtdb.firebaseio.com/',
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const itemsDB = ref(database, 'items')
const dateDB = ref(database, 'date')

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

export const getDateDB = (callback) => {
  onValue(dateDB, (snapshot) => {
    if (snapshot.exists()) {
      const itemsArray = Object.entries(snapshot.val())
      const epochStart = itemsArray[0][1] * 1000
      const epochEnd = epochStart + (13 * 24 * 60 * 60 * 1000)

      const formatDate = (dateEpoch) => {
        const date = new Date(dateEpoch);
        const mm = (date.getMonth() + 1).toString().padStart(2, '0');
        const dd = date.getDate().toString().padStart(2, '0');
        const yyyy = date.getFullYear();
        return `${mm}/${dd}/${yyyy}`;
      };

      const formattedStart = formatDate(epochStart);
      const formattedEnd = formatDate(epochEnd);

      const finalDateString = `${formattedStart} - ${formattedEnd}`
      callback(finalDateString)
    }
  })
}
