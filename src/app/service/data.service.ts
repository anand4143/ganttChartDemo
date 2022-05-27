
import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
import { MatSidenav } from '@angular/material/sidenav';
const headers = new HttpHeaders().set("Accept", 'multipart/form-data; charset=utf-8');

@Injectable({
  providedIn: 'root'
})
export class DataService {
  hideSideNav: boolean = false;
  private id = new BehaviorSubject<string>('');
  private projectId = new BehaviorSubject<number>(0);
  private type = new BehaviorSubject<string>('');
  public isLoading = new BehaviorSubject(false);
  public isLoading1 = new BehaviorSubject(false);
  public isLoading2 = new BehaviorSubject(false);
  public isLoading3 = new BehaviorSubject(false);
  public loginStatus = new BehaviorSubject(false);
  public payToken = new BehaviorSubject('');
  public packageId = new BehaviorSubject('');
  public packageType = new BehaviorSubject('');
  public Home = new BehaviorSubject(true);
  loginToken = new BehaviorSubject('');
  changeHeader = new BehaviorSubject('');
  afterLogin = new BehaviorSubject('');
  changeHeaders = this.changeHeader.asObservable();
  afterLogins = this.afterLogin.asObservable();
  loginT = this.loginToken.asObservable();
  package = this.packageId.asObservable();
  packageTy = this.packageType.asObservable();
  ids = this.id.asObservable();
  projectIds = this.projectId.asObservable();
  types = this.type.asObservable();
  private sidenav: MatSidenav;
  ejsData = [];
  setEjsData(ejsD){
    this.ejsData = ejsD;
  }
  getEjsData(){
    return this.ejsData;
  }
  changeScrit(e) {
    this.afterLogin.next(e);
  }
  changeHeaderSetting(e) {
    this.changeHeader.next(e);
  }
  loginTok(e) {
    this.loginToken.next(e);
  }
  setpackageType(e) {
    this.packageType.next(e);
  }
  resetPackageType(e) {
    this.packageType.next(e);
  }
  setPackage(e) {
    this.packageId.next(e);
  }
  resetPackage(e) {
    this.packageId.next(e);
  }
  setPayToken(e) {
    this.payToken.next(e);
  }
  resetPayToken(e) {
    this.payToken.next(e);
  }
  setHome(e) {
    this.Home.next(e);
  }
  resetHome(e) {
    this.Home.next(e);
  }
  setLogin(e) {
    this.loginStatus.next(e)
  }
  resetLogin(e) {
    this.loginStatus.next(e)
  }
  setLoading(e) {
    this.isLoading.next(e)
  }
  resetLoading(e) {
    this.isLoading.next(e)
  }
  setLoading1(e) {
    this.isLoading1.next(e)
  }
  resetLoading1(e) {
    this.isLoading1.next(e)
  }
  setLoading2(e) {
    this.isLoading2.next(e)
  }
  resetLoading2(e) {
    this.isLoading2.next(e)
  }
  resetLoading3(e) {
    this.isLoading3.next(e)
  }
  setLoading3(e) {
    this.isLoading3.next(e)
  }

  public setSidenav(sidenav: MatSidenav) {
    this.sidenav = sidenav;
  }

  public open() {
    return this.sidenav.open();
  }

  public close() {
    return this.sidenav.close();
  }

  public toggle(): void {
    this.sidenav.toggle();
  }
  toggleSideNav(): void {
    this.hideSideNav = !this.hideSideNav;
  }
  SetName(id: string) {
    this.id.next(id);
  }
  setProjectId(projectId: number) {
    this.projectId.next(projectId);
  }
  setType(type: string) {
    this.type.next(type);
  }

  public get loggedIn(): boolean {
    return (localStorage.getItem('companyToken') !== null);
  }

  private newUser = new BehaviorSubject<any>({
    projectId: '',
    type: '',
    taskType: ''
  });
  setNewUserInfo(user: any) {
    this.newUser.next(user);
  }

