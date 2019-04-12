import { DiagramEngine, DiagramModel, DefaultNodeModel, LinkModel, DiagramWidget, Step, StepAction } from "storm-react-diagrams";
import * as React from "react";
import { DemoWorkspaceWidget } from "../.helpers/DemoWorkspaceWidget";
import { action } from "@storybook/addon-actions";
import * as beautify from "json-beautify";

export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.installDefaultFactories();

	//2) setup the diagram model
	var model = new DiagramModel();

	const step1: Step = {
		id: 1,
		name: "Hello",
		isEntry: true,
		type: 'Options',
		texts: ['Welcome bro', 'Ni hao'],
		actions: [
			{ text: "yes", nextStepId: 2},
			{ text: "no", nextStepId: -1},
		]
	}

	// const step1: Step = {
	// 	id: 2,
	// 	name: "Hello 2",
	// 	isEntry: false,
	// 	type: 'Options',
	// 	texts: ['test'],
	// 	actions: [
	// 		{ text: "no"}
	// 	]
	// }

	var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)", ['yes', 'no'], step1);
	let portYes = node1.addOutPort("yes");
	let portNo = node1.addOutPort("no");
	let portNotSUre = node1.addOutPort("not sure");
	node1.setPosition(100, 100);
	//port.maximumLinks = 1;

	//3-B) create another default node
	var node2 = new DefaultNodeModel("Node 2", "rgb(192,255,0)");
	let port2 = node2.addInPort("In");
	node2.setPosition(400, 100);

	// link the ports
	let link1 = portYes.link(port2);

	var node3 = new DefaultNodeModel("Node 3", "rgb(192,215,0)");
	let port3 = node3.addInPort("In");
	node3.setPosition(400, 200);


	//4) add the models to the root graph
	model.addAll(node1, node2, link1, node3);


	//5) load model into engine
	engine.setDiagramModel(model);

	//!------------- SERIALIZING ------------------

	var str = JSON.stringify(model.serializeDiagram());

	//!------------- DESERIALIZING ----------------

	var model2 = new DiagramModel();
	model2.deSerializeDiagram(JSON.parse(str), engine);
	engine.setDiagramModel(model2);

	return (
		<DemoWorkspaceWidget
			buttons={
				<button
					onClick={() => {
						action("Serialized Graph")(beautify(model2.serializeDiagram(), null, 2, 80));
					}}
				>
					Serialize Graph
				</button>
			}
		>
			<DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />
		</DemoWorkspaceWidget>
	);
};
