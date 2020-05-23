import React from 'react';
import Layout from "./Layout";
import { userService } from "../services/userService.js";
import { roleService } from "../services/roleService.js";
import { auth } from "../services/auth.js";
import Loading from "../components/Loading";
import { responseHelpers } from "../helpers/responseHelpers.js";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { languageService } from "../services/languageService.js";

class ChangeLearningDayLimit extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			user: null,
			newLearningDayLimit: null,
			isChangeButtonEnabled: true
		}

		this.handleLearningDayLimitChange = this.handleLearningDayLimitChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.notifRef = React.createRef();
	}

	async componentDidMount() {
		this.getData();
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.match.params.id !== this.props.match.params.id) {
			this.getData();
		}
	}

	async getData() {
		let id = this.props.match.params.id;
		let result = await userService.fetchUserById(id);
		if (result.isSuccess === true) {
			this.setState({
				user: result.content[0],
				newLearningDayLimit: result.content[0].learningDayLimitPerQuarter
			});

		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
			return;
		}
	}

	renderChangeButton() {
		if (this.state.isChangeButtonEnabled) {
			return (
				<button className="primary" type="submit" disabled={!this.state.isChangeButtonEnabled}>
					{languageService.translate("Change")}
				</button>
			);
		} else {
			return <Loading width={50} height={50} type={"balls"} />;
		}
	}

	render() {
		if (this.state.user == null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		} else {
			return (
				<Layout ref={this.notifRef}>
					<div className="container wide">

						<div className="flex-right">

							<div className="flex-down margin-right-16 margin-left-8">
								<div className="flex-spacer"></div>
								<Link className="button back-button" to={"/user/" + this.props.match.params.id}>
									<FontAwesomeIcon icon={faArrowLeft} />
								</Link>
								<div className="flex-spacer"></div>
							</div>


							<h1>
								{languageService.translate("ChangeLearningDayLimit.Title", { name: this.state.user.firstName + " " + this.state.user.lastName })}
							</h1>
						</div>

						<form className="flex-down" onSubmit={this.handleSubmit}>

							<label>
								{languageService.translate("ChangeLearningDayLimit.LearningDayLimit")}
								
								{/*if admin show warning message*/!this.state.user.superVisorId ? <div className="container" style={{ color: "red" }}> {languageService.translate("ChangeLearningDayLimit.AdminWarningMessage")} </div> : ""}
								<input required type="number" value={this.state.newLearningDayLimit} onChange={this.handleLearningDayLimitChange} />
							</label>
							<hr />
							{this.renderChangeButton()}
						</form>
					</div>
				</Layout>
			);
		}
	}

	handleLearningDayLimitChange(event) {
		this.setState({ newLearningDayLimit: event.target.value });
	}

	handleSubmit(event) {
		this.setState({
			isChangeButtonEnabled: false
		});

		let userToUpdate = this.state.user;

		userToUpdate.learningDayLimitPerQuarter = this.state.newLearningDayLimit;

		userService.updateUser(userToUpdate)
			.then((data) => {
				if (data.isSuccess) {
					this.notifRef.current.addNotification({ text: languageService.translate("ChangeLearningDayLimit.SuccessMessage"), isSuccess: true });
					let thisUp = this;

					//if admin, update the auth user
					if (auth.user.id === this.state.user.id) {
						auth.user = data.content[0];
					}

					//Give some time to read message
					setTimeout(function () {
						thisUp.props.history.push("/user/" + thisUp.state.user.id);
					}, 1000);
				} else {
					this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(data) });
				}

				this.setState({
					isChangeButtonEnabled: true
				});
			});

		event.preventDefault();
	}
}

export default ChangeLearningDayLimit;