  getNewUserInfo() {
    return this.newUser.asObservable();
  }
  apiUrl: any = environment.apiUrl;
  myGlobalVar: any;
  constructor(private http: HttpService, private https: HttpClient) { }
  public stringSubject = new Subject<string>();
  passValue(data) {
    this.stringSubject.next(data);
  }
  logger(key: any, value: any) {
    if (environment.logger) {
    }
  }
  logout() {
    localStorage.clear();
  }
  companySingUp(data: any) {
    return this.http.post('company/singup', data);
  }
  comapnySignIn(data: any) {
    return this.http.post('company/login', data);
  }
  //projetc 
  addProject(data: any) {
    return this.http.post('product/save/', data);
  }
  getProjectList(companyId: any) {
    return this.http.get('product/projectlist/' + companyId);
  }
  getProjectListRegion(regionId: any) {
    return this.http.get('product/getprojects/' + regionId);
  }
  projectList() {
    return this.http.get('product/list');
  }
  regionWiseProjectList() {
    return this.http.get('product/regionwiseprojectList');
  }
  updateProject(id: any, data: any) {
    return this.http.post('product/update/' + id, data);
  }
  updateProjectPosition(data: any) {
    return this.http.post('product/update', data);
  }
  getProject(projetcId: any) {
    return this.http.get('product/getproject/' + projetcId);
  }
  getDetail(projetcId: any) {
    return this.http.get('product/get/' + projetcId);
  }
  deleteProject(projetcId: any) {
    return this.http.delete('product/delete/' + projetcId);
  }
  //add emplyee
  addEmployee(data: any) {
    return this.http.post('employee/singup', data);
  }
  employeeLogin(data: any) {
    return this.http.post('employee/login', data);
  }

  updateEmployee(id: any, data: any) {
    return this.https.post(this.apiUrl + 'employee/update/' + id, data);
  }
  updateEmployeeProfile(id: any, file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.https.post(this.apiUrl + 'employee/update/' + id, formData, { headers });
  }
  employeeList() {
    return this.http.get('employee/employeelist');
  }
  communicationUserList() {
    return this.http.get('employee/communicationlist');
  }

  employeeChangePassword(data: any, empId: any) {
    return this.http.post('employee/changepassword/' + empId, data);
  }
  employeeForgetPassword(email: any) {
    return this.http.get('employee/forgetpassword/' + email);
  }
  employeeChangeForgetPassword(token: any, data: any) {
    return this.http.post('employee/forgetchangepassword/' + token, data);
  }
  employeeDelete(id: any) {
    return this.http.delete('employee/delete/' + id);
  }

  employeegGetProfile(id: any) {
    return this.http.get('employee/getProfile/' + id);
  }

  getProfile() {
    return this.http.get('employee/myprofile');
  }
  getProfileByToken(token) {
    return this.http.get('employee/myprofile/' + token);
  }
  searchEmployee(name: any) {
    return this.http.get('employee/search/' + name);
  }
  lastLogin() {
    return this.http.get('employee/lastlogin');
  }

  //project list
  // getEmplyeeId() {
  //   let token = localStorage.getItem('empToken')
  //   let decoded: any = jwt_decode(token);
  //   return decoded.id;
  // }

  getToken() {
    return this.http.get('companytransaction/createToken');

  }
  getTransactionToken(data: any) {
    return this.http.post('companytransaction/makepayment', data);
  }
  //projct activity
  addProjectInfoActivity(data: any) {
    return this.http.post('projectinfo/save', data)
  }

  ///chat room start 
  createRoom(data: any) {
    return this.http.post('chatroom/create', data);
  }
  createChatRoom(data: any) {
    return this.http.post('chatroom/adminchatroom', data);
  }

  adminchatroom
  getChatRoom(data: any) {
    return this.http.post('chatroom/createroom', data);
  }
  getRoomDetail(data: any) {
    return this.http.post('chatroom/getroom', data);
  }
  getChatDetail(roomId: any) {
    return this.http.get('message/getchat/' + roomId);
  }
  linkExpiredOrNot(token: any) {
    return this.http.get('employee/link-valid/' + token);
  }

