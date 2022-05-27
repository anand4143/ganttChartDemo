import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { BrowserModule,Title  } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CarouselModule } from 'ngx-owl-carousel-o';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { SidenavComponent } from './sidenav/sidenav.component';
import { DHeaderComponent } from './d-header/d-header.component';
import { HeaderComponent, liveDemoModal } from './header/header.component';
import { FooterComponent } from './footer/footer.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatIconModule } from '@angular/material/icon';
import { MatSelectModule } from '@angular/material/select';
import { ToastrModule } from 'ngx-toastr';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { MatFormFieldModule } from '@angular/material/form-field';
import { DiscussionForumComponent } from './discussion-forum/discussion-forum.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatStepperModule } from '@angular/material/stepper';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { UserManagementComponent } from './user-management/user-management.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { MatInputModule } from '@angular/material/input';
import { TokenInterceptorService } from './service/token-interceptor.service';
import { ProductsComponent } from './products/products.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

import { RoleManagementComponent } from './role-management/role-management.component';
import { MatTabsModule } from '@angular/material/tabs';
import { ProductKanbanComponent } from './product-kanban/product-kanban.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatMenuModule } from '@angular/material/menu';
import { RolePermissionMasterComponent } from './role-permission-master/role-permission-master.component';
import { WorkstreamManagementComponent } from './workstream-management/workstream-management.component';
import { ResionManagementComponent } from './resion-management/resion-management.component';
import { TrackMonitorComponent } from './track-monitor/track-monitor.component';
import { CommunicationComponent } from './communication/communication.component';
import { SystemManagementComponent } from './system-management/system-management.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MyAccountComponent } from './my-account/my-account.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { TimeAgoPipe } from './service/time-ago.pipe';
import { MentionModule } from 'angular-mentions';
import { SocketIoConfig, SocketIoModule } from 'ngx-socket-io';
import { NgxSpinnerModule } from 'ngx-spinner';
import { environment } from 'src/environments/environment';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { PlanPriceComponent } from './plan-price/plan-price.component';
import { AngularMultiSelectModule } from 'angular2-multiselect-dropdown';
import { SortPipe } from './sort.pipe';
import { ChatBoxComponent } from './chat-box/chat-box.component'
import { LoaderComponent } from './loader/loader.component';
import { DataService } from './service/data.service';
import { Loader1Component } from './loader1/loader1.component';
import { Loader2Component } from './loader2/loader2.component';
import { Loader3Component } from './loader3/loader3.component';
// import { TreeViewModule } from '@syncfusion/ej2-angular-navigations';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCheckboxModule } from '@angular/material/checkbox';
// import { ExcelExportService, ToolbarService } from '@syncfusion/ej2-angular-treegrid';
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { ForgetChangePasswordComponent } from './forget-change-password/forget-change-password.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgGanttEditorModule } from 'ng-gantt'
import { SuccessComponent } from './success/success.component';
import { FailComponent } from './fail/fail.component';
import { PriceComponent } from './price/price.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { ContactComponent } from './contact/contact.component';
import { UpgradePlanPriceComponent } from './upgrade-plan-price/upgrade-plan-price.component';
import { SecurityComponent } from './security/security.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { MsaComponent } from './msa/msa.component';
import { TermsComponent } from './terms/terms.component';
import { SidsortPipe } from './sidsort.pipe';
import { FaqComponent } from './faq/faq.component';
import { MatDialogModule } from '@angular/material/dialog';
import { AccVerificationComponent } from './acc-verification/acc-verification.component';
import { ChatCommunicationComponent } from './chat-communication/chat-communication.component';
import { RecaptchaModule, RecaptchaFormsModule } from 'ng-recaptcha';
import { IntakeFormComponent } from './intake-form/intake-form.component';
import { CustomerSatisfactionComponent } from './customer-satisfaction/customer-satisfaction.component';

import { AboutComponent } from './about/about.component';
import { FeaturesComponent } from './features/features.component';
import { DemoComponent } from './gantt-chart/demo/demo.component';
import { LiveDemoComponent } from './live-demo/live-demo.component';
import {Ng2TelInputModule} from 'ng2-tel-input';
import { NgxIntlTelInputModule } from 'ngx-intl-tel-input';
import { AuthGuard } from './service/auth.guards';
import { MatSelectFilterModule } from 'mat-select-filter';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { BlogComponent } from './blog/blog.component';
import { SanetizeHtmlPipe } from './service/sanetize-html.pipe';
import {ButtonModule} from '@syncfusion/ej2-angular-buttons';
import { DropDownListAllModule } from '@syncfusion/ej2-angular-dropdowns';
import { ScrollToBottomDirective } from './scroll-to-bottom.directive';
import { NgxPrintModule} from "ngx-print";

