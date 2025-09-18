
import { Collection, Item } from './types';

interface WordLevelItem extends Omit<Item, 'id'> {
  term: string;
  definition: string;
  synonym: string;
  category: string;
  subtopic: string;
}

const wordLevels: Record<string, WordLevelItem[]> = {
  Dawn: [
    { term: 'Sun', definition: 'The star around which the earth orbits.', synonym: 'Daystar', category: 'Nature', subtopic: 'Celestial' },
    { term: 'Sky', definition: 'The region of the atmosphere and outer space seen from the earth.', synonym: 'Heavens', category: 'Nature', subtopic: 'Atmosphere' },
    { term: 'Water', definition: 'A colorless, transparent, odorless liquid.', synonym: 'H2O', category: 'Nature', subtopic: 'Elements' },
    { term: 'Eat', definition: 'To put food into the mouth and chew and swallow it.', synonym: 'Consume', category: 'Actions', subtopic: 'Basic Verbs' },
    { term: 'Run', definition: 'To move at a speed faster than a walk.', synonym: 'Sprint', category: 'Actions', subtopic: 'Basic Verbs' },
    { term: 'Happy', definition: 'Feeling or showing pleasure or contentment.', synonym: 'Joyful', category: 'Feelings', subtopic: 'Adjectives' },
    { term: 'Sad', definition: 'Feeling or showing sorrow; unhappy.', synonym: 'Unhappy', category: 'Feelings', subtopic: 'Adjectives' },
    { term: 'Big', definition: 'Of considerable size, extent, or intensity.', synonym: 'Large', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Small', definition: 'Of a size that is less than normal or usual.', synonym: 'Little', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Day', definition: 'Each of the twenty-four-hour periods.', synonym: 'Daytime', category: 'Time', subtopic: 'Concepts' },
    { term: 'Night', definition: 'The period of darkness in each twenty-four hours.', synonym: 'Nighttime', category: 'Time', subtopic: 'Concepts' },
    { term: 'Friend', definition: 'A person whom one knows and has a bond of mutual affection.', synonym: 'Companion', category: 'People', subtopic: 'Relationships' },
  ],
  Rise: [
    { term: 'Journey', definition: 'An act of traveling from one place to another.', synonym: 'Trip', category: 'Travel', subtopic: 'Nouns' },
    { term: 'Discover', definition: 'To find something unexpectedly.', synonym: 'Find', category: 'Actions', subtopic: 'Exploration Verbs' },
    { term: 'Create', definition: 'To bring something into existence.', synonym: 'Make', category: 'Actions', subtopic: 'Creative Verbs' },
    { term: 'Beautiful', definition: 'Pleasing the senses or mind aesthetically.', synonym: 'Pretty', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Important', definition: 'Of great significance or value.', synonym: 'Vital', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Question', definition: 'A sentence worded to elicit information.', synonym: 'Inquiry', category: 'Communication', subtopic: 'Nouns' },
    { term: 'Answer', definition: 'A reaction to a question, statement, or situation.', synonym: 'Response', category: 'Communication', subtopic: 'Nouns' },
    { term: 'Believe', definition: 'To accept something as true.', synonym: 'Trust', category: 'Cognition', subtopic: 'Verbs' },
    { term: 'Develop', definition: 'To grow or cause to grow and become more mature.', synonym: 'Grow', category: 'Actions', subtopic: 'Process Verbs' },
    { term: 'Environment', definition: 'The surroundings or conditions in which a being lives.', synonym: 'Surroundings', category: 'Nature', subtopic: 'Concepts' },
  ],
  Zenith: [
    { term: 'Analyze', definition: 'To examine methodically and in detail.', synonym: 'Examine', category: 'Cognition', subtopic: 'Verbs' },
    { term: 'Consequence', definition: 'A result or effect of an action or condition.', synonym: 'Result', category: 'Concepts', subtopic: 'Cause and Effect' },
    { term: 'Intricate', definition: 'Very complicated or detailed.', synonym: 'Complex', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Perspective', definition: 'A particular attitude toward something; a point of view.', synonym: 'Viewpoint', category: 'Cognition', subtopic: 'Nouns' },
    { term: 'Elaborate', definition: 'Involving many carefully arranged parts or details.', synonym: 'Detailed', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Phenomenon', definition: 'A fact or situation that is observed to exist or happen.', synonym: 'Occurrence', category: 'Concepts', subtopic: 'General' },
    { term: 'Significant', definition: 'Sufficiently great or important to be worthy of attention.', synonym: 'Meaningful', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Theory', definition: 'A supposition or a system of ideas intended to explain something.', synonym: 'Hypothesis', category: 'Science', subtopic: 'Concepts' },
    { term: 'Versatile', definition: 'Able to adapt to many different functions or activities.', synonym: 'Adaptable', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Crucial', definition: 'Decisive or critical, especially in the success or failure of something.', synonym: 'Essential', category: 'Descriptions', subtopic: 'Adjectives' },
  ],
  Sundown: [
    { term: 'Ambiguous', definition: 'Open to more than one interpretation.', synonym: 'Unclear', category: 'Language', subtopic: 'Adjectives' },
    { term: 'Quintessential', definition: 'Representing the most perfect or typical example.', synonym: 'Typical', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Ubiquitous', definition: 'Present, appearing, or found everywhere.', synonym: 'Everywhere', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Ephemeral', definition: 'Lasting for a very short time.', synonym: 'Fleeting', category: 'Time', subtopic: 'Adjectives' },
    { term: 'Meticulous', definition: 'Showing great attention to detail; very careful.', synonym: 'Careful', category: 'Descriptions', subtopic: 'Adjectives' },
    { term: 'Juxtaposition', definition: 'Placing two things together with contrasting effect.', synonym: 'Comparison', category: 'Language', subtopic: 'Nouns' },
    { term: 'Plethora', definition: 'A large or excessive amount of something.', synonym: 'Excess', category: 'Measurements', subtopic: 'Nouns' },
    { term: 'Serendipity', definition: 'The occurrence of events by chance in a happy way.', synonym: 'Good fortune', category: 'Concepts', subtopic: 'Fortune' },
    { term: 'Esoteric', definition: 'Understood by only a small number of people.', synonym: 'Obscure', category: 'Knowledge', subtopic: 'Adjectives' },
    { term: 'Cacophony', definition: 'A harsh, discordant mixture of sounds.', synonym: 'Noise', category: 'Sound', subtopic: 'Nouns' },
  ],
  Twilight: [
    { term: 'Pulchritudinous', definition: 'Having great physical beauty.', synonym: 'Beautiful', category: 'Descriptions', subtopic: 'Aesthetics' },
    { term: 'Penultimate', definition: 'Last but one in a series; second to the last.', synonym: 'Second to last', category: 'Sequence', subtopic: 'Adjectives' },
    { term: 'Syzygy', definition: 'A conjunction or opposition, especially of the moon with the sun.', synonym: 'Alignment', category: 'Astronomy', subtopic: 'Nouns' },
    { term: 'Indefatigable', definition: 'Persisting tirelessly.', synonym: 'Tireless', category: 'Descriptions', subtopic: 'Personality' },
    { term: 'Grandiloquent', definition: 'Pompous or extravagant in language or style.', synonym: 'Pompous', category: 'Language', subtopic: 'Adjectives' },
    { term: 'Obsequious', definition: 'Obedient or attentive to an excessive degree.', synonym: 'Servile', category: 'Descriptions', subtopic: 'Personality' },
    { term: 'Vicissitude', definition: 'A change of circumstances or fortune.', synonym: 'Change', category: 'Concepts', subtopic: 'Fortune' },
    { term: 'Perspicacious', definition: 'Having a ready insight into and understanding of things.', synonym: 'Insightful', category: 'Cognition', subtopic: 'Adjectives' },
    { term: 'Alacrity', definition: 'Brisc and cheerful readiness.', synonym: 'Eagerness', category: 'Feelings', subtopic: 'Nouns' },
    { term: 'Enervate', definition: 'To cause someone to feel drained of energy; weaken.', synonym: 'Weaken', category: 'Actions', subtopic: 'Negative Verbs' },
  ],
  Midnight: [
    { term: 'Logomachy', definition: 'An argument about words.', synonym: 'Word debate', category: 'Language', subtopic: 'Nouns' },
    { term: 'Floccinaucinihilipilification', definition: 'The action of estimating something as worthless.', synonym: 'Deeming worthless', category: 'Cognition', subtopic: 'Nouns' },
    { term: 'Borborygmus', definition: 'A rumbling noise made by the movement of fluid and gas in the intestines.', synonym: 'Stomach rumbling', category: 'Biology', subtopic: 'Sounds' },
    { term: 'Sesquipedalian', definition: 'Characterized by long words; long-winded.', synonym: 'Long-winded', category: 'Language', subtopic: 'Adjectives' },
    { term: 'Weltanschauung', definition: 'A particular philosophy or view of life.', synonym: 'Worldview', category: 'Philosophy', subtopic: 'Nouns' },
    { term: 'Zugzwang', definition: 'A situation where a player is forced to make a disadvantageous move.', synonym: 'Forced move', category: 'Games', subtopic: 'Chess' },
    { term: 'Antidisestablishmentarianism', definition: 'Opposition to the disestablishment of the Church of England.', synonym: 'Political position', category: 'Politics', subtopic: 'Nouns' },
    { term: 'Ultracrepidarian', definition: 'A person who gives opinions on matters outside of one\'s knowledge.', synonym: 'Armchair expert', category: 'People', subtopic: 'Nouns' },
    { term: 'Defenestration', definition: 'The action of throwing someone out of a window.', synonym: 'Window tossing', category: 'Actions', subtopic: 'Nouns' },
    { term: 'Onomatopoeia', definition: 'The formation of a word from a sound associated with what is named.', synonym: 'Sound word', category: 'Language', subtopic: 'Nouns' },
  ],
};

const generateInitialCollections = (): Collection[] => {
  const allRootCollections: Collection[] = [];
  const levelNames = ['Dawn', 'Rise', 'Zenith', 'Sundown', 'Twilight', 'Midnight'];

  levelNames.forEach(levelName => {
    const levelItems = wordLevels[levelName]?.map((item, index) => ({
      ...item,
      id: `item-${levelName.toLowerCase()}-${index}`,
    })) || [];

    const rootCollection: Collection = {
      id: `collection-${levelName.toLowerCase()}`,
      name: levelName,
      lists: [{
        id: `list-${levelName.toLowerCase()}-all`,
        name: 'All',
        items: levelItems,
      }],
      subCollections: [],
    };

    const categories = [...new Set(levelItems.map(item => item.category))];
    
    categories.forEach(category => {
      if (!category) return;
      
      const categoryItems = levelItems.filter(item => item.category === category);
      
      const categoryCollection: Collection = {
        id: `collection-${levelName.toLowerCase()}-${category.toLowerCase().replace(/\s+/g, '')}`,
        name: category,
        lists: [],
      };

      categoryCollection.lists.push({
        id: `list-${levelName.toLowerCase()}-${category.toLowerCase().replace(/\s+/g, '')}-all`,
        name: `All ${category} Items`,
        items: categoryItems,
      });

      const subtopics = [...new Set(categoryItems.map(item => item.subtopic))];
      subtopics.forEach(subtopic => {
        if (!subtopic) return;
        
        const subtopicItems = categoryItems.filter(item => item.subtopic === subtopic);
        categoryCollection.lists.push({
          id: `list-${levelName.toLowerCase()}-${category.toLowerCase().replace(/\s+/g, '')}-${subtopic.toLowerCase().replace(/\s+/g, '')}`,
          name: subtopic,
          items: subtopicItems,
        });
      });
      
      rootCollection.subCollections?.push(categoryCollection);
    });
    
    allRootCollections.push(rootCollection);
  });

  return allRootCollections;
};


export const initialCollections: Collection[] = generateInitialCollections();