import React from 'react';
import Graph from 'vis-react';
import Layout from "../Layout";
import Loading from "../../components/Loading";
import { topicFormatHelpers } from "../../helpers/topicFormatHelpers.js";


class TopicsView extends React.Component {
	
	constructor(props) {
		
		super(props);
		
		let style = window.getComputedStyle(document.documentElement);
		
		this.state = {
			topics: null,
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
	
	mapTopicsToGraph() {
		
		let style = window.getComputedStyle(document.documentElement);
		
		let edges = [];
		let userNodes = [];
		
		const topicNodes = this.state.topics.map( (topic) => {
			
			if (topic.parentId !== null) {
				edges.push({ from: topic.id, to: topic.parentId });
			}
			
			let name = topic.name;
			if (name.length > 38) {
				name = name.slice(0, 35) + "...";
			}
			
			let thisTopicNode = {
				id: topic.id,
				label: name
			};
			
			if (topic.learned) {
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
					topic.members !== undefined &&
					topic.members !== null &&
					topic.members.length > 0
				) {
				
				let memberListString = "";
				
				topic.members.forEach((member) => {
					memberListString = memberListString + "👤 " + member.firstName + " " + member.lastName + "\n";
				});
				
				userNodes.push({
					id: topic.id + "_USERS",
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
					from: topic.id + "_USERS",
					to: topic.id,
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
		if (this.state.topics === null) {
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


export default TopicsView;