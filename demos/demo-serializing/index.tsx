// tslint:disable no-bitwise
import { DiagramEngine, DiagramModel, DefaultNodeModel, LinkModel, DiagramWidget, Step } from "storm-react-diagrams";
import * as React from "react";
import { DemoWorkspaceWidget } from "../.helpers/DemoWorkspaceWidget";
import { action } from "@storybook/addon-actions";
import * as beautify from "json-beautify";
import * as _ from "lodash";

const allStepsJson = {"list":{"count":6,"rows":[{"id":7,"name":"location","type":"Options","texts":["欢迎","你好"],"actions":[{"text":"yes","nextStepId":3},{"text":"no"}],"isEntry":true,"createdAt":"2019-04-09T04:29:07.768Z","updatedAt":"2019-04-09T04:29:07.768Z"},{"id":1,"name":"address","type":"Input","texts":["输入地址"],"actions":{},"isEntry":false,"createdAt":"2019-04-05T13:39:50.261Z","updatedAt":"2019-04-15T10:17:38.474Z"},{"id":4,"name":"test","type":"Options","texts":["121221"],"actions":[{"text":"yes","nextStepId":1},{"text":"no"}],"isEntry":null,"createdAt":"2019-04-05T11:00:32.862Z","updatedAt":"2019-04-05T11:00:32.862Z"},{"id":3,"name":"weather","type":"Options","texts":["天气咋样","冷不冷","实话"],"actions":["冷","好冷","热"],"isEntry":null,"createdAt":"2019-04-05T10:51:12.334Z","updatedAt":"2019-04-05T10:51:12.334Z"},{"id":2,"name":"usage","type":"Options","texts":["你干啥的","ganma "],"actions":["yes","no"],"isEntry":null,"createdAt":"2019-04-05T10:50:25.231Z","updatedAt":"2019-04-05T10:50:25.231Z"},{"id":6,"name":"thanks","type":"None","texts":["Thanks for the inquiry"],"actions":null,"isEntry":null,"createdAt":"2019-04-05T10:39:48.154Z","updatedAt":"2019-04-05T10:39:48.154Z"}]}}


const allStepsData = allStepsJson.list.rows;


let breadthFirstLinksBuild = (step, s) => {
	//if(step.is)
	//1. create node
	var node = new DefaultNodeModel("Node 1", "rgb(0,192,255)", ['yes', 'no'], step);
	//if is entry ignore the in port
	let inPort = null;
	if(!step.isEntry){
		//add input
		inPort = node.addInPort("In");
	}


	//check its


	//if(step.)
  //   let vs = vertices.map((v, i) => {
  //   	return Object.assign( {}, v, {color: 'white', distance: Infinity, parent: null, id: `edge ${i}`});
  //   });
  //   Object.assign(vs[s], {color: 'grey', distance: 0});
	//
  //   let Q = [s];
  //   while (Q.length) {
	// let v = vs[Q.shift()];
	// const d = v.distance+1;
	// v.edges.filter(e => vs[e].color === 'white').forEach(e => {
	//     Object.assign(vs[e], { color: 'grey', distance: d, parent: v.id});
	//     Q.push(e);
  //       });
  //       v.color = 'black';
  //   }
  //   return vs;
};


export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.installDefaultFactories();

	//2) setup the diagram model
	var model = new DiagramModel();

	console.log("allStepsJson data", allStepsData)

	const nodes = [];
	const stepIdToNode = {}
	allStepsData.forEach((step, index) => {
		console.log("index", index);
		var node = new DefaultNodeModel("Node 1", "rgb(0,192,255)", ['yes', 'no'], step);
		//if is entry ignore the in port
		// if(!step.isEntry){
		// 	//add input
		// 	node.addInPort("In");
		// 	//node3.setPosition(400, 200);
		// }
		// let portYes = node1.addOutPort("yes");
		// let portNo = node1.addOutPort("no");
		// let portNotSUre = node1.addOutPort("not sure");
		// node1.setPosition(100, 100);
		node.setPosition(Math.random() * 100, Math.random() * 500);
		nodes.push(node);
		stepIdToNode[step.id] = node;
		model.addNode(node);
	});
	//create port for output
	const rootNode = _.find(nodes, node => {
		return node.getStep().isEntry;
	});
	//breadthFirstLinksBuild(stepIdToNode, rootNode)

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


		const step2: Step = {
			id: 2,
			name: "Test",
			isEntry: false,
			type: 'Options',
			texts: ['欢迎来到'],
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

	var node1 = new DefaultNodeModel("Node 1", "rgb(0,192,255)", ['yes', 'no']);
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

	var node3 = new DefaultNodeModel("Node 3", "rgb(192,215,0)", []);
	let port3 = node3.addInPort("In");
	node3.setPosition(400, 200);


	//4) add the models to the root graph
	//model.addAll(node1, node2, link1, node3);


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
