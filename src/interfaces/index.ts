export interface IColumnFileManger {
  key: string;
  title: string;
  align?: '' | 'center' | 'left' | 'end' | 'right' | 'start';
  width: number | string;
  visible: boolean;
}

export interface IActionFM {
  key: string;
  title: string;
  visible: boolean;
  icon?: string;
  subMenus?: IActionFM[];
  disabled?: boolean;
}

export interface ITreeFolder {
  name: string;
  path: string;
  children?: ITreeFolder[];
}
