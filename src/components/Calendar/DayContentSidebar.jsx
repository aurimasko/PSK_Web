import React from 'react';
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faArrowLeft, faGraduationCap } from '@fortawesome/free-solid-svg-icons'
import { learningDayService } from "../../services/learningDayService.js";
import { topicService } from "../../services/topicService.js";
import Loading from "../Loading";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { languageService } from "../../services/languageService.js";

class DayContentSidebar extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			learningDayId: props.currentLearningDayId,
			topics: null,
			learningDay: null,
			isTeam: props.isTeam,
			user: props.user
		};

		this.notifRef = props.notifRef;
	}

	async componentDidMount() {
		this.getData(this.state.learningDayId);
	}

	async componentDidUpdate(prevProps) {
		if (prevProps.currentLearningDayId !== this.props.currentLearningDayId ||
			prevProps.isTeam !== this.props.isTeam ||
			prevProps.user !== this.props.user) {
			this.setState({
				learningDayId: this.props.currentLearningDayId,
				topics: null,
				isTeam: this.props.isTeam,
				user: this.props.user
			});
			this.getData(this.props.currentLearningDayId);
		}
	}

	async getData(id) {
		const result = await learningDayService.fetchLearningDaysById(id);
		if (result.isSuccess === true) {
			this.setState({
				learningDay: result.content[0]
			});
			this.getTopics(result.content[0].topicsId);
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	async getTopics(topicsId) {
		const result = await topicService.fetchTopicByIds(topicsId);
		if (result.isSuccess === true) {
			this.setState({
				topics: result.content
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}

	renderTopics() {
		if (this.state.topics === null) {
			return <Loading width={50} height={50} type={"balls"} />;
		} else {
			return (
				<>
					<h3>{languageService.translate("LearningDaySidebar.LearningDayTopics")}:</h3>

					<ul className="fa-ul margin-top-16 scroll">
						{
							this.state.topics.map((topic) => {
								return (
									<li className="margin-top-8 margin-right-24">
										<Link className="bold" to={"/topic/" + topic.id}>
											<FontAwesomeIcon icon={faGraduationCap} listItem />
											{topic.name}
										</Link>
										<p>
											{topic.references}
										</p>
									</li>
								);
							})
						}
					</ul>
				</>
			);
		}
	}

	renderComments() {
		if (this.state.learningDay.comments) {
			return (
				<>
					<h3 className="margin-top-16">{languageService.translate("LearningDaySidebar.LearningDayComment")}:</h3>

					<p className="">
						<i>{this.state.learningDay.comments}</i>
					</p>
				</>);
		} else {
			return (
				<>
					<h3 className="margin-top-16">{languageService.translate("LearningDaySidebar.LearningDayComment")}:</h3>

					<p className="">
						<i>{languageService.translate("LearningDaySidebar.NoComment")}</i>
					</p>
				</>);
		}
	}

	render() {
		if (this.state.learningDay === null) {
			return <Loading showText={true} />;
		} else {
			return (
				<>

					{this.props.handleUserClose !== undefined ?
						<>
							<div className="flex-right">

								<button className="small-btn-noborder" onClick={this.props.handleUserClose}>
									<FontAwesomeIcon icon={faArrowLeft} />
								</button>

								<h2 className="margin-bottom-16">{this.state.user.firstName} {this.state.user.lastName}:</h2>

							</div>

							<hr />
						</> :
						<></>
					}

					{this.renderTopics()}

					{this.renderComments()}

					<div className="flex-spacer" />
				</>
			);
		}
	}
	
	
}

export default DayContentSidebar;