declare module "machinelearn/text" {
  export class TfidfVectorizer {
    fit_transform(corpus: string[]): any;
    transform(corpus: string[]): any;
  }
}

declare module "machinelearn/metric" {
  export function cosine_similarity(a: any, b: any): number[][];
}
