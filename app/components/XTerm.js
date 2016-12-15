import Preact, { Component } from 'preact'
import Terminal from 'xterm'
import ReconnectingWebSocket from 'reconnecting-websocket'

export default class XTerm extends Component {

  shouldComponentUpdate() {
    return false
  }

  componentDidMount() {
    let elem = document.createElement('div')
    elem.style.position = 'relative'
    elem.style.width = '100%'
    elem.style.height = '100%'
    this.base.appendChild(elem)

    requestAnimationFrame(() => {
      this.init(this.props, elem)
    })
  }

  init({onOpen, onError, onClose, podId, getThemeChangeHandler}, elem) {


    let proto = location.protocol == 'https:' ? 'wss' : 'ws'
    let url = `${proto}://${location.host}/boxes/${podId}/exec`
    let ws = new ReconnectingWebSocket(url)
    ws.maxReconnectAttempts = 10
    ws.reconnectInterval = 5000

    let term = new Terminal()

    term.attachCustomKeydownHandler((e) => {
      if (e.ctrlKey && e.shiftKey && (e.keyCode == 3)) {
        document.execCommand('copy')
        return false
      }


      if (e.ctrlKey && e.shiftKey && (e.keyCode == 86)) {
        document.execCommand('paste')
        return false
      }
    })

    term.on('key', (key, ev) => {
      ws.send(JSON.stringify({data: key}))
    })

    ws.onmessage = (ev) => {
      term.write(ev.data)
    }

    ws.onclose = () => {
      if (onClose) onClose()
    }

    ws.onerror = (e) => {
      if (onError) onError(e)
    }

    ws.onopen = () => {
      term.reset()
      if (onOpen) onOpen()
    }

    term.open(elem)

    if (getThemeChangeHandler) {
      getThemeChangeHandler((theme) => {
        // TODO
      })
    }
  }

  render() {
    return <div style={{height: '100%'}}></div>
  }
}
