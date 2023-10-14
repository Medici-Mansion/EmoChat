import { Manager as M, Socket, SocketOptions } from 'socket.io-client'

export class Manager extends M {
  private readonly sockets: { [key: string]: Socket } = {}
  create_socket(
    nsp: string,
    opts?: Partial<SocketOptions> | undefined,
  ): Socket {
    if (this.sockets.hasOwnProperty(nsp)) {
      return this.sockets[nsp]
    }
    const socket = this.socket(nsp, opts) as Socket

    socket.disconnect()
    socket.listen = function bindEventListnerOnSocket(ev, lisnter) {
      if (this.hasListeners(ev)) {
        socket.off(ev)
      }
      socket.on(ev, lisnter as any)
      return socket
    }
    this.sockets[nsp] = socket
    return socket
  }

  isExistNsp(url: string) {
    return !!this.sockets[url]
  }
}
