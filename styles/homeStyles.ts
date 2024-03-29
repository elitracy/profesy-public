export const styles: any = {
  container: {
    justifyContent: 'flex-start',
    alignItems: 'center',
    flexDirection: 'column',
    height: '95%',
    backgroundColor: 'black',
    width: '100%'
  },
  title: {
    fontSize: 35,
    textAlign: 'left',
    fontWeight: '700',
    color: 'white',
    width: '70%',
    marginLeft: 3
  },
  header: {
    width: '95%',
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingHorizontal: 0,
    paddingBottom: 8,
    marginTop: 8,
    color: 'white'
  },
  username: {
    textAlign: 'right',
    fontSize: 25,
    color: 'white',
    paddingTop: 8
  },
  inputStyles: {
    padding: 10,
    paddingLeft: 30,
    fontSize: 15,
    color: 'white'
  },
  searchContainer: {
    width: '95%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center'
  },
  searchBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,.1)',
    borderRadius: 8
  },
  filtersContainer: {
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 5
  },
  profResultContainer: {
    backgroundColor: 'black',
    width: '100%',
    flexDirection: 'row',
    padding: 5,
    paddingVertical: 8,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  profResultTextName: {
    padding: 5,
    paddingLeft: 15,
    color: 'white',
    fontSize: 25,
    textAlign: 'left'
  },
  profResultTextGPA: {
    paddingRight: 15,
    textAlign: 'right',
    fontWeight: '800',
    fontSize: 25
  },
  courseResultContainer: {
    borderRadius: 15,
    backgroundColor: 'black',
    width: '100%',
    flexDirection: 'column',
    padding: 5,
    marginVertical: 6,
    shadowOffset: { width: 4, height: 3 },
    shadowOpacity: 1,
    shadowRadius: 0
  },
  courseResultText: {
    padding: 5,
    paddingLeft: 15,
    color: 'white',
    fontSize: 25,
    textAlign: 'left',
    fontWeight: '500'
  },
  searchHistoryContainer: {
    width: '100%',
    display: 'flex'
  }
}
