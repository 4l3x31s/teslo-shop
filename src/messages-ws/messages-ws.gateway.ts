import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { MessagesWsService } from './messages-ws.service';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';
import { JwtPayload } from '../auth/interfaces/jwt-payload.interface';

@WebSocketGateway({ cors: true })
export class MessagesWsGateway implements OnGatewayConnection, OnGatewayDisconnect {

  @WebSocketServer()
  wss: Server;

  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService
  ) { }


  async handleConnection(client: Socket, ...args: any[]) {
    //console.log('cliente conectado: ', client.id);
    //console.log(client);
    const token = client.handshake.headers.authentication as string;
    //console.log({ token });
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }
    console.log({ payload })





    this.wss.emit('clients-udated', this.messagesWsService.getConnectedClients());

    //console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }
  handleDisconnect(client: Socket) {
    //console.log('cliente desconectado: ', client.id);
    this.messagesWsService.removeClient(client.id);
    this.wss.emit('clients-udated', this.messagesWsService.getConnectedClients());
    //console.log({ conectados: this.messagesWsService.getConnectedClients() });
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {

    //! esto es para emitir unicamente al cliente.
    // client.emit('messages-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no-message!!'
    // })

    //! Emite a todos, menos al cliente
    // client.broadcast.emit('messages-from-server', {
    //   fullName: 'Soy yo!',
    //   message: payload.message || 'no-message!!'
    // })

    this.wss.emit('messages-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no-message!!'
    })
  }
}
