
import { items as allItems, categories as allCategories } from '../data/items';
import { Item } from '../types';

export const resolveItemCategory = (item: Item) => {
  return allItems.find(i => i.id === item.id)?.definition || null;
};

export const getCategoryById = (id: string) => {
    return allCategories.find(c => c.id === id);
}
