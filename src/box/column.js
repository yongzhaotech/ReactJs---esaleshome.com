import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
	Button,
	ButtonToolbar
} from 'react-bootstrap';
import { AdInfo } from '../common/ad-info';

class Column extends Component {
 	render() {
		let hasPreviousColumn = AdInfo.hasPreviousColumn(),
			hasNextColumn = AdInfo.hasNextColumn();

		return hasPreviousColumn || hasNextColumn ? (
			<ButtonToolbar>
			{
				hasPreviousColumn ? (
					<Button bsStyle='success' bsSize='xsmall' onClick={() => AdInfo.toPreviousColumn()}>
						{AdInfo.previousColumn()}
					</Button>
				) : null
			}
			{
				<Button bsSize='xsmall' style={{cursor: 'default'}}>
					{AdInfo.currentColumn()}
				</Button>
			}
			{
				hasNextColumn ? (
					<Button bsStyle='success' bsSize='xsmall' onClick={() => AdInfo.toNextColumn()}>
						{AdInfo.nextColumn()}
					</Button>
				) : null
			}
			</ButtonToolbar>
		) : null;
	};
};

const mapStateToProps = state => ({
	NAVIGATIONCOLUMN: state.NAVIGATIONCOLUMN
});

export default connect(
	mapStateToProps
)(Column);