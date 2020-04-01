import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";

import Home from "./components/Home";
import Topic from "./components/Topic";
import TopicsView from "./components/TopicsView";
import Login from "./components/Login";
import NotFound from "./components/NotFound";


function App() {
	return (
		<Router>
			<Switch>
				<Route path="/home" component={Home} />
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
