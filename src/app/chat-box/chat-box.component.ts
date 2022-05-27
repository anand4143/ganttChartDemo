import { Component, ComponentFactoryResolver, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';

import { ChatService } from '../service/chat.service';
import { DataService } from '../service/data.service';
import { CommunicationComponent } from '../communication/communication.component';
import { environment } from 'src/environments/environment';
import * as FileSaver from 'file-saver';
import { ScrollToBottomDirective } from '../scroll-to-bottom.directive';


@Component({
  selector: 'app-chat-box',
  templateUrl: './chat-box.component.html',
  styleUrls: ['./chat-box.component.scss']
})
export class ChatBoxComponent implements OnInit {
  @ViewChild(ScrollToBottomDirective)
  scroll: ScrollToBottomDirective;
  public unique_key: number;
  public parentRef: CommunicationComponent;
  selectedItem: any;
  empList: any;
  displayedColumns: string[] = ['position', 'status', 'name', 'email', 'mobileNo', 'userType', 'action'];
  dataSource: any;
  empInfo: any;
  roomId: any;
  messageLists = [];
  chatForm: FormGroup;
  typingUser: any;
  typing = false;
  public isCollapsed = false;
  message: any;
  imgUrl: any;
  clostyle: any;
  footer1: any;
  isShown: boolean = false;
  employeeRecord: any;
  id: any;
  formId: any;
  refn;
  selfRef;
  senderImg: any;
  constructor(private el: ElementRef, private dataService: DataService, private fb: FormBuilder, private CFR: ComponentFactoryResolver,
    private toaster: ToastrService, private chatService: ChatService) {

      console.log("unique_key===>",this.unique_key);
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    })
    this.dataService.ids.subscribe(val => this.id = val);
    this.isShown = !this.isShown;
    this.dataService.employeegGetProfile(this.id).subscribe(commonresponse => {
      if (commonresponse.status == 200) {
        this.empList = commonresponse.data
        this.empInfo = commonresponse.data
        this.imgUrl = environment.apiUrl + commonresponse.data.profilePic;
        console.log("img Url", this.imgUrl);
        this.dataService.getProfile().subscribe(datas => {
          console.log("datas==>",datas);
          this.senderImg = environment.apiUrl + datas.data.profilePic;
          console.log("sender Img==>", environment.apiUrl + datas.data.profilePic);
          if (datas.status == 200) {
            this.employeeRecord = datas.data;
            this.dataService.createRoom({
              companyId: this.empList.companyId,
              employeeId: this.employeeRecord.id,
              userId: this.empList.id,
              createdby: this.employeeRecord.id,
              updatedby: this.employeeRecord.id
            }).subscribe(response => {
              if (response.status == 200) {
                this.roomId = response.data.roomId;
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
          if (datas.status == 404) {
            ////
          }
          if (datas.status == 500) {
            this.toaster.error('Unable To Process');
          }
        });
      }
      if (commonresponse.status == 404) {
        //
      }
      if (commonresponse.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
    this.clostyle = "chat-box";
    this.footer1 = "chat-footer";
    this.isCollapsed == false;
    this.socketConnect();
    this.getTypingStatus();
    if (this.isCollapsed == true) {
      this.clostyle = "chat-box1";
      this.footer1 = "chat-footer1"
    } if (this.isCollapsed == false) {
      this.clostyle = "chat-box";
      this.footer1 = "chat-footer";
    }
  }
  ngAfterViewInit(): void {
    this.scrollToBottom();
  }
  socketConnect() {
    this.chatService.getMessages().subscribe((message: any) => {
      console.log("message===>",message);
      console.log("Room id===>",this.roomId);
      console.log("messageLists===>",this.messageLists);
      if(message.roomId === this.roomId){
        this.messageLists.push(message);
        console.log("messageLists if ==>", this.messageLists);
      }else{
        console.log("messageLists else==>", this.messageLists);
      }
      
    });
  }

  @ViewChild('scrollBottom') private scrollBottom: ElementRef;

  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch (err) { }
  }
  employeeName: any;
  temMessageList: any;
  getChatDetail(roomId: any) {
    this.dataService.setLoading3(true);
    this.dataService.getChatDetail(roomId).subscribe(data => {
      if (data.status == 200) {
        if(roomId){
          this.messageLists = data.data;
          console.log("this.senderImg",this.senderImg);
          this.temMessageList = this.messageLists;
          console.log("chat details===>",this.messageLists);
          for(let i = 0; i < this.temMessageList.length; i++){
            this.messageLists[i]['senderImg'] = this.senderImg;
            this.messageLists[i]['recieverImg'] = this.imgUrl;
             
          }
          console.log("with image chat details===>",this.messageLists);
        }
        
        this.messageLists.forEach(element => {
          element.name = element.user[0].name
          if (element.type == 'file') {
            element.image = element.message,
              element.message = environment.apiUrl + element.message;
            element.ext = element.message.split('.').pop()
          }
        });
        this.dataService.resetLoading3(false);
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
    this.dataService.getProfile().subscribe(profile => {
      if (profile.status == 200) {
        this.formId = profile.data
        const obj = {
          roomName: this.roomId,
          sender: this.employeeRecord.id,
          name: this.formId.name,
          receiver: this.empList.id,
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

    })
  }
  update() {
    this.chatService.updateStatus(this.employeeRecord?.name,this.roomId)
  }
  name: string;
  getTypingStatus() {
    this.chatService.getTypingStatus().subscribe((user) => {
      console.log("user===>",user);
      console.log("user new===>", user.userName.username);
      console.log("this.empList.name===>",this.empList.name);
      if ((this.empList.name != user.userName.username) && (this.roomId === user.userName.roomId)) {
        this.typingUser = user.userName.username;
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
  //file download 

  downloadFile(fileName: any) {
    this.dataService.downloadFile({ fileName: fileName }).subscribe(data => {
      let downloadURL = window.URL.createObjectURL(data);
      FileSaver.saveAs(downloadURL);
    })
  }
  //send email to notify user
  sendEmail(id: any) {
    this.dataService.notificationEmail({ id: id }).subscribe(data => {
      if (data.status == 200) {
        this.toaster.success('notification send Successfully');
      }
      if (data.status == 404) {
        //
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }


  ngOnInit(): void {
    // this.scrollToBottom();
    console.log("");
    window.scroll({ 
      top: 50, 
      left: 0, 
      behavior: 'smooth' 
});

  }
  ngAfterViewChecked() {
    // this.scrollToBottom();
  }

  chatIsToggled: boolean = true;
  remove_me() {
    this.chatIsToggled = false;
  }
}
