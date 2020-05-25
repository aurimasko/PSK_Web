import React from 'react';
import Layout from "../Layout";
import { teamService } from "../../services/teamService.js";
import Loading from "../../components/Loading";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft } from '@fortawesome/free-solid-svg-icons'
import { languageService } from "../../services/languageService.js";

class ChangeTeamLearningDayLimit extends React.Component {

	constructor(props) {
		super(props);

		this.state = {
			newLearningDayLimit: 0,
			isChangeButtonEnabled: true,
			userId: this.props.match.params.id
		}

		this.handleLearningDayLimitChange = this.handleLearningDayLimitChange.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);

		this.notifRef = React.createRef();
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
		return (
			<Layout ref={this.notifRef}>
				<div className="container wide">

					<div className="flex-right">

						<div className="flex-down margin-right-16 margin-left-8">
							<div className="flex-spacer"></div>
							<Link className="button back-button" to={"/user/" + this.props.match.params.id + "/team"}>
								<FontAwesomeIcon icon={faArrowLeft} />
							</Link>
							<div className="flex-spacer"></div>
						</div>


						<h1>
							{languageService.translate("ChangeTeamLearningDayLimit.Title")}
						</h1>
					</div>

					<form className="flex-down" onSubmit={this.handleSubmit}>

						<label>
							{languageService.translate("ChangeTeamLearningDayLimit.LearningDayLimit")}

							<div className="container" style={{ color: "red" }}> {languageService.translate("ChangeLearningDayLimit.WarningMessage")} </div>
							<input required type="number" value={this.state.newLearningDayLimit} onChange={this.handleLearningDayLimitChange} />
						</label>
						<hr />
						{this.renderChangeButton()}
					</form>
				</div>
			</Layout>
		);
	}

	handleLearningDayLimitChange(event) {
		this.setState({ newLearningDayLimit: event.target.value });
	}

	handleSubmit(event) {
		this.setState({
			isChangeButtonEnabled: false
		});

		teamService.changeTeamLearningDayLimit(this.state.newLearningDayLimit)
			.then((data) => {
				if (data.isSuccess) {
					this.notifRef.current.addNotification({ text: languageService.translate("ChangeTeamLearningDayLimit.SuccessMessage"), isSuccess: true });
					let thisUp = this;

					//Give some time to read message
					setTimeout(function () {
						thisUp.props.history.push("/user/" + thisUp.state.userId + "/team");
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

export default ChangeTeamLearningDayLimit;