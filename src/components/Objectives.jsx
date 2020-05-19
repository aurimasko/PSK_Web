import React from 'react';
import Layout from "./Layout";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCheck, faTimes, faCheckDouble, faTrashAlt } from '@fortawesome/free-solid-svg-icons'
import Loading from "../components/Loading";

class Objectives extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			user: {
				id: "tempvalue"
			},
			objectives: [
				{
					id: 1,
					name: "Flutter",
					date: "2020-20-20",
					status: "created" // "created", "declined", "accepted", "done" 
				},
				{
					id: 2,
					name: "Foundation",
					date: "2019-22-33",
					status: "declined"
				},
				{
					id: 1,
					name: "CSS grid",
					date: "2022-22-22",
					status: "accepted"
				},
				{
					id: 2,
					name: "Bootstrap",
					date: "2012-22-13",
					status: "done"
				}
			]
		};

		this.notifRef = React.createRef();
		
		this.handleAccept = this.handleAccept.bind(this);
		this.handleDecline = this.handleDecline.bind(this);
		this.handleFinish = this.handleFinish.bind(this);
		this.handleDelete = this.handleDelete.bind(this);
	}
	
	render() {
		return (
			<Layout ref={this.notifRef}>
				<div className="container wide">

					<div className="flex-right">

						<div className="flex-down margin-right-16 margin-left-8">
							<div className="flex-spacer"></div>
							
							<div className="flex-spacer"></div>
						</div>


						<h1>
							Vardaitis Pavardaitis's objectives
						</h1>
					</div>

					{this.renderObjectivesList()}
					
					<Link className="button primary margin-top-32" to={"/user/" + this.state.user.id + "/objectives/add"}>
						Add new objective
					</Link>
				</div>
			</Layout>
		);
	}
	
	renderObjectivesList() {
		
		if (this.state.objectives === null) {
			return <Loading />;
		}
		
		if (this.state.objectives.length === 0) {
			return "There are no objectives";
		}
		
		const listItems = this.state.objectives.map((objective) =>
			<li className="margin-top-16 flex-right flex-wrap" key={objective.id}>
				
				<div>
					<div>
						<span className="bold">Topic: </span>
						<Link className="bold" to={"/topic/" + objective.id}>
							{objective.name}
						</Link>
					</div>
					
					<div>
						<span className="bold">Date: </span>
						{objective.date}
					</div>
					<div>
						<span className="bold">Status: </span>
						{objective.status}
					</div>
				</div>
				
				{this.renderListItemButtons(objective.status)}
			</li>
		);
		
		return (
			<div className="margin-left-32 margin-top-24">
				{listItems}
			</div>
		);
	}
	
	renderListItemButtons(status) {
		
		let extraButtons;
		
		if (status === "created") {
			extraButtons = (
				<>
					<button className="button" onClick={this.handleAccept}>
						<div>
							<FontAwesomeIcon icon={faCheck} />
						</div>
						Accept
					</button>
					<button className="button" onClick={this.handleDecline}>
						<div>
							<FontAwesomeIcon icon={faTimes} />
						</div>
						Decline
					</button>
				</>
			);
		}
		
		if (status === "accepted") {
			extraButtons = (
				<button className="button" onClick={this.handleFinish}>
					<div>
						<FontAwesomeIcon icon={faCheckDouble} />
					</div>
					Finished
				</button>
			);
		}
		
		return (
			<div className="flex-right flex-wrap flex-spacer">
				<div className="flex-spacer" />
				{extraButtons}
				
				
				<button className="button" onClick={this.handleDelete}>
					<div>
						<FontAwesomeIcon icon={faTrashAlt} />
					</div>
					Delete
				</button>
			</div>
		);
	};
	
	handleAccept(id) {
		alert("accept functionality is not implemented");
	}
	
	handleDecline(id) {
		alert("decline functionality is not implemented");
	}
	
	handleFinish(id) {
		alert("finish functionality is not implemented");
	}
	
	handleDelete(id) {
		alert("delete functionality is not implemented");
	}
}

export default Objectives;