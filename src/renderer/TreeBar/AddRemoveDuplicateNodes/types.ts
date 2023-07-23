export type CustomData = {
    fileType: string;
  };
  
  export type NodeModel<T = unknown> = {
    id: number;
    is_creating: boolean;
    parent: number;
    droppable?: boolean;
    text: string;
    data?: T;
  };
  