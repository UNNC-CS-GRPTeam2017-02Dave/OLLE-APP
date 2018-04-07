import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler, IonicPageModule } from 'ionic-angular';
import { MyApp } from './app.component';

import { ChatPage } from '../pages/chat/chat';
import { ChatGenSettingsPage } from '../pages/chat-gen-settings/chat-gen-settings';
import { ChatNewFormPage } from '../pages/chat-new-form/chat-new-form';
import { InstantMessagingPage } from '../pages/chat-m/chat-m';
import { CalendarPage } from '../pages/calendar/calendar';
import { CalendarCreateEventPage } from '../pages/calendar-create-event/calendar-create-event';
import { ForumPage } from '../pages/forum/forum';
import { AccountPage } from '../pages/account/account';
import { AccountUpdateDataPage } from '../pages/account-update-data/account-update-data';
import { AccountUpdatePasswordPage } from '../pages/account-update-password/account-update-password';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { GenericProvider } from '../providers/generic/generic';
import { HttpModule } from '@angular/http';
import { NgCalendarModule } from 'ionic2-calendar';
import { ContentDrawer } from '../components/content-drawer/content-drawer';

// TingTing
import { ForumNewtopicPage } from '../pages/forum-newtopic/forum-newtopic';
import { ForumService } from '../providers/forum-service/forum-service';
import { ForumItemDetailPage } from '../pages/forum-item-detail/forum-item-detail';
import { ForumReplyPage} from '../pages/forum-reply-modal/forum-reply-modal';
import { PostService} from '../providers/post-service/post-service';


@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AccountPage,
    AccountUpdateDataPage,
    AccountUpdatePasswordPage,
    ChatPage,
    ChatGenSettingsPage,
    ChatNewFormPage,
    InstantMessagingPage,
    CalendarPage,
    CalendarCreateEventPage,
    ForumPage,
    RegisterPage,
    TabsPage,
    ContentDrawer,
    ForumNewtopicPage,
    ForumReplyPage,
    ForumItemDetailPage
  ],
  imports: [
    BrowserModule, HttpModule,
    NgCalendarModule,
    IonicModule.forRoot(MyApp),
    IonicPageModule.forChild(ChatGenSettingsPage),
    IonicPageModule.forChild(ChatNewFormPage),
    IonicPageModule.forChild(CalendarCreateEventPage)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AccountPage,
    AccountUpdateDataPage,
    AccountUpdatePasswordPage,
    ChatPage,
    //ChatGenSettingsPage,
    //ChatNewFormPage,
    InstantMessagingPage,
    CalendarPage,
    ForumPage,
    RegisterPage,
    TabsPage,
    ForumNewtopicPage,
    ForumReplyPage,
    ForumItemDetailPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    GenericProvider,
    ForumService,
    PostService
  ]
})
export class AppModule {}
