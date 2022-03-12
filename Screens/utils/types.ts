import { SkImage, SkPath, SkRect } from '@shopify/react-native-skia';

export type DrawingElementType = 'path' | 'image';

export type PathType = 'normal' | 'dashed' | 'discreted';

export type DrawingElement = {
  type: DrawingElementType;
  path: SkPath;
} & (
  | { type: 'path'; pathType: PathType; path: SkPath; color: number; size: number; }
  | { type: 'image'; path: SkPath; image: SkImage }
);

export type Menu = 'drawing' | 'chooseSticker' | 'selection' | 'colors';
export type Tool = 'draw' | 'selection' | 'sticker';

export type ResizeMode = 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight';

export type UxState = {
  menu: Menu | undefined;
  modalVisible: boolean;
};

export type UxCommands = {
  toggleMenu: (menu: Menu | undefined) => void;
  toggleModal: (visible: boolean) => void;
};

export type UxContextType = {
  state: UxState;
  commands: UxCommands;
  addListener: (listener: (state: UxState) => void) => () => void;
};

export type DrawingElements = DrawingElement[];

export type DrawState = {
  color: number;
  size: number;
  elements: DrawingElements;
  selectedElements: DrawingElements;
  currentSelectionRect: SkRect | undefined;
  resizeMode: ResizeMode | undefined;
  backgroundColor: number;
  pathType: PathType;
};

export type DrawCommands = {
  setSize: (size: number) => void;
  setColor: (color: number) => void;
  setBackgroundColor: (color: number) => void;
  addElement: (element: DrawingElement) => void;
  deleteSelectedElements: () => void;
  deleteAllElements: () => void;
  setPathType: (type: PathType) => void;
  setSelectedElements: (...elements: DrawingElements) => void;
  setSelectionRect: (selection: SkRect | undefined) => void;
  setResizeMode: (resizeMode: ResizeMode | undefined) => void;
  cleanUseless: () => Promise<void>;
};

export type DrawContextType = {
  state: DrawState;
  commands: DrawCommands;
  addListener: (listener: (state: DrawState) => void) => () => void;
};
