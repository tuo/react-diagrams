// tslint:disable no-bitwise
import { DiagramEngine, DiagramModel, DefaultNodeModel, LinkModel, DiagramWidget, Step } from "storm-react-diagrams";
import * as React from "react";
import { DemoWorkspaceWidget } from "../.helpers/DemoWorkspaceWidget";
import { action } from "@storybook/addon-actions";
import * as beautify from "json-beautify";
import * as _ from "lodash";
import { distributeElements } from "./dagre-utils";

const allStepsJson = {
  "list" : {
    "count" : 6,
    "rows" : [
      {
        "updatedAt" : "2019-04-09T04:29:07.768Z",
        "id" : 7,
        "texts" : [
          "欢迎",
          "你好"
        ],
        "isEntry" : true,
        "type" : "Options",
        "createdAt" : "2019-04-09T04:29:07.768Z",
        "name" : "location",
        "actions" : [
          {
            "nextStepId" : 3,
            "text" : "茶"
          },
          {
            "text" : "咖啡",
            "nextStepId" : 1,
          },
					{
            "text" : "牛奶"
          },
					{
            "text" : "矿泉水",
            "nextStepId" : 4,
          },
        ]
      },
      {
        "updatedAt" : "2019-04-15T10:17:38.474Z",
        "id" : 1,
        "texts" : [
          "输入地址"
        ],
        "isEntry" : false,
        "type" : "Input",
        "createdAt" : "2019-04-05T13:39:50.261Z",
        "name" : "address",
        "actions" : [
          {nextStepId : 6, text: ""},
        ]
      },
      {
        "updatedAt" : "2019-04-05T11:00:32.862Z",
        "id" : 4,
        "texts" : [
          "121221"
        ],
        "isEntry" : null,
        "type" : "Options",
        "createdAt" : "2019-04-05T11:00:32.862Z",
        "name" : "test",
        "actions" : [
          {
            "nextStepId" : 1,
            "text" : "yes"
          },
          {
            "text" : "no"
          }
        ]
      },
      {
        "updatedAt" : "2019-04-05T10:51:12.334Z",
        "id" : 3,
        "texts" : [
          "天气咋样",
          "冷不冷",
          "实话"
        ],
        "isEntry" : null,
        "type" : "Options",
        "createdAt" : "2019-04-05T10:51:12.334Z",
        "name" : "weather",
        "actions" : [

        ]
      },
      {
        "updatedAt" : "2019-04-05T10:50:25.231Z",
        "id" : 2,
        "texts" : [
          "你干啥的",
          "ganma "
        ],
        "isEntry" : null,
        "type" : "Options",
        "createdAt" : "2019-04-05T10:50:25.231Z",
        "name" : "usage",
        "actions" : [
          {
            "nextStepId" : 2,
            "text" : "搬砖"
          },
          {
            "text" : "码农"
          }
        ]
      },
      {
        "updatedAt" : "2019-04-05T10:39:48.154Z",
        "id" : 6,
        "texts" : [
          "Thanks for the inquiry"
        ],
        "isEntry" : null,
        "type" : "None",
        "createdAt" : "2019-04-05T10:39:48.154Z",
        "name" : "thanks",
        "actions" : [

        ]
      }
    ]
  }
}

const allStepsData = allStepsJson.list.rows;


let breadthFirstLinksBuild = (stepIdToNode, nodesArr, model) => {

  let nextNodesArr: DefaultNodeModel[] = [];
  let stepIds: string[] = [];
  console.log("loop nodes", nodesArr);
  nodesArr.forEach((rootNode, index) => {
    const step = rootNode.getStep();
    step.actions.forEach((action, index) => {
        //node.addOutPort(action.text);

        const nextStepId = action.nextStepId;
        const portOut = rootNode.getOutPortByStepId(nextStepId);
        const nextNode = stepIdToNode[nextStepId];
        if(nextNode){
          const portIn = nextNode.getInPort();
          console.log(`portOut: ${portOut}, portIn: ${portIn}`);
          if(portOut && portIn){

              let link1 = portOut.link(portIn);
              model.addLink(link1);
          }
          if(stepIds.indexOf(nextStepId) === -1){
              stepIds.push(nextStepId);
              nextNodesArr.push(nextNode);
          }
          console.log(`nextStepId: ${nextStepId}, action: ${JSON.stringify(action)} NODE exist`);
        }else{
          console.log(`nextStepId: ${nextStepId}, action: ${JSON.stringify(action)} NODE not exist`);
        }
    });
  });
  console.log("nextNodesArr.length: ", nextNodesArr);
  if(nextNodesArr.length > 0){
    breadthFirstLinksBuild(stepIdToNode, nextNodesArr, model)
  }
};

