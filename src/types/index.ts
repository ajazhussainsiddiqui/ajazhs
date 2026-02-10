import { DocumentReference, Timestamp } from "firebase/firestore";

export type BlockType = 'text' | 'spacer';

export interface BaseBlock {
  id: string;
  type: BlockType;
  order: number;
  column?: number;
  className?: string;
}

export interface TextBlock extends BaseBlock {
  type: 'text';
  content: string; // Markdown content
}

export interface SpacerBlock extends BaseBlock {
  type: 'spacer';
  height: number;
}

export type ContentBlock = TextBlock | SpacerBlock;

export type PageLayout = 'single' | 'two-column' | 'three-column' | 'four-column' | 'five-column' | 'six-column' | 'grid' | 'masonry';

export interface PageContent {
  id: string;
  title?: string;
  layout: PageLayout;
  columnLayout?: number[];
  blocks?: ContentBlock[] | ContentBlock[][];
  createdAt?: Timestamp;
  order?: number;
}
