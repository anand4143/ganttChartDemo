import { AfterViewInit, Component, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, EmailValidator, Validators, FormControl } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Title } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SearchCountryField, CountryISO } from 'ngx-intl-tel-input';
import { NgxSpinnerService } from 'ngx-spinner';
import { ToastrService } from 'ngx-toastr';
import { environment } from 'src/environments/environment';
import { DataService } from '../service/data.service';
import { MustMatch } from '../service/mustMatchValidtor';

export interface PeriodicElement {
  profilePic: string;
  name: string;
  email: string;
  phone: number;
  empcode: string;
  region: string;
  role: string;
  action: string;
}
@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements AfterViewInit {
  separateDialCode = true;
	SearchCountryField = SearchCountryField;
	CountryISO = CountryISO;
	preferredCountries: CountryISO[] = [CountryISO.UnitedStates, CountryISO.UnitedKingdom];
  id: any;
  movieSelected: string = '';
  emplyeeForm: FormGroup;
  displayedColumns: string[] = ['profilePic', 'name', 'companyName', 'email', 'mobileNo', 'employeeCode', 'region', 'role', 'status', 'action'];
  dataSource: any;
  regionRecord: any;
  employeeList: any;
  valueFromChild: any;
  imgUrl = environment.apiUrl;
  closeResult: string;
  editMode = 0;
  buttonText = "Create";
  headingText = "Create User"
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  @ViewChild(MatPaginator) paginator: MatPaginator;
  signUpForm: FormGroup;
  submitted = false;
  status: boolean = false;
  roleRecord: any;
  opened = false;
  permissions: any;
  userPermission: any;
  html = false;
  // public noWhitespaceValidator(control: FormControl) {
  //   const isWhitespace = (control.value || '').trim().length === 0;
  //   const isValid = !isWhitespace;
  //   return isValid ? null : { 'whitespace': true };
  // }
  constructor(private dataService: DataService, private fb: FormBuilder, private modalService: NgbModal,
    private toastr: ToastrService, private router: Router, private spinner: NgxSpinnerService,private titleService:Title) {
      let title = localStorage.getItem('domain');
      this.titleService.setTitle(title);
    this.emplyeeForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern('[a-zA-Z ]*')]],
      userName: ['', [Validators.required,]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      email: ['', [Validators.required, Validators.email]],
      mobileNo: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(10)]],
      roleId: ['', [Validators.required]],
      companyId: [''],
      employeeCode: ['', [Validators.required]],
      regionId: ['', [Validators.required]],
      confirmPassword: ['', [Validators.required]],
    }, {
      validator: MustMatch("password", "confirmPassword")
    })
    this.dataService.myPermisssion().subscribe(results => {
      if (results.status == 200) {
        this.permissions = results.data;
        this.permissions.forEach(element => {
          if (element.permission.actionUrl == 'user-management') {
            this.userPermission = element;
            if (this.userPermission.view == true) {
              this.html = true;
            }
            else {
              // this.toastr.error("you don't have permission to access this resource");
            }
          }
        });
      }
      if (results.status == 404) {
        this.userPermission = results.data;
        if (this.userPermission.view == false) {
          this.html = false
          this.toastr.error("you don't have permission to access this resource");
        }
      }
    })
    this.dataService.resetHome(false);
    this.dataService.getRegion().subscribe(data => {
      if (data.status == 200) {
        this.regionRecord = data.data;
      }
      if (data.status == 204) {
        
      }
      if (data.status == 500) {
        this.toastr.error('Unable To Process');
      }
    })
    this.allEmployeeList();
    this.getRole();
    let obj = localStorage.getItem('menuStatus');
    if (obj == 'true') {
      this.status = true;
      this.opened = true;
    }
    else {
      this.opened = false;
      this.status = false;
    }
  }
  ngOnInit(): void {
  }
  ngAfterViewInit() {

  }
  clickEvent() {
    this.status = !this.status;
    localStorage.setItem('menuStatus', this.status.toString());
  }
  get f() { return this.emplyeeForm.controls; }
  allEmployeeList() {
    this.dataService.setLoading3(true);
    this.dataService.employeeList().subscribe(data => {
      if (data.status == 200) {
        this.dataService.resetLoading3(false);
        this.employeeList = data.data;
        this.employeeList.forEach((element: any) => {
          element.role = element?.role?.name
          element.companyName = element?.company?.name
          element.region = element?.region?.name === null ? "Null" : element?.region?.name;
          element.profilePic = this.imgUrl + element?.profilePic
        });
        const ELEMENT_DATA: PeriodicElement[] = data.data
        this.dataSource = new MatTableDataSource(ELEMENT_DATA);
        this.dataSource.paginator = this.paginator;
      }
      if (data.status == 404) {
        this.spinner.hide();
      }
      if (data.status == 500) {
        this.toastr.error('Unable To Process');
      }

      this.spinner.hide();
    })
  }
  changeStatus(event: any, id: any) {
    if (this.userPermission.update == true) {
      if (event.checked == true) {
        this.dataService.updateEmployee(id, { status: 1 }).subscribe((data: any) => {
          if (data.status == 200) {
            this.toastr.success("Status Updated Successfully")
          }
          if (data.status == 304) {
            this.toastr.error("Not Mofified")
          }
          if (data.status == 500) {
            this.toastr.error("Unable to process")
          }
        })
      } else {
        this.dataService.updateEmployee(id, { status: 0 }).subscribe((data: any) => {
          if (data.status == 200) {
            this.toastr.success("Status Updated Successfully")
          }
          if (data.status == 304) {
            this.toastr.error("Not Modified")
          }
          if (data.status == 500) {
            this.toastr.error("Unable to process")
          }
        })
      }
    }
    else {
      this.toastr.error("you don't have permission to perform this action")
    }

  }
  getId(id: any) {
    this.id = id
  }
  deleteUser() {
    this.dataService.setLoading3(true);
    this.dataService.employeeDelete(this.id).subscribe((data: any) => {
      if (data.status == 200) {
        this.allEmployeeList();
        this.modalService.dismissAll();
        this.toastr.success("User Deleted Successfully");
        this.dataService.resetLoading3(false);
      }
      if (data.status == 404) {
        // this.toastr.error("User Not Found! ");
      }
      if (data.status == 500) {
        this.toastr.error("Unable To Process ");
      }

    })
  }
  edit(id: any) {
    localStorage.setItem('id', id);
    this.movieSelected = id;
  }
  add() {
    this.movieSelected = "add";
  }
  getRole() {
    this.dataService.rolesList().subscribe(data => {
      if (data.status == 200) {
        this.roleRecord = data.data;
      }
      else if (data.status == 404) {
        
      }
      else if (data.status == 500) {
        this.toastr.error('Unable to process');
      }
    })
  }


  readOutputValueEmitted(val) {
    this.valueFromChild = val;
    this.allEmployeeList();
  }
  openSm(content, element, type: number) {
    if (type === 1) {
      if (this.userPermission.update == true) {
        this.status = false
        this.editMode = 1;
        this.buttonText = "Update";
        this.headingText = "Update User";
        this.emplyeeForm.patchValue({
          name: "" + element.name,
          userName: "" + element.userName,
          email: "" + element.email,
          mobileNo: "" + element.mobileNo,
          roleId: "" + element.roleId,
          regionId: "" + element.regionId,
          employeeCode: "" + element.employeeCode,
        });
        this.modalService.open(content, { size: 'md' });
      } else {
        this.toastr.error("you don't have permission to access this resource");
      }

    }
    else if (type === 2) {
      if (this.userPermission.view == true) {
        this.status = false
        this.editMode = 2;
        this.headingText = "View User";
        this.emplyeeForm.patchValue({
          name: "" + element.name,
          userName: "" + element.userName,
          email: "" + element.email,
          mobileNo: "" + element.mobileNo,
          roleId: "" + element.roleId,
          regionId: "" + element.regionId,
          employeeCode: "" + element.employeeCode
        });
        this.modalService.open(content, { size: 'md' });
      } else {
        this.toastr.error("you don't have permission to access this resource");
      }
    } else if (type == 0) {
      if (this.userPermission.insert == true) {
        this.status = true;
        this.editMode = 0;
        this.headingText = "Create User";
        this.buttonText = "Create";
        this.emplyeeForm.patchValue({
          name: "",
          userName: "",
          email: "",
          mobileNo: "",
          roleId: "",
          regionId: "",
          employeeCode: "",
          companyId: ""
        });
        this.modalService.open(content, { size: 'md' });
      } else {
        this.toastr.error("you don't have permission to access this resource");
      }

    }
    if (type === 3) {
      if (this.userPermission.delete === true) {
        this.modalService.open(content, { size: 'md' });
      }
      else {
        this.toastr.error("you don't have permission to access this resource");
      }
    }

    this.id = element.id;
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  onSubmit() {
    if (this.id > 0) {
      this.update()
    }
    else {
      this.onSave();
    }
  }
  update() {
    this.dataService.setLoading3(true);
    this.dataService.updateEmployee(this.id, {
      name: this.emplyeeForm.value.name,
      userName: this.emplyeeForm.value.userName,
      email: this.emplyeeForm.value.email,
      mobileNo: this.emplyeeForm.value.mobileNo?.internationalNumber,
      employeeCode: this.emplyeeForm.value.employeeCode,
      roleId: this.emplyeeForm.value.roleId,
      regionId: this.emplyeeForm.value.regionId,
    }).subscribe((data: any) => {
      if (data.status == 200) {
        this.toastr.success('Update Successfully');
        this.emplyeeForm.reset();
        this.modalService.dismissAll();
        this.submitted = false;
        this.allEmployeeList();
        this.dataService.resetLoading3(false);
      }
      this.submitted = false;
      if (data.status == 204) {
        this.toastr.error('No Content Please fill all value');
      }
      if (data.status == 500) {
        this.toastr.error('Unable To Process');
      }

    })

  }
  onSave() {
    this.submitted = true;
    if (this.emplyeeForm.invalid) {
      // console.table(this.emplyeeForm.value);
      return
    }
    if (this.emplyeeForm.valid) {
      // console.table(this.emplyeeForm.value);
    }
    this.dataService.setLoading3(true);
    this.dataService.addEmployee({
      name: this.emplyeeForm.value.name,
      userName: this.emplyeeForm.value.userName,
      password: this.emplyeeForm.value.password,
      email: this.emplyeeForm.value.email,
      mobileNo: this.emplyeeForm.value.mobileNo?.internationalNumber,
      employeeCode: this.emplyeeForm.value.employeeCode,
      roleId: this.emplyeeForm.value.roleId,
      regionId: this.emplyeeForm.value.regionId,
    }).subscribe(data => {
      if (data?.status == 200) {
        // this.router.navigateByUrl('/user-managemnt');
        this.toastr.success('User Added Successfully');
        this.submitted = false;
        this.emplyeeForm.reset()
        this.allEmployeeList();
        this.modalService.dismissAll();
        this.dataService.resetLoading3(false);
      }
      if (data?.status == 208) {
        this.toastr.error('Username Already Exists');
      }
      if (data?.status == 209) {
        this.toastr.error('Mobile No. already exits');
      }
      if (data?.status == 210) {
        this.toastr.error('Email Already Exists');
      }
      if (data?.status == 429) {
        this.toastr.error('You have reached the limit, please upgrade your plan');
      }
      if (data?.status == 204) {
        this.toastr.error('No Content');
      }
      if (data?.status == 500) {
        this.toastr.success('Unable To Process');
      }
    })
  }
  keyDown(e) {
    var e = window.event || e;
    var key = e.keyCode;
    //space pressed
    if (key == 32) { //space
      e.preventDefault();
    }
  }

  checkWhitespace(event) {
    var data = event.clipboardData.getData("text/plain");
    var isNullOrContainsWhitespace = (!data || data.length === 0 || /\s/g.test(data));

    if (isNullOrContainsWhitespace) {
      event.preventDefault();
    }
  }
}
