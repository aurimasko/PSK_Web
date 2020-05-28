import React from 'react';
import Graph from 'vis-react';
import Layout from "../Layout";
import Loading from "../../components/Loading";
import { topicFormatHelpers } from "../../helpers/topicFormatHelpers.js";
import { analysisService } from "../../services/analysisService.js";
import { responseHelpers } from "../../helpers/responseHelpers.js";
import { auth } from "../../services/auth.js";

class UserLearningPath extends React.Component {
	
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
		let result = await analysisService.fetchTopicsUser(id);
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
		
		const nodes = this.state.summaries.map( (summary) => {
			
			if (summary.topic.parentId !== null) {
				edges.push({ from: summary.topic.id, to: summary.topic.parentId });
			}

			if (summary.learned) {
				return {
					id: summary.topic.id,
					label: summary.topic.name,
					color: {
						background: style.getPropertyValue("--color-bg-primary"),
						hover: style.getPropertyValue("--color-bg-primary-hover"),
						highlight: style.getPropertyValue("--color-bg-primary-active")
					},
					font: {
						color: style.getPropertyValue("--color-fg-primary"),
						strokeWidth: 0.5
					}
				};
			}
			else {
				return {
					id: summary.topic.id,
					label: summary.topic.name
				};
			}
		});
		
		return {
			nodes: nodes,
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
		this.props.history.push("/topic/" + event.nodes);
	}
}


export default UserLearningPath;