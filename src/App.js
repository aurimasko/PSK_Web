import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";

import AuthRoute from "./components/AuthRoute";
import User from "./components/User";
import Team from "./components/Team";
import CalendarView from "./components/CalendarView";
import Role from "./components/Role";
import RolesList from "./components/RolesList";
import Topic from "./components/Topic";
import TopicsView from "./components/TopicsView";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import AddTeamMember from "./components/AddTeamMember";
import EditUser from "./components/EditUser";
import ChangePassword from "./components/ChangePassword";
import ChangeRole from "./components/ChangeRole";


function App() {
	return (
		<Router>
			<Switch>
				{
					//<AuthRoute path="/home" component={Home} />
				}
				<AuthRoute path="/user/:id/calendar" component={CalendarView} />
				<AuthRoute path="/user/:id/topics" component={TopicsView} />
				<AuthRoute path="/user/:id/team/calendar" component={CalendarView} />
				<AuthRoute path="/user/:id/team/topics" component={TopicsView} />
				<AuthRoute path="/user/:id/team/add" component={AddTeamMember} />
				<AuthRoute path="/user/:id/team" component={Team} />
				<AuthRoute path="/user/:id/edit" component={EditUser} />
				<AuthRoute path="/user/:id/changerole" component={ChangeRole} />
				<AuthRoute path="/user/me/changepassword" component={ChangePassword} />
				<AuthRoute path="/user/:id" component={User} />
				<AuthRoute path="/roles" component={RolesList} />
				<AuthRoute path="/role/:id" component={Role} />
				<AuthRoute path="/topics" component={TopicsView} />
				<AuthRoute path="/topic/:id" component={Topic} />
				
				<Route path="/login" component={Login} />
				
				<Route exact path="/">
					<Redirect to={"/user/me/calendar"} />
				</Route>
				<AuthRoute path="*" component={NotFound} />
			</Switch>
		</Router>
	);
}

export default App;
