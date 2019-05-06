// tslint:disable
export interface StepAction {
  nextStepId?: number;
  text?: string;
}


export interface Step {
  id: number;
  name: string;
  isEntry: boolean;
  texts?: (string)[] | null;
  type: string;
  actions: StepAction[];
}
