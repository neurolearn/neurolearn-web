/* @flow */

export default {
  MOST_IMAGES: {
    title: 'Most images',
    option: { 'number_of_images': { 'order': 'desc'}}
  },

  FEWEST_IMAGES: {
    title: 'Fewest images',
    option: {}
  },

  RECENTLY_UPDATED: {
    title: 'Recently updated',
    option: { 'modify_date': { 'order': 'desc'}}
  }
};