  createComments(data: any) {
    return this.http.post('comment/save', data);
  }
  getComments(projectId: any, type: any, taskType: any) {
    return this.http.get('comment/list/' + projectId + "/" + type + "/" + taskType);
  }
  productFIleUpload(data: any, file: File) {
    const formData = new FormData();
    formData.append('projectId', data.projectId);
    formData.append('taskType', data.taskType);
    formData.append('image', file);
    return this.https.post(this.apiUrl + 'productfile/save', formData, { headers });
  }
  fileUplaodProduct(data: any, file: File) {
    const formData = new FormData();
    formData.append('projectId', data.projectId);
    formData.append('taskType', data.taskType);
    formData.append('image', file);
    return this.https.post(this.apiUrl + 'productfile/save', formData, { headers });
  }
  productFileList(id: any, type: any) {
    return this.http.get('productfile/list/' + id + "/" + type);
  }

  //goal
  createGoals(data: any) {
    return this.http.post('goal/save', data);
  }
  createGoal(data: any) {
    return this.http.post('goal/save', data);
  }
  getGoals() {
    return this.http.get('goal/goals');
  }
  getGoal(id) {
    return this.http.get('goal/goals/' + id);
  }
  getTaskList(id, workStreamId) {
    return this.http.get('goal/goaltasks/' + id + "/" + workStreamId);
  }
  getGoalLast(workStreamId, projectId) {

    return this.http.get('goal/getlastGoal/' + workStreamId + "/" + projectId);
  }

  updateGoal(id: any, data: any) {
    return this.http.post('goal/update/' + id, data,);
  }
  updateGoals(data: any) {
    return this.http.post('goal/update', data,);
  }
  deleteGoal(id: any) {
    return this.http.delete('goal/delete/' + id);
  }
  goalList(objectiveId) {
    return this.http.get('objective/list/' + objectiveId);
  }

  objctiveDev(objectiveId) {
    return this.http.get('objective/depecancy/' + objectiveId);
  }
  //create startgy
  createStrategy(data: any) {
    return this.http.post('strategy/save', data);
  }
  updateStrategy(id: any, data: any) {
    return this.http.post('strategy/update/' + id, data,);
  }
  updateStrategys(data: any) {
    return this.http.post('strategy/update', data,);
  }
  getStrategy() {
    return this.http.get('strategy/list');
  }
  strategyList(startagyId) {
    return this.http.get('strategy/list/' + startagyId);
  }
  strategyDev(startagyId) {
    return this.http.get('strategy/depedany/' + startagyId);
  }
  tacticList(tacticId) {
    return this.http.get('activity/list/' + tacticId);
  }
  tacticDev(tacticId) {
    return this.http.get('activity/depedancy/' + tacticId);
  }

  deleteStrategy(id: any) {
    return this.http.delete('strategy/delete/' + id);
  }
  //end startgy
  //create objective 
  createObjective(data: any) {
    return this.http.post('objective/save', data);
  }
  objectiveCreates(data: any) {
    return this.http.post('objective/creates', data);
  }

