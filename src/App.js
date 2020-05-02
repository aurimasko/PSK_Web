import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";

import AuthRoute from "./components/AuthRoute";
import Home from "./components/Home";
import User from "./components/User";
import Team from "./components/Team";
import CalendarView from "./components/CalendarView";
import Role from "./components/Role";
import RolesList from "./components/RolesList";
import Topic from "./components/Topic";
import TopicsView from "./components/TopicsView";
import Login from "./components/Login";
import NotFound from "./components/NotFound";


function App() {
	return (
		<Router>
			<Switch>
				<AuthRoute path="/home" component={Home} />
				<AuthRoute path="/user/:id" component={User} />
				<AuthRoute path="/team/:id" component={Team} />
				<AuthRoute path="/calendar" component={CalendarView} />
				<AuthRoute path="/roles" component={RolesList} />
				<AuthRoute path="/role/:id" component={Role} />
				<AuthRoute path="/topics" component={TopicsView} />
				<AuthRoute path="/topic/:id" component={Topic} />
				
				<Route path="/login" component={Login} />
				
				<Route exact path="/">
					<Redirect to="/home" />
				</Route>
				<AuthRoute path="*" component={NotFound} />
			</Switch>
		</Router>
	);
}

export default App;
