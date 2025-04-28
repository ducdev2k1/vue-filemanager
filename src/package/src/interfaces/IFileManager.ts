export interface IFileManager {
  key: string; //
  name: string;
  path: string;
  size: number;
  isDirectory: boolean;
  mime_type: string;

  [key: string]: any;
}
