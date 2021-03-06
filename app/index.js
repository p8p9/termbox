import 'font-awesome'
import 'font-linux/assets/font-linux.css!'
import 'bulma/css/bulma.css!'
import './styles/style.sass!'
import 'whatwg-fetch'

import Preact, {render} from 'preact'
import {Provider} from 'preact-redux'
import createStore from './store'
import App from './components/App'

const store = createStore()

const container = document.createElement('div')
container.style.height = '100%'

render(
  <Provider store={store}>
    <App/>
  </Provider>,
  container
)

document.body.appendChild(container)
