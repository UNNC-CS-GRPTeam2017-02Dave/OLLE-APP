import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { ChatPage } from '../pages/chat/chat';
import { CalendarPage } from '../pages/calendar/calendar';
import { ForumPage } from '../pages/forum/forum';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { RegisterPage } from '../pages/register/register';
import { TabsPage } from '../pages/tabs/tabs';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { HttpModule } from '@angular/http';

// Components
import { ContentDrawer } from '../components/content-drawer/content-drawer';


//new
import { NewtopicPage} from '../pages/newtopic/newtopic';
import { ForumService } from '../providers/forum-service/forum-service';
import { ItemDetailPage} from '../pages/item-detail/item-detail';
import { NewreplypostPage} from '../pages/newreplypost/newreplypost';
import { PostService} from '../providers/post-service/post-service';

@NgModule({
  declarations: [
    MyApp,
    LoginPage,
    AccountPage,
    ChatPage,
    CalendarPage,
    ContentDrawer,
    ForumPage,
    RegisterPage,
    TabsPage,
	NewtopicPage,
	ItemDetailPage,
	NewreplypostPage
  ],
  imports: [
    BrowserModule, HttpModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    LoginPage,
    AccountPage,
    ChatPage,
    CalendarPage,
    ForumPage,
    RegisterPage,
    TabsPage,
	NewtopicPage,
	ItemDetailPage,
	NewreplypostPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
	ForumService,
	PostService
  ]
})
export class AppModule {}
