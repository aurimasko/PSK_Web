import React from 'react';
import {
	BrowserRouter as Router,
	Switch,
	Route,
	Redirect
} from "react-router-dom";

import Home from "./components/Home";
import Login from "./components/Login";
import NotFound from "./components/NotFound";


function App() {
	return (
		<Router>
			<Switch>
				<Route path="/home">
					<Home />
				</Route>
				<Route path="/login">
					<Login />
				</Route>
				
				<Route exact path="/">
					<Redirect to="/home" />
				</Route>
				<Route path="*">
					<NotFound />
				</Route>
			</Switch>
		</Router>
	);
}

export default App;
