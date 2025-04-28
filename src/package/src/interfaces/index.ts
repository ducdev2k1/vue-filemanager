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

export interface ITreeNodeData {
  [key: string]: any;
}

export interface ITreeViewProps {
  node: ITreeNodeData;
  itemTitle?: string;
  itemValue?: string;
  itemProps?: (item: ITreeNodeData) => Record<string, any>;
  loadChildren?: (item: ITreeNodeData) => Promise<void>;
  openNodes: Set<string>;
  activeNode: string[];
  activatable?: boolean;
  activeClass?: string;
  modelValue?: string[];
  items?: ITreeNodeData[];
}
