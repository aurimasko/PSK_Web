import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";

import Home from "./components/Home";
import User from "./components/User";
import Team from "./components/Team";
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
				<Route path="/home" component={Home} />
				<Route path="/user/:id" component={User} />
				<Route path="/team/:id" component={Team} />
				<Route path="/roles" component={RolesList} />
				<Route path="/role/:id" component={Role} />
				<Route path="/topics" component={TopicsView} />
				<Route path="/topic/:id" component={Topic} />
				
				<Route path="/login" component={Login} />
				
				<Route exact path="/">
					<Redirect to="/home" />
				</Route>
				<Route path="*" component={NotFound} />
			</Switch>
		</Router>
	);
}

export default App;
