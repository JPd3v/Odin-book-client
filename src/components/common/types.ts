interface ITextEdition {
  text: string;
  id: string;
}

interface ITextEditionErrors {
  response: IErrorEditionResponse;
}

interface IErrorEditionResponse {
  status: number;
  data: IErrorEditionResponseData;
}

interface IErrorEditionResponseData {
  message?: string;
  errors?: [{ msg: string }];
}

export type { ITextEdition, ITextEditionErrors };
