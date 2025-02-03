interface IfCondOptions {
  fn: (context: any) => string;
  inverse: (context: any) => string;
}

interface Document {
  html: string;
  data: any;
  type: "buffer" | "stream" | "file";
  path?: string;
}
