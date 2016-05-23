import { combineReducers } from 'redux'
import { routerReducer as router } from 'react-router-redux'
import locale from './modules/locale'
import auth from './modules/auth'
import site from './modules/site'

export default combineReducers({
  locale,
  router,
  site,
  auth
})
