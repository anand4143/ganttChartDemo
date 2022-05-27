export interface TreeNode {
  [x: string]: any;
  id: string,
  name: string;
  children: TreeNode[];
  isExpanded?: boolean;
}

export interface DropInfo {
  targetId: any;
  action?: string;
}


export var demoData: TreeNode[] = []
