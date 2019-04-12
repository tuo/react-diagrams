import * as React from "react";
import { DiamondNodeModel } from "./DiamondNodeModel";
import { PortWidget } from "storm-react-diagrams";

export interface DiamonNodeWidgetProps {
	node: DiamondNodeModel;
	size?: number;
}

export interface DiamonNodeWidgetState {}

/**
 * @author Dylan Vorster
 */
export class DiamonNodeWidget extends React.Component<DiamonNodeWidgetProps, DiamonNodeWidgetState> {
	public static defaultProps: DiamonNodeWidgetProps = {
		size: 150,
		node: null
	};

	constructor(props: DiamonNodeWidgetProps) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div
				className={"diamond-node"}
				style={{
					position: "relative",
					width: this.props.size,
					height: this.props.size,
					border: "1px solid red",
				}}
			>
				<h1>Test</h1>

				<div
					style={{
						position: "absolute",
						zIndex: 10,
						top: this.props.size - 8,
						left: this.props.size / 2 - 8
					}}
				>
					<PortWidget name="top" node={this.props.node} />
				</div>

				
				<div
					style={{
						position: "absolute",
						zIndex: 10,
						bottom: this.props.size - 8,
						left: this.props.size / 2 - 8
					}}
				>
					<PortWidget name="bottom" node={this.props.node} />
				</div>

			</div>
		);
	}
}
