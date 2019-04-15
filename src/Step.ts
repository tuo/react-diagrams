// tslint:disable
export interface Step {
  id: number
  name: string;
  isEntry: boolean;
  texts?: (string)[] | null;
  type: string;
  actions: any;
}
// export interface StepAction {
//   text: string;
//   nextStepId: number;
// }
