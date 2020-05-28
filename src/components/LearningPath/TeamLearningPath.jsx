import React from 'react';
import Graph from 'vis-react';
import Layout from "../Layout";
import Loading from "../../components/Loading";
import { topicFormatHelpers } from "../../helpers/topicFormatHelpers.js";
import { analysisService } from "../../services/analysisService.js";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { auth } from "../../services/auth.js";

class TeamLearningPath extends React.Component {
	
	constructor(props) {
		
		super(props);
		
		let style = window.getComputedStyle(document.documentElement);
		
		this.state = {
			summaries: null,
			options: {
				autoResize: true,
				height: "100%",
				width: "100%",
				
				layout: {
					hierarchical: false
				},
				nodes: {
					shape: "box",
					shapeProperties: {
						borderRadius: 0
					},
					borderWidth: 0,
					color: {
						background: style.getPropertyValue("--color-bg-empty"),
						hover: style.getPropertyValue("--color-bg-surface-hover"),
						highlight: style.getPropertyValue("--color-bg-surface-active"),
					},
					labelHighlightBold: false,
				},
				edges: {
					color: style.getPropertyValue("--color-fg-regular")
				},
				interaction: {
					hover: true,
					dragNodes: false,
				}
			},
			events: {
				selectNode: (event) => this.handleClick(event)
			},
			physics: {
				barnesHut: {
					springLength: 160,
					centralGravity: 0.1,
					avoidOverlap: 1,
					damping: 0.05
				},
				minVelocity: 2
			}
		}
		
		this.handleClick = this.handleClick.bind(this);
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
		let id = this.props.match.params.id === "me" ? auth.user.id : this.props.match.params.id;
		let result = await analysisService.fetchTopicsTeam(id);
		if (result.isSuccess === true) {
			this.setState({
				summaries: result.content.learnedTopicsSummary
			});
		} else {
			this.notifRef.current.addNotification({ text: responseHelpers.convertErrorArrayToString(result) });
		}
	}
	
	mapTopicsToGraph() {
		
		let style = window.getComputedStyle(document.documentElement);
		
		let edges = [];
		let userNodes = [];
		
		const topicNodes = this.state.summaries.map( (summary) => {
			
			if (summary.topic.parentId !== null) {
				edges.push({ from: summary.topic.id, to: summary.topic.parentId });
			}
			
			let name = summary.topic.name;
			if (name.length > 38) {
				name = name.slice(0, 35) + "...";
			}
			
			let thisTopicNode = {
				id: summary.topic.id,
				label: name
			};
			
			if (summary.topic.learned) {
				thisTopicNode.color = {
					background: style.getPropertyValue("--color-bg-primary"),
					hover: style.getPropertyValue("--color-bg-primary-hover"),
					highlight: style.getPropertyValue("--color-bg-primary-active")
				};
				thisTopicNode.font = {
					color: style.getPropertyValue("--color-fg-primary"),
					strokeWidth: 0.5
				};
			}
			
			if (
					summary.members !== undefined &&
					summary.members !== null &&
					summary.members.length > 0
				) {
				
				let memberListString = "";
				
				summary.members.forEach((member) => {
					memberListString = memberListString + "👤 " + member.firstName + " " + member.lastName + "\n";
				});
				
				userNodes.push({
					id: summary.topic.id + "_USERS",
					label: memberListString.trim(),
					color: {
						border: style.getPropertyValue("--color-bg-empty"),
						background: style.getPropertyValue("--color-bg-surface"),
						hover: style.getPropertyValue("--color-bg-empty"),
						highlight: style.getPropertyValue("--color-bg-empty")
					},
					borderWidth: 3
				});

				edges.push({
					from: summary.topic.id + "_USERS",
					to: summary.topic.id,
					arrows: {
						to: {
							enabled: false
						}
					}
				});
			};
			
			return thisTopicNode;
		});
		
		return {
			nodes: topicNodes.concat(userNodes),
			edges: edges
		};
	}
	
	render() {
		if (this.state.summaries === null) {
			return (
				<Layout ref={this.notifRef}>
					<Loading showText={true} />
				</Layout>
			);
		}
		else {
			return (
				<Layout noScroll={true}>
					
					<div className="graph-container">
						<Graph
							graph={this.mapTopicsToGraph()}
							options={this.state.options}
							events={this.state.events}
						/>
					</div>
					
				</Layout>
			);
		}
	}
	
	handleClick(event) {
		if (event.nodes.indexOf("_USERS") === 0) {
			this.props.history.push("/topic/" + event.nodes);
		}
	}
}


export default TeamLearningPath;