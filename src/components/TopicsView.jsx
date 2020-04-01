import React from 'react';
import Graph from 'vis-react';


class TopicsView extends React.Component {
	
	constructor(props) {
		
		super(props);
		
		this.state = {
			graph: {
				nodes: [
					{ id: 1, label: 'Task 1' },
					{ id: 2, label: 'Task 2' },
					{ id: 3, label: 'Task 3' },
					{ id: 4, label: 'Task 4' },
					{ id: 5, label: 'Task 5' }
				],
				edges: [
					{ from: 1, to: 2 },
					{ from: 1, to: 3 },
					{ from: 2, to: 4 },
					{ from: 2, to: 5 }
				]
			},
			options: {
				autoResize: true,
				height: '600',
				width: '600',
				
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
						background: "#00FF00",
						hover: "#FFFF00",
						highlight: "#00FFFF",
					},
					labelHighlightBold: false,
				},
				edges: {
					color: '#FF0000'
				},
				interaction: {
					hover: true,
					dragNodes: false,
				}
			},
			events: {
				selectNode: (event) => this.handleClick(event)
			}
		}
		
		this.handleClick = this.handleClick.bind(this);
	}
	
	render() {
		return (
			<Graph
				graph={this.state.graph}
				options={this.state.options}
				events={this.state.events}
			/>
		);
	}
	
	handleClick(event) {
		this.props.history.push("/topic/" + event.nodes);
	}
}


export default TopicsView;