  updateObjective(id: any, data: any) {
    return this.http.post('objective/update/' + id, data,);
  }
  updateObjectives(data: any) {
    return this.http.post('objective/update', data,);
  }
  getObjective() {
    return this.http.get('objective/list');
  }
  deleteObjective(id: any) {
    return this.http.delete('objective/delete/' + id);
  }
  //end objective
  //tactics
  createTactics(data: any) {
    return this.http.post('tactic/save', data);
  }
  updateTactics(id: any, data: any) {
    return this.http.post('tactic/update/' + id, data,);
  }
  updateTactic(data: any) {
    return this.http.post('tactic/update', data,);
  }
  getTactics() {
    return this.http.get('tactic/list');
  }
  deleteTactics(id: any) {
    return this.http.delete('tactic/delete/' + id);
  }
  //end tactics
  //activity
  createActivity(data: any) {
    return this.http.post('activity/save', data);
  }
  updateActivity(id: any, data: any) {
    return this.http.post('activity/update/' + id, data,);
  }
  updateActivitys(data: any) {
    return this.http.post('activity/update', data,);
  }
  getActivity() {
    return this.http.get('activity/list');
  }
  deleteActivity(id: any) {
    return this.http.delete('activity/delete/' + id);
  }
  chatFileUpload(data: any, file: File) {
    const formData = new FormData();
    formData.append('roomId', data.roomId);
    formData.append('sender', data.sender);
    formData.append('image', file);
    return this.https.post(this.apiUrl + 'message/fileUpload', formData, { headers });
  }
  downloadFile(fileName: any): Observable<any> {
    return this.https.get(this.apiUrl + 'message/download/' + fileName.fileName, { responseType: 'blob' });
  }
  notificationEmail(data) {
    return this.http.post('message/notification/', data);
  }
  //get setting
  getSiteSetting() {
    return this.http.get('compnaySiteSetting/getsetting');
  }
  updateSiteSetting(id: any, data: any) {
    return this.http.post('compnaySiteSetting/update/' + id, data);
  }
  uploadSiteLogo(id: any, file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.https.post(this.apiUrl + 'compnaySiteSetting/update/' + id, formData, { headers });
  }
  updateFavicon(id: any, file: File) {
    const formData = new FormData();
    formData.append('image', file);
    return this.https.post(this.apiUrl + 'compnaySiteSetting/updateFavicon/' + id, formData, { headers });
  }

  timeZoneList() {
    return this.http.get('zone/getZone');
  }
  addWorkStream(data: any) {
    return this.http.post('workstream/save', data);
  }
  workStreamList() {
    return this.http.get('workstream/list');
  }
  workStreamListSelect(projectId) {
    return this.http.get('workstream/lists/' + projectId);
  }
  deleteWorkStream(id: any) {
    return this.http.delete('workstream/delete/' + id);
  }
  getWorkStream(id: any) {
    return this.http.get('workstream/get/' + id);
  }
  updateWorkStream(id: any, data: any) {
    return this.http.post('workstream/update/' + id, data);
  }
  updateWorkStreamPosition(data: any) {
    return this.http.post('workstream/update', data);
  }
  //region
  getRegion() {
    return this.http.get('region/list');
  }
  addRegion(data: any) {
    return this.http.post('region/save', data);
  }
  updateRegion(id: any, data: any) {
    return this.http.post('region/update/' + id, data);
  }
  updateRegionPosition(data: any) {
    return this.http.post('region/update', data);
  }
  deleteRegion(id: any) {
    return this.http.delete('region/delete/' + id);
  }
  getRegionById(id: any) {
    return this.http.get('region/getbyid/' + id);
  }
  getPackage() {
    return this.http.get('package/activepackage');
  }
  activepackages() {
    return this.http.get('package/activepackages');
  }
  getPackageById(id) {
    return this.http.get('package/getpackage/' + id);
  }
  getCompanyTransaction() {
    return this.http.get('companytransaction/gettransaction');
  }
  companyTransaction() {
    return this.http.get('companytransaction/alltransaction');
  }

  paymentDone(data: any) {
    return this.http.post('companytransaction/create', data);
  }
  getPaymentId(packageId, type) {
    return this.http.get('companytransaction/makepayment/' + packageId + "/" + type);
  }

  //task list
  taskList() {
    return this.http.get('taskassignment/getall');
  }

  userTaskListProjetWise(projectId) {
    return this.http.get('taskassignment/list/' + projectId);
  }
  createPosition(data: any) {
    return this.http.post('position/create', data);
  }

  updatePosition(id: any, data) {
    return this.http.post('position/update/' + id, data);
  }

  getPlanList() {
    return this.http.get('companytransaction/myPackage');
  }
  //delete company id
  deleteCompnay() {
    return this.http.delete('employee/deleteaccount');
  }
  notifications(data) {
    return this.http.post('activitylog/list', data);
  }
  notificationCount() {
    return this.http.get('activitylog/notificationcount');
  }
  readAllNotification(notification) {
    return this.http.post('activitylog/update', notification);
  }


