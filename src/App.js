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
import CalendarUserView from "./components/Calendar/CalendarUserView";
import CalendarTeamView from "./components/Calendar/CalendarTeamView";
import Role from "./components/Role";
import RolesList from "./components/RolesList";
import Topic from "./components/Topic";
import TopicsView from "./components/TopicsView";
import Login from "./components/Login";
import NotFound from "./components/NotFound";
import AccessDenied from "./components/AccessDenied";
import AddTeamMember from "./components/AddTeamMember";
import EditUser from "./components/EditUser";
import ChangePassword from "./components/ChangePassword";
import ChangeRole from "./components/ChangeRole";
import AddTopic from "./components/AddTopic";
import EditTopic from "./components/EditTopic";
import Objectives from "./components/Objectives";
import AddObjective from "./components/AddObjective";
import ChangeSuperVisor from "./components/ChangeSuperVisor";
import ChangeLearningDayLimit from "./components/ChangeLearningDayLimit";
import ChangeTeamLearningDayLimit from "./components/Team/ChangeTeamLearningDayLimit";

function App() {
	return (
		<Router>
			<Switch>
				<AuthRoute path="/user/:id/calendar" component={CalendarUserView} />
				<AuthRoute path="/user/:id/topics" component={TopicsView} />
				<AuthRoute path="/user/:id/objectives/add" component={AddObjective} />
				<AuthRoute path="/user/:id/objectives" component={Objectives} />
				<AuthRoute path="/user/:id/team/calendar" component={CalendarTeamView} />
				<AuthRoute path="/user/:id/team/topics" component={TopicsView} />
				<AuthRoute path="/user/:id/team/add" component={AddTeamMember} />
				<AuthRoute path="/user/:id/team/changelimit" component={ChangeTeamLearningDayLimit} />
				<AuthRoute path="/user/:id/team" component={Team} />
				<AuthRoute path="/user/:id/edit" component={EditUser} />
				<AuthRoute path="/user/:id/changerole" component={ChangeRole} />
				<AuthRoute path="/user/:id/changesupervisor" component={ChangeSuperVisor} />
				<AuthRoute path="/user/:id/changelearningdaylimit" component={ChangeLearningDayLimit} />
				<AuthRoute path="/user/me/changepassword" component={ChangePassword} />
				<AuthRoute path="/user/:id" component={User} />
				<AuthRoute path="/roles" component={RolesList} />
				<AuthRoute path="/role/:id" component={Role} />
				<AuthRoute path="/topics" component={TopicsView} />
				<AuthRoute path="/topic/add" component={AddTopic} />
				<AuthRoute path="/topic/:id/edit" component={EditTopic} />
				<AuthRoute path="/topic/:id" component={Topic} />
				<AuthRoute exact path="/denied" component={AccessDenied} />
				
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
