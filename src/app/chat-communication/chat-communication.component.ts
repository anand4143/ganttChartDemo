import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ChatService } from '../service/chat.service';
import { DataService } from '../service/data.service';
import * as FileSaver from 'file-saver';
@Component({
  selector: 'app-chat-communication',
  templateUrl: './chat-communication.component.html',
  styleUrls: ['./chat-communication.component.scss']
})
export class ChatCommunicationComponent implements OnInit {
  userId: any;
  typingUser: any;
  typing = false;
  empInfo: any;
  roomId: any;
  formId: any;
  empList: any;
  chatForm: FormGroup;
  message: any;
  isCollapsed = false;
  imgUrl: any
  clostyle: any;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  messageLists = [];
  constructor(private modalService: NgbModal, private router: Router, private routes: ActivatedRoute,
    private dataService: DataService, private chatService: ChatService, private fb: FormBuilder, private toaster: ToastrService) {

    this.chatForm = this.fb.group({
      message: ["", Validators.required]
    })
    this.dataService.getProfile().subscribe(profile => {
      if (profile.status == 200) {
        this.formId = profile.data;
        this.empList = profile.data;
        this.imgUrl = environment.apiUrl + this.empList.profilePic
        this.dataService.createChatRoom({
          companyId: this.empList.companyId,
        }).subscribe(response => {
          if (response.status == 200) {
            this.roomId = response.data;
            this.chatService.initiateChat(this.empList.name, this.roomId);
            this.getChatDetail(this.roomId);
          }
          else if (response.status == 204) {
            this.toaster.error('Req Body Is Empty!');
          }
          else if (response.status == 208) {
            this.roomId = response.data
            this.chatService.initiateChat(this.empList.name, this.roomId);
            this.getChatDetail(this.roomId);
          }
          else if (response.status == 500) {
            this.toaster.error('Unable To Process!');
          }
        })
      }
    })
    this.socketConnect();
    this.getTypingStatus();
  }
  socketConnect() {
    this.chatService.getMessages().subscribe((message: any) => {
      this.messageLists.push(message);
    });
  }

  ngOnInit(): void {
  }
  @ViewChild('scrollBottom') private scrollBottom: ElementRef;

  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch (err) { }
  }
  employeeName: any;
  getChatDetail(roomId: any) {
    this.dataService.getChatDetail(roomId).subscribe(data => {
      if (data.status == 200) {
        this.messageLists = data.data;
        this.messageLists.forEach(element => {
          if (element.type == 'file') {
            element.image = element.message,
              element.message = environment.apiUrl + element.message;
            element.ext = element.message.split('.').pop()
          }
        });
      }
      if (data.status == 404) {
        //
      }
      if (data.status == 500) {
        this.toaster.error('Unbale to process');
      }
    })
  }
  sendMessage() {

    const obj = {
      roomName: this.roomId,
      sender: this.empList.companyId,
      name: this.empList.name,
      message: this.chatForm.value.message,
      date: Date.now(),
      type: 'text'
    }
    this.chatService.sendMessage(obj);
    this.message = '';
    this.chatForm.patchValue({
      message: ""
    })
  }
  update() {
    this.chatService.updateStatus(this.empList.name,this.roomId)
  }
  name: string;
  getTypingStatus() {
    this.chatService.getTypingStatus().subscribe((user) => {
      if (this.name !== user) {
        this.typingUser = user;
        this.typing = true;
        setTimeout(() => {
          this.typing = false;
        }, 3000);
      }
    })
  }
  public stopTyping() {
    this.chatService.stopTyping(this.typingUser).subscribe((user) => {
      this.typingUser = user;
      this.typing = false;
    })
  }
  selectedFiles?: FileList;
  currentFile?: File;
  uploadFile(event: any) {
    if (event.target.files.length > 0) {
      this.selectedFiles = event.target.files;
    }
    this.dataService.chatFileUpload({
      roomId: this.roomId,
      sender: this.empList.id,

    }, this.selectedFiles.item(0)).subscribe((data: any) => {
      if (data.data.type == 'file') {
        this.messageLists.push({
          type: 'file',
          image: data.data.message,
          ext: data.data.message.split('.').pop(),
          message: environment.apiUrl + data.data.message,
        })
      }
    })
  }
  // //file download 

  downloadFile(fileName: any) {
    this.dataService.downloadFile({ fileName: fileName }).subscribe(data => {
      let downloadURL = window.URL.createObjectURL(data);
      FileSaver.saveAs(downloadURL);
    })
  }
  ngAfterViewChecked() {
    this.scrollToBottom();
  }
}
