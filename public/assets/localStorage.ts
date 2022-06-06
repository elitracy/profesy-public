import AsyncStorage from '@react-native-async-storage/async-storage'

// getItem - Params(key: string, setStateItem: function) => string
export const getItem = async (key: string, setStateItem: any) => {
  try {
    const val = await AsyncStorage.getItem(key)
    setStateItem(val)
    return val
  } catch (e: any) {
    console.log('error', e.message)
  }
}

// storeItem - Params(key:string, value:any) => val:any
export const storeItem = async (key: string, value: any) => {
  try {
    const val = await AsyncStorage.setItem(key, value)
    return val
  } catch (e: any) {
    console.log('error', e.message)
  }
}
