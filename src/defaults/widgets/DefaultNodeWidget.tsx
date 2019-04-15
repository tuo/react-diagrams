import * as React from "react";
import * as _ from "lodash";
import { DefaultNodeModel } from "../models/DefaultNodeModel";
import { DefaultPortLabel } from "./DefaultPortLabelWidget";
import { DiagramEngine } from "../../DiagramEngine";
import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";
import { Step } from "../../Step";

export interface DefaultNodeProps extends BaseWidgetProps {
	node: DefaultNodeModel;
	diagramEngine: DiagramEngine;
}

export interface DefaultNodeState {}

/**
 * @author Dylan Vorster
 */
export class DefaultNodeWidget extends BaseWidget<DefaultNodeProps, DefaultNodeState> {
	constructor(props: DefaultNodeProps) {
		super("srd-default-node", props);
		this.state = {};
	}

	generatePort(port) {
		return <DefaultPortLabel model={port} key={port.id} />;
	}

	generateBody(stepText) {
		return <p key={stepText}>{stepText}</p>;
	}

	// generatePortStep(action) {
	// 	return <DefaultPortLabel model={action} key={action.text} />;
	// }


	render() {
		return (
			<div {...this.getProps()} style={{ background: this.props.node.color }}>
				<div className={this.bem("__title")}>
					<div className={this.bem("__name")}>NODEID {this.props.node.id}</div>
					<div className={this.bem("__in")}>
						{_.map(this.props.node.getInPorts(), this.generatePort.bind(this))}
					</div>
				</div>
				<div className={this.bem("__body")}>

					<div className={this.bem("__texts")}>
						{_.map(this.props.node.getStep() && this.props.node.getStep().texts, this.generateBody.bind(this))}
					</div>
					{
						this.props.node.getStep() &&  <img  style={{ "width": "100px"}}
						 src="https://images.pexels.com/photos/20787/pexels-photo.jpg?auto=compress&cs=tinysrgb&h=350"
						 alt="new"
						 />
					}
				</div>
				<div className={this.bem("__ports")}>
					<div className={this.bem("__out")}>
						{_.map(this.props.node.getOutPorts(), this.generatePort.bind(this))}
					</div>
				</div>
			</div>
		);
	}
}
