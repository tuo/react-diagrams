import * as React from "react";
import { DefaultPortModel } from "../models/DefaultPortModel";
import { PortWidget } from "../../widgets/PortWidget";
import { BaseWidget, BaseWidgetProps } from "../../widgets/BaseWidget";

export interface DefaultPortLabelProps extends BaseWidgetProps {
	model: DefaultPortModel;
}

export interface DefaultPortLabelState {}

/**
 * @author Dylan Vorster
 */
export class DefaultPortLabel extends BaseWidget<DefaultPortLabelProps, DefaultPortLabelState> {
	constructor(props) {
		super("srd-default-port", props);
	}

	getClassName() {
		return super.getClassName() + (this.props.model.in ? this.bem("--in") : this.bem("--out"));
	}

	render() {
		var port = <div><PortWidget node={this.props.model.getParent()} name={this.props.model.name} /></div>;
		var label = <div className="name">{this.props.model.in ? '' : this.props.model.label}</div>;
		//var borderClz = this.props.model.in ? "1px solid red": "1px solid purple"
		return (
			<div {...this.getProps()} style={{"border": ''}}>
				{this.props.model.in ? port : label}
				{this.props.model.in ? label : port}
			</div>
		);
	}
}
