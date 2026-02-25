export type StepType =
  | "info"
  | "multiple-choice"
  | "text-input"
  | "form"
  | "completion";

export interface BaseStep {
  id: string;
  type: StepType;
  videoUrl: string;
  question?: string;
}

export interface InfoStep extends BaseStep {
  type: "info";
}

export interface MultipleChoiceStep extends BaseStep {
  type: "multiple-choice";
  question: string;
  options: {
    id: string;
    label: string;
  }[];
  fieldName: string;
}

export interface TextInputStep extends BaseStep {
  type: "text-input";
  question: string;
  placeholder?: string;
  fieldName: string;
  inputType?: "text" | "textarea";
}

export interface FormSteps extends BaseStep {
  type: "form";
  question: string;
  fields: {
    name: string;
    label: string;
    type: "text" | "email" | "tel";
    placeholder?: string;
    required?: boolean;
  }[];
}

export interface CompletionStep extends BaseStep {
  type: "completion";
  title: string;
  message: string;
}

export type FormStep =
  | InfoStep
  | MultipleChoiceStep
  | TextInputStep
  | FormSteps
  | CompletionStep;

export interface FormData {
  [key: string]: string | { [key: string]: string };
}

export interface SubmissionData extends FormData {
  submittedAt: string;
  sessionId: string;
}
