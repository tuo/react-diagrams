import { DefaultPortModel } from "./DefaultPortModel";
import * as _ from "lodash";

import { NodeModel } from "../../models/NodeModel";
import { Toolkit } from "../../Toolkit";
import { Step, StepAction } from "../../Step";
import { DiagramEngine } from "../../DiagramEngine";

/**
 * @author Dylan Vorster
 */
export class DefaultNodeModel extends NodeModel {
	name: string;
	color: string;

	ports: { [s: string]: DefaultPortModel };
	options: Array<string>;
	step: Step;

	constructor(name: string = "Untitled", color: string = "rgb(0,192,255)", options: Array<string> = [], step: Step = null) {
		super("default");
		this.name = name;
		this.color = color;
		this.options = options;
		this.step = step;
	}

	addInPort(label: string): DefaultPortModel {
		return this.addPort(new DefaultPortModel(true, Toolkit.UID(), label, null));
	}

	addOutPort(label: string): DefaultPortModel {
		return this.addPort(new DefaultPortModel(false, Toolkit.UID(), label, null));
	}

	addOutPortAction(action: StepAction): DefaultPortModel {
		return this.addPort(new DefaultPortModel(false, Toolkit.UID(), action.text, action));
	}

	deSerialize(object, engine: DiagramEngine) {
		super.deSerialize(object, engine);
		this.name = object.name;
		this.color = object.color;
		this.options = object.options;
		this.step = object.step;
	}

	serialize() {
		return _.merge(super.serialize(), {
			name: this.name,
			color: this.color,
			options: this.options,
			step: this.step,
		});
	}

	getStep(): Step {
		return this.step;
	}

	getInPorts(): DefaultPortModel[] {
		return _.filter(this.ports, portModel => {
			return portModel.in;
		});
	}

	getInPort(): DefaultPortModel {
		return _.find(this.ports, portModel => {
			return portModel.in;
		});
	}

	getOutPorts(): DefaultPortModel[] {
		return _.filter(this.ports, portModel => {
			return !portModel.in;
		});
	}

	getOutPortByStepId(stepId: number): DefaultPortModel {
		return _.find(this.ports, portModel => {
			return portModel.action && portModel.action.nextStepId === stepId;
		});
	}
}
