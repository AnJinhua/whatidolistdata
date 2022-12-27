import React from 'react'
import { Route, Switch } from 'react-router-dom'

// Import miscellaneous routes and other requirements
import NotFoundPage from '../pages/not-found-page'

// Import static pages

import ExpertNotFound from '../pages/ExpertNotFound/ExpertNotFound'
import HomePage from '../pages/Home/HomePage'
import MapPage from '../pages/Map/MapPage'

// import Forum from '../pages/forum'
import Forum from '../pages/forum'
import ContactPage from '../pages/contact-page'

import ExpertsListingPage from '../pages/ExpertListing/expertListingPage'
import ViewExpert from '../pages/expert/index'

// import EditExpert from '../pages/editable-expert'
// import UserSessionPage from '../components/dashboard/user-session-page'
// import ExpertSessionPage from '../components/dashboard/expert-session-page'

import HowItWorks from '../pages/how-it-works'
import ExpertSignupPage from '../components/auth/expert-signup'

// Import authentication related pages

import Login from '../components/auth/login'
import LoginSocial from '../components/auth/login-social'
import Logout from '../components/auth/logout'
import ForgotPassword from '../components/auth/ForgotPassword'
import ResetPassword from '../components/auth/reset_password'
import BillingSettings from '../components/billing/settings'

// admin

import ViewProfile from '../pages/profile/viewProfile'
// import AccountInformation from '../components/dashboard/account-information'
// import UserProfileUpdation from '../components/dashboard/UserProfileUpdation'

/* Import billing pages */
import InitialCheckout from '../components/billing/initial-checkout'

/* Import admin pages */
// import AdminDashboard from '../components/admin/dashboard'

/* Import rooms page */
import RoomsPage from '../components/audioChat/RoomsPage'

/* Import higher order components */
import RequireAuth from '../components/auth/require_auth'
// import MysessionList from "../components/dashboard/mysession-list";
import Recordings from '../pages/experts-recordings'
// import DashboardRoute from "./dashboard";
import TwillioVideoCall from '../pages/video/twilioVideo'
import TwillioVoiceCall from '../pages/audioCall/twilioAudio'
import Messenger from '../pages/Messenger'
import CommunityStories from '../pages/CommunityStories'
import MessengerScreen from '../pages/MessengerScreen'
import FinishSignUp from '../components/auth/SignUp/FinshSignUp'
import Signup from '../components/auth/signup'
import CommunityStoryPage from '../pages/CommunityStoryPage'
import ZoomPage from '../pages/ZoomPage'
import ProfileStoryPage from '../pages/ProfileStoryPage'
import TransactionPage from '../pages/TransactionPage'
import PaymentSettingsPage from '../pages/PaymentSettingsPage'
import EditProfile from '../pages/EditProfile'

const Routes = () => {
  return (
    <Switch>
      <Route path='/how-it-works' component={HowItWorks} />
      <Route path='/video-session/:id' component={TwillioVideoCall} />
      <Route path='/audio-session/:id' component={TwillioVoiceCall} />
      <Route path='/map' component={MapPage} />
      <Route path='/zoom/:value' component={ZoomPage} />
      <Route
        exact
        path='/community-stories/:value'
        component={CommunityStories}
      />
      <Route
        path='/community-stories/:value/:id'
        component={CommunityStoryPage}
      />

      <Route path='/profile/story/:id' component={ProfileStoryPage} />
      <Route path='/transaction-history/:slug' component={TransactionPage} />
      <Route path='/payment-settings/:slug' component={PaymentSettingsPage} />

      <Route path='/forum' component={Forum} />
      <Route path='/list/:category' component={ExpertsListingPage} />
      <Route path='/expert-signup/:token' component={ExpertSignupPage} />
      <Route path='/contact-us' component={ContactPage} />
      <Route path='/register/:email' component={Signup} />
      <Route path='/finishsignUp/:email' component={FinishSignUp} />
      <Route path='/login' component={Login} />
      <Route path='/login-social' component={LoginSocial} />
      <Route path='/logout' component={Logout} />
      <Route path='/forgot-password' component={ForgotPassword} />
      <Route path='/reset-password/:resetToken' component={ResetPassword} />

      {/* <Route path="/mysession-list" component={MysessionList} /> */}

      <Route path='/checkout/:plan' component={RequireAuth(InitialCheckout)} />
      <Route
        path='/billing/settings'
        component={RequireAuth(BillingSettings)}
      />
      {/* <Route path='/profile2' component={ViewProfile} /> */}
      <Route path='/profile' component={RequireAuth(ViewProfile)} />
      {/* <Route
        path='/update-profile'
        component={RequireAuth(UserProfileUpdation)}
      /> */}
      <Route path='/expert/:category/:slug' component={ViewExpert} />
      <Route
        // path='/edit/expert/:category/:slug'
        path='/edit/expert/:slug'

        component={EditProfile}
      />
      {/* <Route path='/session/:slug' component={RequireAuth(UserSessionPage)} /> */}
      {/* <Route
        path='/mysession/:slug'
        component={RequireAuth(ExpertSessionPage)}
      /> */}
      <Route path='/recordings' component={RequireAuth(Recordings)} />
      <Route
        path='/messages/:categories/:conversationID'
        component={RequireAuth(MessengerScreen)}
      />
      <Route path='/messages' component={RequireAuth(Messenger)} />

      {/* <Route path='/admin' component={RequireAuth(AdminDashboard)} /> */}
      {/* <Route path='/account-info' component={RequireAuth(AccountInformation)} /> */}
      {/* <Route path="/dashboard" component={DashboardRoute} /> */}
      <Route path='/expert-notfound' component={ExpertNotFound} />

      <Route path='/rooms' component={RoomsPage} />

      <Route exact path='/' component={HomePage} />
      <Route path='*' component={NotFoundPage} />
    </Switch>
  )
}

export default Routes
