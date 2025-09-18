
export interface Item {
  id: string;
  term: string;
  definition: string;
  synonym?: string;
  category?: string;
  subtopic?: string;
  topic?: string;
  example?: string;
  question?: string;
  answer?: string;
  srsLevel?: number;
  nextReview?: number;
}

export interface List {
  id: string;
  name: string;
  items: Item[];
}

export interface Collection {
  id:string;
  name: string;
  lists: List[];
  subCollections?: Collection[];
}

export enum Game {
  Flashcards = 'Flashcards',
  MatchingPairs = 'Matching Pairs',
  SpinningWheel = 'Spinning Wheel',
  Invaders = 'Invaders',
  SequenceMemory = 'Sequence Memory',
  Categorizing = 'Categorizing',
  Leap = 'LEAP!',
  SpellingBee = 'Spelling Bee',
  Quiz = 'Quiz',
  DataDeck = 'Data Deck',
  Chess = 'Chess',
  OracleBall = 'Oracle Sphere',
}

export enum View {
  GameMenu = 'GameMenu',
  ListEditor = 'ListEditor',
  Game = 'Game',
  AiChat = 'AiChat',
  Dictionary = 'Dictionary',
  ListFactory = 'ListFactory',
}

export type AppState =
  | { view: View.GameMenu }
  | { view: View.ListEditor; listId: string }
  | { view: View.Game; listId: string; game: Game; cue: keyof Item }
  | { view: View.AiChat }
  | { view: View.Dictionary }
  | { view: View.ListFactory };


export interface DictionaryEntry {
  id: string;
  word: string;
  phonetic: string;
  meanings: {
    partOfSpeech: string;
    definitions: {
      definition: string;
      example: string;
    }[];
  }[];
}

export interface GameResult {
  game: string;
  listName: string;
  score: number;
  total?: number;
  mistakes?: Item[];
  timestamp: number;
}

export type UserProgress = GameResult[];