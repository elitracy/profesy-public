import { StyleSheet } from 'react-native'
// STYLES
const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 'auto',
    height: '95%',
    backgroundColor: 'black'
  },
  title: {
    textAlign: 'left',
    fontSize: 40,
    color: 'white'
  },
  departmentTitle: {
    fontSize: 30,
    textAlign: 'center',
    color: 'white'
  },
  departmentContainer: {
    // marginHorizontal: 30,
    // marginVertical: 10,
    // shadowOffset: { width: 3, height: 2 },
    // shadowOpacity: 1,
    // shadowRadius: 0,
  },
  department: {
    fontSize: 30,
    textAlign: 'left',
    color: 'white',
    fontWeight: '500',
    letterSpacing: 3,
    paddingVertical: 8
  },
  departments: {
    // flex: 6,
    // justifyContent: 'flex-start',
    // paddingBottom: 100,
    // height: '80%',
  },
  inputStyles: {
    borderRadius: 5,
    padding: 10,
    fontSize: 15,
    width: '95%',
    backgroundColor: 'white'
  }
})

export default styles