// import { ToolbarService, PdfExportService, SelectionService } from '@syncfusion/ej2-angular-gantt';
import { FilterService, GanttModule } from '@syncfusion/ej2-angular-gantt';
import { ToolbarService, ExcelExportService, SelectionService,PdfExportService } from '@syncfusion/ej2-angular-gantt';
import { GctesterComponent } from './gctester/gctester.component';

const connectionOptions = {
  "force new connection": true,
  reconnection: true,
  forceJSONP: false,
  requestTimeout: 10000,
  transports: ["websocket"]
};
const config: SocketIoConfig = {
  url: environment.socketUrl,
  options: connectionOptions
};

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    LoginComponent,
    SignupComponent,
    DashboardComponent,
    SidenavComponent,
    DHeaderComponent,
    HeaderComponent,
    FooterComponent,
    DiscussionForumComponent,
    UserManagementComponent,
    ProductsComponent,
    ProductDetailComponent,
    RoleManagementComponent,
    ProductKanbanComponent,
    GanttChartComponent,
    TimeAgoPipe,
    CommunicationComponent,
    RolePermissionMasterComponent,
    WorkstreamManagementComponent,
    ResionManagementComponent,
    TrackMonitorComponent,
    SystemManagementComponent,
    MyAccountComponent,
    NotificationsComponent,
    PlanPriceComponent,
    SortPipe,
    ChatBoxComponent,
    LoaderComponent,
    Loader1Component,
    Loader2Component,
    Loader3Component,
    ForgetPasswordComponent,
    ForgetChangePasswordComponent,
    OrderSummaryComponent,
    SuccessComponent,
    FailComponent,
    PriceComponent,
    NotFoundComponent,
    TransactionListComponent,
    ContactComponent,
    UpgradePlanPriceComponent,
    SecurityComponent,
    PrivacyPolicyComponent,
    MsaComponent,
    TermsComponent,
    SidsortPipe,
    FaqComponent,
    liveDemoModal,
    AccVerificationComponent,
    ChatCommunicationComponent,
    IntakeFormComponent,
    CustomerSatisfactionComponent,

    AboutComponent,
    FeaturesComponent,
    DemoComponent, LiveDemoComponent, BlogComponent, SanetizeHtmlPipe, ScrollToBottomDirective, GctesterComponent
    // DemoChatComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    CommonModule,
    ReactiveFormsModule,
    CarouselModule,
    HttpClientModule,
    FormsModule,
    MatSidenavModule,
    MatToolbarModule,
    DragDropModule,
    MatIconModule,
    MatSelectModule,
    MentionModule,
    ButtonModule,DropDownListAllModule,
    SocketIoModule.forRoot(config),
    ToastrModule.forRoot({
      timeOut: 3000,
      positionClass: 'toast-top-center',
      preventDuplicates: true,
    }),
    TreeGridModule,
    MatProgressSpinnerModule,
    AngularMultiSelectModule,
    MatFormFieldModule,
    MatChipsModule,
    MatStepperModule,
    FormsModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatInputModule,
    MatTabsModule,
    MatSlideToggleModule,
    MatTooltipModule,
    MatDatepickerModule,
    MatNativeDateModule,
    NgbModule,
    MatExpansionModule,
    MatMenuModule,
    NgxSpinnerModule,
    MatCheckboxModule,
    NgxPayPalModule,
    MatDialogModule,
    RecaptchaModule,  //this is the recaptcha main module
    RecaptchaFormsModule,
    NgGanttEditorModule,
    Ng2TelInputModule ,NgxIntlTelInputModule, MatFormFieldModule,
    MatSelectFilterModule,CKEditorModule,
    NgxPrintModule,
    GanttModule
  ],
  entryComponents: [
    ChatBoxComponent
  ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  exports: [MatExpansionModule],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: TokenInterceptorService, multi: true }, SidsortPipe, DatePipe, DataService,AuthGuard,Title,ToolbarService,FilterService, PdfExportService, SelectionService,ExcelExportService],  bootstrap: [AppComponent]
})
// 
export class AppModule { }