  deletNnotifications(id) {
    return this.http.delete('activitylog/delete/' + id);
  }
  fileDonwload(filename: any): Observable<any> {
    return this.https.get(this.apiUrl + 'productfile/download/' + filename, { responseType: 'blob' });
  }

  assignTask(data: any) {
    return this.http.post('taskassignment/save', data);
  }
  projetListWithUser(projetcId: any, eventType: any) {
    return this.http.get('taskassignment/list/' + projetcId + "/" + eventType);
  }
  deleteTaskUsingUserId(id: any) {
    return this.http.delete('taskassignment/delete/' + id);
  }
  taskListWithUser(eventId: any, eventType: any) {
    return this.http.get('taskassignment/task/' + eventId + "/" + eventType);
  }
  saveRole(data) {
    return this.http.post('role/create', data);
  }
  updateRole(id: any, companyId: any, data: any) {
    return this.http.post('role/update/' + id + "/" + companyId, data);
  }
  updateRolePosition(data) {
    return this.http.post('role/update', data);
  }
  rolesList() {
    return this.http.get('role/rolelist');
  }
  deleteRole(id: any) {
    return this.http.delete('role/delete/' + id);
  }
  //widget
  createWidget(data) {
    return this.http.post('widget/save', data);
  }
  updateWidget(id, data) {
    return this.http.post('widget/update/' + id, data);
  }
  deteleWidget(id) {
    return this.http.delete('widget/delete/' + id);
  }
  listWidget() {
    return this.http.get('widget/list');
  }
  // listWidget1() {
  //   return this.http.get('widget/list1');
  // }
  updatePositionWidget(data) {
    return this.http.post('widget/update', data);
  }
  getAllGoalTask(data) {
    return this.http.post('goal/record', data);
  }
  widgetHistory() {
    return this.http.get('widget/list');
  }
  granttChartHistroy(projectId: any) {
    return this.http.get('product/granttChart/' + projectId);
  }
  granttChart(projectId: any) {
    return this.http.get('product/grantt/' + projectId);
  }
  listPermisssion() {
    return this.http.get('permission/groupbylist');
  }
  createPermission(data) {
    return this.http.post('rolehashpermission/save', data);
  }
  permissionList() {
    return this.http.get('rolehashpermission/list');
  }
  permissionListByRoleId(roleId) {
    return this.http.get('rolehashpermission/pemission/' + roleId)
  }
  myPermisssion() {
    return this.http.get('rolehashpermission/mypermission');
  }
  checkSubDomain(domain) {
    return this.http.get('company/checkdomain/' + domain);
  }
  getRoleById(id) {
    return this.http.get('role/get/' + id);
  }
  checkCoupen(coupen) {
    return this.http.get('coupen/getcoupen/' + coupen);
  }
  siteSetting() {
    return this.http.get('sitesetting/getsettingclient');
  }
  planExpiredOrNot() {
    return this.http.get('companytransaction/planexpired');
  }
  checkDuplicate(data) {
    return this.http.post('company/checkduplicate', data);
  }
  contactForm(data) {
    return this.http.post('contact/save', data);
  }
  footerSiteSeeting() {
    return this.http.get('sitesetting/footerSeeting');
  }
  checkLinkValidOrNot(token) {
    return this.http.post('verifcation/verified', token);
  }
  verified() {
    return this.http.get('verifcation/tokenVerified');
  }
  loginBrandig(domain, companyId) {
    return this.http.get('compnaySiteSetting/getsetting/' + domain + "/" + companyId);
  }
  getDomain(token) {
    return this.http.get('company/getdomain/' + token);
  }
  getDomains() {
    return this.http.get('company/getdomain');
  }
  sendToken(data) {
    return this.http.post('cap/token_validate', data);
  }
  createDomainToken(data) {
    return this.http.post('domaintoken/save', data);
  }
  getDomainToken(domain) {
    return this.http.get('domaintoken/domain/' + domain);
  }

  craeteDummyContent(data) {
    return this.http.post('dummy/save', data);
  }
  offlineOnline(data){
    return this.http.post('dummy/offlineOnline', data);
  }
}
