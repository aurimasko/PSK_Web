import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'


class DayContentSidebar extends React.Component {
	
	constructor(props) {
		super(props);
		
		this.state = {
			topics: [],
			comment: ""
		};
		
		this.handleCommentChange = this.handleCommentChange.bind(this);
		this.handleTopicAdd = this.handleTopicAdd.bind(this);
		this.handleTopicRemove = this.handleTopicRemove.bind(this);
		this.handleSubmit = this.handleSubmit.bind(this);
	}
	
	render() {
		return (
			<>
				
				<form className="flex-down flex-spacer" onSubmit={this.handleSubmit}>
					Learning day topics
					{this.renderSelectedTopics()}
					
					<label>
						Select to add more
						<select value={0} onChange={this.handleTopicAdd}>
							<option value="0" disabled> -- select an option -- </option> {/* value kituose cj bus id */}
							<option>React.js portals</option>
							<option>Docker</option>
							<option>CSS grid</option>
						</select>
					</label>
					<label>
						Learning day comment
						
						<textarea onChange={this.handleCommentChange}></textarea>
					</label>
					
					<div className="flex-spacer" />
					
					<hr />
					<input className="primary" type="submit" value="Save"/>
				</form>
					
				
			</>
		);
	}
	
	renderSelectedTopics() { // Todo: reik pakeist kad naudotų topic tekstą ir id
		
		if (this.state.topics.length === 0) {
			return <i>no topics selected</i>;
		}
		
		const topics = this.state.topics.map( (topic, index) => {
				return (
					<div key={index} className="flex-right">
						{topic}
						<div className="flex-spacer" />
						<button className="small-btn-noborder" onClick={(e) => {this.handleTopicRemove(index, e)}}>
							<FontAwesomeIcon icon={faTimes} />
						</button>
					</div>
				);
			}
		);
		
		return topics;
	}
	
	
	handleCommentChange(event) {
		this.setState({comment: event.target.value});
	}
	
	handleTopicAdd(event) {
		event.preventDefault();
		let newTopics = this.state.topics;
		newTopics.push(event.target.value);
		
		this.setState({ topics: newTopics});
	}
	
	handleTopicRemove(index, e) {
		e.preventDefault();
		
		let newTopics = this.state.topics;
		newTopics.splice(index, 1);
		
		this.setState({ topics: newTopics});
	}
	
	handleSubmit(event) {
		event.preventDefault();
		this.props.handleExitEditMode();
	}
}

export default DayContentSidebar;