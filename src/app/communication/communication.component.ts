// import { Component, AfterViewInit, ViewChild, ElementRef, ComponentRef, ViewContainerRef, ComponentFactoryResolver } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { ChatService } from '../service/chat.service';
import { DataService } from '../service/data.service';
import * as FileSaver from 'file-saver';
import { ChatBoxComponent } from '../chat-box/chat-box.component';
import {
  ComponentRef,
  ComponentFactoryResolver,
  ViewContainerRef,
  ViewChild,
  Component,
  ViewRef,
  ElementRef,
} from '@angular/core';
import { Title } from '@angular/platform-browser';

export interface PeriodicElement {
  name: string;
  position: number;
  email: string;
  phone: string;
  userType: string;
  status: string;
  action: string;
}

@Component({
  selector: 'app-communication',
  templateUrl: './communication.component.html',
  styleUrls: ['./communication.component.scss']
})
export class CommunicationComponent {
  i = 0

  // VCR: ViewContainerRef;
  opened = false;
  @ViewChild('viewContainerRef', { read: ViewContainerRef })
  VCR: ViewContainerRef;

  child_unique_key: number = 0;
  componentsReferences = Array<ComponentRef<ChatBoxComponent>>();
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
  status = false;
  imgUrl: any;
  clostyle: any;
  footer1: any;
  permissions: any;
  communication: any;
  employeeRecord: any;
  isShown: boolean = false; // hidden by default
  @ViewChild('scrollBottom') private scrollBottom: ElementRef;
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  @ViewChild(MatPaginator) paginator: MatPaginator;

  ngAfterViewChecked() {
    this.scrollToBottom();
  }
  ngAfterViewInit(): void {
    // this.dataService.setSidenav(this.sidenav);
  }
  html = false;
  constructor(private dataService: DataService, private fb: FormBuilder, private CFR: ComponentFactoryResolver,
    private toaster: ToastrService, private titleService: Title, private chatService: ChatService, private resolver: ComponentFactoryResolver) {
    this.chatForm = this.fb.group({
      message: ['', [Validators.required]]
    })
    let title = localStorage.getItem('domain');
    this.titleService.setTitle(title);
    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'communication') {
            this.communication = element;
            if (this.communication.view == true) {
              this.html = true
            }
            else {
              // this.toaster.error("you don't have permission to perform this action");
            }
          }

        });
      }
      if (results.status == 404) {
        this.communication = results.data;
        if (this.communication.view == false) {
          this.html = false
          this.toaster.error("you don't have permission to access this resource");
        }
      }
    })

    this.dataService.resetHome(false);
    this.dataService.setLoading3(true);
    this.dataService.communicationUserList().subscribe(data => {
      this.empList = data.data
      this.empList.forEach(element => {
        element.userType = element.role.name
      });
      this.dataSource = new MatTableDataSource(data.data)
      this.dataSource.paginator = this.paginator;
      this.dataService.resetLoading3(false);
    })

    if (this.isCollapsed == true) {
      this.clostyle = "chat-box1";
      this.footer1 = "chat-footer1"
    } if (this.isCollapsed == false) {
      this.clostyle = "chat-box";
      this.footer1 = "chat-footer"
    }
    let obj = localStorage.getItem('menuStatus');
    if (obj == 'true') {
      this.status = true
      this.opened = true
    }
    else {
      this.opened = false
      this.status = false
    }
  }
  ngOnInit(): void {

  }
  toggleRightSidenav() {
    this.dataService.toggle();
  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }


  scrollToBottom(): void {
    try {
      this.scrollBottom.nativeElement.scrollTop = this.scrollBottom.nativeElement.scrollHeight;
    } catch (err) { }
  }

  selectedFiles?: FileList;
  currentFile?: File;
  uploadFile(event: any) {
    let sender = ''
    if (this.empInfo.roleId == 2) {
      sender = "admin"
    }
    else {
      sender = "employee"
    }
    if (event.target.files.length > 0) {
      this.selectedFiles = event.target.files;
    }
    this.dataService.chatFileUpload({
      roomId: this.roomId,
      sender: sender,
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
        this.toaster.success('Notification sent successfully');
      }
      if (data.status == 404) {
        //
      }
      if (data.status == 500) {
        this.toaster.error('Unable To Process');
      }
    })
  }
  readOutputValueEmitted(val) {
  }
  movieSelected: string = '';
  keys: number = 1

  createComponent(element) {
    this.dataService.SetName(element.id);

    let componentFactory = this.CFR.resolveComponentFactory(ChatBoxComponent);

    let childComponentRef = this.VCR.createComponent(componentFactory);
    console.log("childComponentRef===>",childComponentRef);
    let childComponent = childComponentRef.instance;
    childComponent.unique_key = ++this.child_unique_key;
    
    childComponent.parentRef = this;

    // add reference for newly created component
    this.componentsReferences.push(childComponentRef);

    let vcrIndex: number = this.VCR.indexOf(childComponent as any);
    console.log("vcrIndex====>",vcrIndex);

  }
  ngOnChange() {

  }
 
  onOpenedChange(e: boolean) {

  }
  remove(key: number) {

 
    if (this.VCR.length < 1) return;
    let componentRef = this.componentsReferences.filter(
      x => x.instance.unique_key == key
    );
  
    let vcrIndex: number = this.VCR.indexOf(componentRef as any);
    this.VCR.remove(vcrIndex);

    // removing component from the list
    this.componentsReferences = this.componentsReferences.filter(
      (x) => x.instance.unique_key !== key
    );
  }
}