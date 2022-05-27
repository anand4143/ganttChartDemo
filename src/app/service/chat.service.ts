import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  constructor(private socket: Socket) { }
  //chat initilization
  public initiateChat(userName:any, roomName:any) {
    this.socket.emit('join room', { userName: userName, roomName: roomName });
    this.socket.emit('connected', roomName)
    
  }
  //send message
  public sendMessage(message:any) {
    this.socket.emit('sendMessage', message);
  }

  //user typing
  public updateStatus(username:any, roomId: any) {
    let obj = {
      username: username,
      roomId: roomId
    }
    this.socket.emit('typing', obj);
  }

  public stopTyping = (username:any) => {
    return Observable.create((observer:any) => {
      this.socket.emit('stoptyping', (username:any) => {
        observer.next(username);
      });
    });
  }


  public getTypingStatus = () => {
    return Observable.create((observer:any) => {
      this.socket.on('typing', (data:any) => {
        observer.next(data);
      });
    });
  }


  getMessages() {
    return Observable.create((observer:any) => {
      this.socket.on('sendMessage', (message:any) => {
        observer.next(message);
      });
    });
  }
  removeUser(){
    this.socket.removeAllListeners("RecieveMessage");
  }
}