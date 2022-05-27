import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AboutComponent } from './about/about.component';
import { AccVerificationComponent } from './acc-verification/acc-verification.component';
import { BlogComponent } from './blog/blog.component';
import { ChatCommunicationComponent } from './chat-communication/chat-communication.component';
import { CommunicationComponent } from './communication/communication.component';
import { ContactComponent } from './contact/contact.component';
import { CustomerSatisfactionComponent } from './customer-satisfaction/customer-satisfaction.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { FailComponent } from './fail/fail.component';
import { FaqComponent } from './faq/faq.component';
import { FeaturesComponent } from './features/features.component';
import { ForgetChangePasswordComponent } from './forget-change-password/forget-change-password.component';
import { ForgetPasswordComponent } from './forget-password/forget-password.component';
import { DemoComponent } from './gantt-chart/demo/demo.component';
import { GanttChartComponent } from './gantt-chart/gantt-chart.component';
import { HomeComponent } from './home/home.component';
import { IntakeFormComponent } from './intake-form/intake-form.component';
import { LiveDemoComponent } from './live-demo/live-demo.component';
import { LoaderComponent } from './loader/loader.component';
import { LoginComponent } from './login/login.component';
import { MsaComponent } from './msa/msa.component';
import { MyAccountComponent } from './my-account/my-account.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { NotificationsComponent } from './notifications/notifications.component';
import { OrderSummaryComponent } from './order-summary/order-summary.component';
import { PlanPriceComponent } from './plan-price/plan-price.component';
import { PriceComponent } from './price/price.component';
import { PrivacyPolicyComponent } from './privacy-policy/privacy-policy.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { ProductKanbanComponent } from './product-kanban/product-kanban.component';
import { ProductsComponent } from './products/products.component';
import { ResionManagementComponent } from './resion-management/resion-management.component';
import { RoleManagementComponent } from './role-management/role-management.component';
import { RolePermissionMasterComponent } from './role-permission-master/role-permission-master.component';
import { SecurityComponent } from './security/security.component';
import { AuthGuard } from './service/auth.guards';
import { SignupComponent } from './signup/signup.component';
import { SuccessComponent } from './success/success.component';
import { SystemManagementComponent } from './system-management/system-management.component';
import { TermsComponent } from './terms/terms.component';
import { TrackMonitorComponent } from './track-monitor/track-monitor.component';
import { TransactionListComponent } from './transaction-list/transaction-list.component';
import { UpgradePlanPriceComponent } from './upgrade-plan-price/upgrade-plan-price.component';
import { UserManagementComponent } from './user-management/user-management.component';
import { WorkstreamManagementComponent } from './workstream-management/workstream-management.component';

const routes: Routes = [
  { path: '', component: HomeComponent, pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent},
  { path: 'dashboard/:token', component: DashboardComponent },
  { path: 'user-management', component: UserManagementComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'product-detail', component: ProductDetailComponent },
  { path: 'product-detail/:id', component: ProductDetailComponent },
  { path: 'product-kanban', component: ProductKanbanComponent },
  { path: 'product-kanban/:id', component: ProductKanbanComponent },
  { path: 'gantt-chart', component: GanttChartComponent },
  { path: 'gantt-chart/:id', component: GanttChartComponent },
  { path: 'communication', component: CommunicationComponent },
  { path: 'role-management', component: RoleManagementComponent },
  { path: 'role-master', component: RolePermissionMasterComponent },
  { path: 'workstream-management', component: WorkstreamManagementComponent },
  { path: 'region-management', component: ResionManagementComponent },
  { path: 'track-monitor', component: TrackMonitorComponent },
  { path: 'system-management', component: SystemManagementComponent },
  { path: 'my-account', component: MyAccountComponent },
  { path: 'notifications', component: NotificationsComponent },
  { path: 'plan-price', component: PlanPriceComponent },
  { path: 'demo', component: LoaderComponent },
  { path: 'forgot-password', component: ForgetPasswordComponent },
  { path: 'forgot-change-pass/:token', component: ForgetChangePasswordComponent },
  { path: 'order-summary', component: OrderSummaryComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'fail', component: FailComponent },
  { path: 'pricing', component: PlanPriceComponent },
  { path: 'not-found', component: NotFoundComponent },
  { path: 'price', component: PriceComponent },
  { path: 'transaction', component: TransactionListComponent },
  { path: 'UpgradePlanPrice', component: UpgradePlanPriceComponent },
  { path: 'terms-conditions', component: TermsComponent },
  { path: 'contact', component: ContactComponent },
  // { path: 'UpgradePlanPrice', component: UpgradePlanPriceComponent },
  { path: 'chat-support', component: ChatCommunicationComponent },
  { path: 'security', component: SecurityComponent },
  { path: 'privacy-policy', component: PrivacyPolicyComponent },
  { path: 'msa', component: MsaComponent },
  { path: 'FAQs', component: FaqComponent },
  { path: 'intake-form', component:IntakeFormComponent },
  { path: 'customer-satisfaction', component:CustomerSatisfactionComponent },
  { path: 'demo', component:DemoComponent },
  { path: 'about', component:AboutComponent },
  { path: 'features', component:FeaturesComponent },
  { path: 'live-demo', component:LiveDemoComponent },
  { path: 'accverification/:token', component:AccVerificationComponent },
  { path: '**', component:BlogComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