function getDistributedModel(engine, model) {
	const serialized = model.serializeDiagram();
	const distributedSerializedDiagram = distributeElements(serialized);

	//deserialize the model
	let deSerializedModel = new DiagramModel();
	deSerializedModel.deSerializeDiagram(distributedSerializedDiagram, engine);
	return deSerializedModel;
}

class Demo8Widget extends React.Component<any, any> {
	constructor(props) {
		super(props);
		this.state = {};
		this.autoDistribute = this.autoDistribute.bind(this);
	}

	autoDistribute() {
		const { engine } = this.props;
		const model = engine.getDiagramModel();
		let distributedModel = getDistributedModel(engine, model);
		engine.setDiagramModel(distributedModel);
		this.forceUpdate();
	}

	render() {
		const { engine } = this.props;

		return (
			<DemoWorkspaceWidget buttons={<button onClick={this.autoDistribute}>Re-distribute</button>}>
				<DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />
			</DemoWorkspaceWidget>
		);
	}
}

export default () => {
	//1) setup the diagram engine
	var engine = new DiagramEngine();
	engine.installDefaultFactories();

	//2) setup the diagram model
	var model = new DiagramModel();

	console.log("allStepsJson data", allStepsData)

	const nodes: DefaultNodeModel[] = [];
	const stepIdToNode = {}
	allStepsData.forEach((step, index) => {
		console.log("index", index, step.actions);
		var node = new DefaultNodeModel(step.name, "rgb(0,192,255)", ['yes', 'no'], step);
		//if is entry ignore the in port
		if(!step.isEntry){
			//add input
			node.addInPort("In");
		}

		//console.log(typeof step.actions)
		const { actions } = step;
		if(_.isArray(actions)){
			  actions.forEach((action, index) => {
						//node.addOutPort(action.text);
            node.addOutPortAction(action);
				});
		}
		// let portYes = node1.addOutPort("yes");
		// let portNo = node1.addOutPort("no");
		// let portNotSUre = node1.addOutPort("not sure");
		// node1.setPosition(100, 100);
		//node.setPosition(Math.random() * 500, Math.random() * 500);
    //node.x = index * 170;
		//node.y = //index * 170;

		nodes.push(node);
		stepIdToNode[step.id] = node;
		model.addNode(node);
	});
	//create port for output
	const rootNode = _.find(nodes, node => {
		return node.getStep().isEntry;
	});
	breadthFirstLinksBuild(stepIdToNode, [rootNode], model);


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




	//4) add the models to the root graph
	//model.addAll(node1, node2, link1, node3);


	//5) load model into engine
	//engine.setDiagramModel(model);

  //5) load model into engine
	let model3 = getDistributedModel(engine, model);
	engine.setDiagramModel(model3);


	//!------------- SERIALIZING ------------------

	//var str = JSON.stringify(model.serializeDiagram());

	//!------------- DESERIALIZING ----------------

	//var model2 = new DiagramModel();
	//model2.deSerializeDiagram(JSON.parse(str), engine);
	//engine.setDiagramModel(model2);
	return <Demo8Widget engine={engine} />;
	// return (
	// 	<DemoWorkspaceWidget
	// 		buttons={
	// 			<button
	// 				onClick={() => {
	// 					action("Serialized Graph")(beautify(model3.serializeDiagram(), null, 2, 80));
	// 				}}
	// 			>
	// 				Serialize Graph
	// 			</button>
	// 		}
	// 	>
	// 		<DiagramWidget className="srd-demo-canvas" diagramEngine={engine} />
	// 	</DemoWorkspaceWidget>
	// );
};
